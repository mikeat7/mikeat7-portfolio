"""
=============================================================
  MUSIC LIBRARY BUILDER  v1.0
  Requires: pip install mutagen
=============================================================
  What it does:
    - Scans one or more source folders
    - Qualifies good files: OK integrity, duration >= min_duration,
      best copy when duplicates exist (longest wins)
    - Reads ID3/RIFF tags via mutagen for artist + title
    - Falls back to parsing the filename if tags are missing
    - For vinyl folders: strips "side one/two/three/four",
      "Album", "Album 1", " 1", " 2" etc. from folder names
      to recover clean artist names
    - Copies (never moves) qualifying files to output folder
    - Organises output as: ArtistName - SongTitle.ext
      sorted alphabetically â€” one flat folder, no subfolders
    - Files with no usable metadata go to _needs_review\
    - Source folders are NEVER modified

  Usage:
    python library_builder.py "C:/Music/albums"
        --output "C:/Clean Library"

    Multiple sources:
    python library_builder.py
        "C:/Music/albums"
        "C:/Music/My Music"
        --output "C:/Clean Library"

  Optional flags:
    --min-duration 90       Minimum seconds to qualify (default 90)
    --exclude "voice files" Skip folders with this name (stackable)
    --dry-run               Show what would be copied without doing it
    --output "C:/path"      Destination folder (required)
    --report "my_report"    Base name for the report CSV
=============================================================
"""

import os
import sys
import csv
import re
import struct
import hashlib
import shutil
import argparse
import time
from pathlib import Path
from datetime import datetime
from collections import defaultdict

# â”€â”€ Try to import mutagen â”€â”€
try:
    from mutagen import File as MutagenFile
    from mutagen.id3 import ID3NoHeaderError
    MUTAGEN_OK = True
except ImportError:
    MUTAGEN_OK = False

# â”€â”€ ANSI colours â”€â”€
GREEN   = "\033[92m"
YELLOW  = "\033[93m"
RED     = "\033[91m"
CYAN    = "\033[96m"
MAGENTA = "\033[95m"
BOLD    = "\033[1m"
RESET   = "\033[0m"

# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
#  WAV INTEGRITY CHECK (from scanner v2.1)
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

def analyze_wav(path):
    """Returns (status, duration_sec, notes)"""
    try:
        size = os.path.getsize(path)
        if size < 44:
            return 'CORRUPT', 0.0, 'File too small to be valid WAV'
        with open(path, 'rb') as f:
            header = f.read(44)
            if header[:4] != b'RIFF' or header[8:12] != b'WAVE':
                return 'CORRUPT', 0.0, 'Not a valid RIFF/WAVE file'
            # scan for data chunk
            f.seek(12)
            data_offset = None
            data_size   = None
            while True:
                chunk_hdr = f.read(8)
                if len(chunk_hdr) < 8:
                    break
                chunk_id   = chunk_hdr[:4]
                chunk_size = struct.unpack('<I', chunk_hdr[4:])[0]
                if chunk_id == b'fmt ':
                    fmt = f.read(min(chunk_size, 16))
                    if len(fmt) >= 16:
                        channels   = struct.unpack('<H', fmt[2:4])[0]
                        samplerate = struct.unpack('<I', fmt[4:8])[0]
                        bit_depth  = struct.unpack('<H', fmt[14:16])[0]
                    else:
                        channels, samplerate, bit_depth = 2, 44100, 16
                    if chunk_size > 16:
                        f.seek(chunk_size - min(chunk_size, 16), 1)
                elif chunk_id == b'data':
                    data_offset = f.tell()
                    data_size   = chunk_size
                    break
                else:
                    f.seek(chunk_size, 1)

            if data_offset is None:
                return 'CORRUPT', 0.0, 'No data chunk found'

            bytes_per_sample = (bit_depth // 8) * channels
            if bytes_per_sample == 0 or samplerate == 0:
                return 'CORRUPT', 0.0, 'Invalid audio parameters'

            declared_dur = data_size / (bytes_per_sample * samplerate)
            actual_bytes = size - data_offset
            actual_dur   = actual_bytes / (bytes_per_sample * samplerate)

            if actual_bytes < data_size * 0.95:
                pct = actual_bytes / data_size * 100
                return 'TRUNCATED', actual_dur, f'Only {pct:.0f}% of audio data present'

            return 'OK', declared_dur, ''
    except Exception as e:
        return 'READ_ERROR', 0.0, str(e)


# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
#  MP3 INTEGRITY CHECK (from scanner v2.1)
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

def _find_sync(data, start=0):
    for i in range(start, len(data) - 1):
        if data[i] == 0xFF and (data[i+1] & 0xE0) == 0xE0:
            return i
    return -1

_MP3_BITRATES = [0,32,40,48,56,64,80,96,112,128,160,192,224,256,320,0]
_MP3_SRATES   = [44100,48000,32000,0]

def _parse_mp3_frame_header(b):
    if len(b) < 4:
        return None
    if b[0] != 0xFF or (b[1] & 0xE0) != 0xE0:
        return None
    layer      = (b[1] >> 1) & 0x03
    br_idx     = (b[2] >> 4) & 0x0F
    sr_idx     = (b[2] >> 2) & 0x03
    padding    = (b[2] >> 1) & 0x01
    if layer != 1 or br_idx in (0, 15) or sr_idx == 3:
        return None
    bitrate    = _MP3_BITRATES[br_idx] * 1000
    samplerate = _MP3_SRATES[sr_idx]
    frame_size = 144 * bitrate // samplerate + padding
    return {'bitrate': bitrate, 'samplerate': samplerate, 'frame_size': frame_size}

def analyze_mp3(path):
    """Returns (status, duration_sec, notes)"""
    try:
        size = os.path.getsize(path)
        with open(path, 'rb') as f:
            raw = f.read(min(size, 10 * 1024 * 1024))

        # Skip ID3v2
        offset = 0
        if raw[:3] == b'ID3':
            id3_size = ((raw[6]&0x7F)<<21)|((raw[7]&0x7F)<<14)|((raw[8]&0x7F)<<7)|(raw[9]&0x7F)
            offset = 10 + id3_size

        # Check Xing/VBRI header
        declared_frames = None
        sync = _find_sync(raw, offset)
        if sync >= 0:
            hdr = _parse_mp3_frame_header(raw[sync:sync+4])
            if hdr:
                xing_off = sync + 4 + (32 if True else 17)
                if raw[xing_off:xing_off+4] in (b'Xing', b'Info'):
                    flags = struct.unpack('>I', raw[xing_off+4:xing_off+8])[0]
                    if flags & 0x01:
                        declared_frames = struct.unpack('>I', raw[xing_off+8:xing_off+12])[0]
                elif raw[xing_off:xing_off+4] == b'VBRI':
                    declared_frames = struct.unpack('>I', raw[xing_off+14:xing_off+18])[0]

        # Count frames
        pos = offset
        frame_count = 0
        first_sr    = None
        while pos < len(raw) - 3:
            s = _find_sync(raw, pos)
            if s < 0:
                break
            h = _parse_mp3_frame_header(raw[s:s+4])
            if h:
                if first_sr is None:
                    first_sr = h['samplerate']
                frame_count += 1
                pos = s + h['frame_size']
            else:
                pos = s + 1

        if frame_count == 0:
            return 'CORRUPT', 0.0, 'No valid MP3 frames found'

        sr = first_sr or 44100
        duration = frame_count * 1152 / sr

        if declared_frames and declared_frames > 0:
            ratio = frame_count / declared_frames
            if ratio < 0.90:
                pct = ratio * 100
                return 'TRUNCATED', duration, f'Only {pct:.0f}% of declared frames found'

        return 'OK', duration, ''
    except Exception as e:
        return 'READ_ERROR', 0.0, str(e)


# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
#  CONTENT HASH (same as scanner)
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

def content_hash(path, chunk_size=262144):
    h    = hashlib.md5()
    size = os.path.getsize(path)
    h.update(str(size).encode())
    try:
        with open(path, 'rb') as f:
            h.update(f.read(chunk_size))
            if size > chunk_size * 2:
                f.seek(-chunk_size, 2)
                h.update(f.read(chunk_size))
    except Exception:
        return None
    return h.hexdigest()


# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
#  METADATA EXTRACTION
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
#  ARTIST LOOKUP TABLE
#  Maps folder names (lowercase) -> correct artist name.
#  Covers every folder variant in the albums collection,
#  including misspellings, album-name leakage, and typos.
#  Add new entries here as you add more music sources.
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

ARTIST_MAP = {
    # 10,000 Maniacs
    "10000 maniacs":                         "10,000 Maniacs",
    "100000 maniacs blind mans zoo":         "10,000 Maniacs",
    # Front 242
    "242":                                   "Front 242",
    # Unidentified vinyl albums (Gracenote failed)
    "album":                                 "Unknown Artist",
    # The Bangles
    "bangles everything":                    "The Bangles",
    # The Box
    "the  box":                              "The Box",
    "the box":                               "The Box",
    # Judas Priest (British Steel album â€” folder misspelled)
    "british steal":                         "Judas Priest",
    # Bruce Cockburn
    "bruce cockburn":                        "Bruce Cockburn",
    # Brownsville Station
    "brownsville station":                   "Brownsville Station",
    # Club Nouveau
    "club nouveau":                          "Club Nouveau",
    # Crash Vegas
    "crash vegas red earth":                 "Crash Vegas",
    # Crosby Stills Nash & Young (two spelling variants)
    "crosby still nash and young":           "Crosby Stills Nash & Young",
    "crosbby stills nash and young":         "Crosby Stills Nash & Young",
    # Crowded House (high/low side not stripped by regex)
    "crowded house high side":               "Crowded House",
    "crowded house low":                     "Crowded House",
    # The Cult
    "the cult":                              "The Cult",
    # Eric Burdon & The Animals (three folder variants)
    "eric burden and the animals greatest hits of eric burdon and the ani": "Eric Burdon & The Animals",
    "the greatest hits of eric burdon and the":                             "Eric Burdon & The Animals",
    "eric burdon  the animals greatest hits":                               "Eric Burdon & The Animals",
    # Flesh for Lulu
    "flesh for lulu":                        "Flesh for Lulu",
    "flesh for lulu long live the new flesh":"Flesh for Lulu",
    # Genesis
    "genesis duke":                          "Genesis",
    # George Thorogood
    "george thorogood and the destroyers":   "George Thorogood",
    # Good Morning Vietnam (soundtrack)
    "good morning vietnam":                  "Good Morning Vietnam Soundtrack",
    # Gord Downie (name misspelled in folder)
    "gord downy secret path":                "Gord Downie",
    # The Grapes of Wrath
    "the grapes of wrath":                   "The Grapes of Wrath",
    "the grapes of wrath side two":          "The Grapes of Wrath",
    # Grover Washington Jr.
    "grover washington jr":                  "Grover Washington Jr.",
    "grover washinton jr":                   "Grover Washington Jr.",
    # The Honey Drippers
    "honey drippers volume one":             "The Honey Drippers",
    "the honey drippers volume one":         "The Honey Drippers",
    # The House of Dolls
    "the house of dolls":                    "The House of Dolls",
    # Inner City
    "inner city big fun":                    "Inner City",
    # The J. Geils Band (three spelling variants)
    "the jgeils band":                       "The J. Geils Band",
    "the j geils band":                      "The J. Geils Band",
    "the j giles band":                      "The J. Geils Band",
    # Jethro Tull (two folder variants)
    "jethro tull ian anderson songs of the wood": "Jethro Tull",
    "jethro tull, songs from the wood":      "Jethro Tull",
    # The Kinks (multiple album folders + state variants)
    "the kinks":                             "The Kinks",
    "the kinks state of confusion":          "The Kinks",
    "the kinks state of concern":            "The Kinks",
    "kinks golden hour":                     "The Kinks",
    # King Crimson
    "king crimson discipline":               "King Crimson",
    # Led Zeppelin
    "led zeppelin":                          "Led Zeppelin",
    "led zeppelin coda":                     "Led Zeppelin",
    "led zeppelin cuda":                     "Led Zeppelin",
    # Mariah Carey
    "mariah carey":                          "Mariah Carey",
    # Marianne Faithfull (three spelling variants)
    "marriane faithful dangerous acquaintances":  "Marianne Faithfull",
    "marrianne faithful dangerous aquainences":   "Marianne Faithfull",
    "marrianne faithful dangerous aquaintances":  "Marianne Faithfull",
    # Mercury
    "murcury":                               "Mercury",
    # Midnight Oil
    "midnight oil":                          "Midnight Oil",
    # Missing Persons
    "missing persons":                       "Missing Persons",
    "missing persons rhyme  reason":         "Missing Persons",
    # The Monks
    "the monks":                             "The Monks",
    # Morrissey
    "morrissey":                             "Morrissey",
    # National Velvet
    "national velvet":                       "National Velvet",
    # Nazareth
    "nazareth malice in wonderland":         "Nazareth",
    # New Order (correct and misspelled folder)
    "neworder technique":                    "New Order",
    "newwonder technique":                   "New Order",
    # OMD
    "the best of omd":                       "OMD",
    # Pat Benatar (name misspelled in folder)
    "pat benetar in the heat of the night":  "Pat Benatar",
    # Queen
    "queen the red":                         "Queen",
    # Rick Derringer
    "rick derringer, the mccoys":            "Rick Derringer & The McCoys",
    # Robert Plant
    "robert plant":                          "Robert Plant",
    "robert plant the principle moments":    "Robert Plant",
    # Rough Trade
    "rough trade carol pope":                "Rough Trade",
    # Sass Jordan
    "sass jordan":                           "Sass Jordan",
    # Simple Minds (four variants including 'ci' typo prefix)
    "simple minds":                          "Simple Minds",
    "simple minds live":                     "Simple Minds",
    "simple minds side 1 live":              "Simple Minds",
    "cisimple minds":                        "Simple Minds",
    # Sisters of Mercy
    "sisters of mercy":                      "Sisters of Mercy",
    "the sisters of mercy":                  "Sisters of Mercy",
    # Supertramp
    "supertramp":                            "Supertramp",
    # Symphonic Slam
    "symphonic slam":                        "Symphonic Slam",
    # Teenage Head (two spelling variants)
    "teenage head frantic city":             "Teenage Head",
    "tenage head frantic city":              "Teenage Head",
    # Tina Turner
    "tina turner":                           "Tina Turner",
    # Tom Cochrane (name misspelled in folder)
    "tom cochrane victory day":              "Tom Cochrane",
    "tom chochrane  victory day":            "Tom Cochrane",
    # Triumvirat
    "triumverat":                            "Triumvirat",
    # Uriah Heep
    "uria heap":                             "Uriah Heep",
    # The Yardbirds
    "the yardbirds shape of things":         "The Yardbirds",
    "the yardbirds shapes of things":        "The Yardbirds",
}

# Fallback: suffixes to strip when folder not in ARTIST_MAP
_SIDE_PATTERNS = re.compile(
    r'\s+(side\s+(one|two|three|four|1|2|3|4)'
    r'|album\s*\d*'
    r'|\d+)$',
    re.IGNORECASE
)

# Articles to ignore when sorting
_ARTICLES = re.compile(r'^(the|a|an)\s+', re.IGNORECASE)

def _sort_key(name):
    """Sort key that ignores leading articles."""
    return _ARTICLES.sub('', name).lower().strip()

def _clean_folder_artist(folder_name):
    """
    Convert a folder name to a clean artist name.
    1. Try exact match in ARTIST_MAP
    2. Strip side/album suffix and try map again (catches 'X side one' -> 'X')
    3. Fall back to the stripped name
    """
    key = folder_name.strip().lower()
    if key in ARTIST_MAP:
        return ARTIST_MAP[key]
    # Strip side/album suffix and try map again
    stripped = _SIDE_PATTERNS.sub('', folder_name).strip()
    key2 = stripped.lower()
    if key2 in ARTIST_MAP:
        return ARTIST_MAP[key2]
    # Final fallback: return the stripped name as-is
    return stripped

def _parse_filename(stem):
    """
    Try to extract (artist, title) from filename stem.
    Handles patterns like:
      Artist - Title
      Artist - Title (version)
      01 Artist - Title
      Title (no separator)
    Returns (artist, title) â€” either may be None.
    """
    # Remove leading track numbers: "01 ", "01. ", "01 - "
    stem = re.sub(r'^\d{1,3}[\s.\-]+', '', stem).strip()

    # Try " - " separator
    if ' - ' in stem:
        parts  = stem.split(' - ', 1)
        artist = parts[0].strip()
        title  = parts[1].strip()
        # Remove trailing junk like (album version), [explicit], etc.
        title  = re.sub(r'\s*[\(\[].{0,30}[\)\]]$', '', title).strip()
        if artist and title:
            return artist, title

    # No separator â€” whole stem is the title, no artist
    return None, stem.strip()


def extract_metadata(filepath, folder_name):
    """
    Returns dict with keys: artist, title, album, source
    source is one of: 'tags', 'filename', 'folder', 'unknown'
    """
    path = str(filepath)
    artist = title = album = None
    source = 'unknown'

    # â”€â”€ Try mutagen tags â”€â”€
    if MUTAGEN_OK:
        try:
            audio = MutagenFile(path, easy=True)
            if audio is not None:
                tags = audio.tags or {}
                artist = (tags.get('artist') or tags.get('TPE1') or [None])[0]
                title  = (tags.get('title')  or tags.get('TIT2') or [None])[0]
                album  = (tags.get('album')  or tags.get('TALB') or [None])[0]
                # Clean up mutagen sometimes returns list items
                if isinstance(artist, list): artist = artist[0] if artist else None
                if isinstance(title,  list): title  = title[0]  if title  else None
                if isinstance(album,  list): album  = album[0]  if album  else None
                if artist or title:
                    source = 'tags'
        except Exception:
            pass

    # â”€â”€ Fall back: parse filename â”€â”€
    if not (artist and title):
        fn_artist, fn_title = _parse_filename(filepath.stem)
        if fn_artist and fn_title:
            if not artist: artist = fn_artist
            if not title:  title  = fn_title
            if source == 'unknown':
                source = 'filename'

    # â”€â”€ Fall back: use folder name as artist â”€â”€
    if not artist:
        artist = _clean_folder_artist(folder_name)
        if source == 'unknown':
            source = 'folder'

    # â”€â”€ Last resort: use raw filename as title â”€â”€
    if not title:
        title = filepath.stem

    # Sanitise for use as a filename
    def _safe(s):
        if not s:
            return ''
        return re.sub(r'[<>:"/\\|?*]', '', str(s)).strip()

    return {
        'artist': _safe(artist),
        'title':  _safe(title),
        'album':  _safe(album) if album else '',
        'source': source,
    }


# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
#  OUTPUT FILENAME BUILDER
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

def build_output_name(meta, ext, existing_names):
    """
    Build 'Artist - Title.ext', ensuring no filename collision.
    If artist is empty, goes to _needs_review.
    """
    artist = meta['artist'].strip()
    title  = meta['title'].strip()

    if not artist:
        return None  # Signal: send to _needs_review

    base = f"{artist} - {title}{ext}"

    # Deduplicate filename collisions
    if base.lower() not in existing_names:
        return base

    counter = 2
    while True:
        candidate = f"{artist} - {title} ({counter}){ext}"
        if candidate.lower() not in existing_names:
            return candidate
        counter += 1


# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
#  MAIN BUILD FUNCTION
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

def build_library(source_dirs, output_dir, min_duration=90,
                  exclude_dirs=None, dry_run=False, report_name='library_build_report'):

    if sys.platform == 'win32':
        os.system('color')

    exclude_set = set(d.lower() for d in (exclude_dirs or []))

    if not MUTAGEN_OK:
        print(f"\n{RED}ERROR: mutagen is not installed.{RESET}")
        print(f"Run:  pip install mutagen\n")
        sys.exit(1)

    output_path  = Path(output_dir)
    review_path  = output_path / '_needs_review'
    ts           = datetime.now().strftime('%Y%m%d_%H%M%S')
    csv_path     = Path(f"{report_name}_{ts}.csv")
    summary_path = Path(f"{report_name}_{ts}_summary.txt")

    print(f"\n{BOLD}{CYAN}â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•{RESET}")
    print(f"{BOLD}{CYAN}   MUSIC LIBRARY BUILDER  v1.0{RESET}")
    print(f"{BOLD}{CYAN}â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•{RESET}")
    for sd in source_dirs:
        print(f"  Source:      {sd}")
    print(f"  Output:      {output_dir}")
    print(f"  Min dur:     {min_duration}s")
    if exclude_set:
        print(f"  Excluding:   {', '.join(sorted(exclude_set))}")
    if dry_run:
        print(f"  {YELLOW}DRY RUN â€” nothing will be copied{RESET}")
    print(f"  Started:     {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

    # â”€â”€ Phase 1: Collect all files â”€â”€
    print("  Phase 1: Cataloguing files...", end='', flush=True)
    all_files = []
    for sd in source_dirs:
        root = Path(sd)
        for ext in ('*.mp3','*.MP3','*.wav','*.WAV','*.wave','*.WAVE'):
            for fp in root.rglob(ext):
                if exclude_set and any(p.lower() in exclude_set for p in fp.parts):
                    continue
                all_files.append(fp)
    total = len(all_files)
    print(f" {GREEN}{total} files found{RESET}\n")

    # â”€â”€ Phase 2: Integrity check + duration â”€â”€
    print("  Phase 2: Integrity check...")
    file_data   = {}  # path -> {status, duration, hash}
    start       = time.time()
    for i, fp in enumerate(all_files, 1):
        if i % 100 == 0 or i == total:
            elapsed = time.time() - start
            rate    = i / elapsed if elapsed > 0 else 0
            eta     = (total - i) / rate if rate > 0 else 0
            pct     = i / total * 100
            bar     = 'â–ˆ' * int(pct/5) + 'â–‘' * (20 - int(pct/5))
            print(f"\r    [{bar}] {pct:5.1f}%  {i}/{total}  ETA:{eta:.0f}s    ",
                  end='', flush=True)

        ext = fp.suffix.lower()
        if ext == '.mp3':
            status, dur, _ = analyze_mp3(str(fp))
        else:
            status, dur, _ = analyze_wav(str(fp))

        fhash = content_hash(str(fp.resolve())) if status in ('OK',) else None
        file_data[fp] = {'status': status, 'duration': dur, 'hash': fhash}

    print(f"\n  {GREEN}Done.{RESET}\n")

    # â”€â”€ Phase 3: Deduplicate â€” keep longest per content hash â”€â”€
    print("  Phase 3: Deduplication...")
    hash_groups = defaultdict(list)
    for fp, d in file_data.items():
        if d['hash']:
            hash_groups[d['hash']].append(fp)

    duplicate_paths = set()
    for fhash, group in hash_groups.items():
        if len(group) > 1:
            # Sort by duration descending â€” keep the longest
            group.sort(key=lambda p: file_data[p]['duration'], reverse=True)
            for dup in group[1:]:
                duplicate_paths.add(dup)

    # â”€â”€ Phase 4: Filter to qualifying files â”€â”€
    qualifying = []
    for fp, d in file_data.items():
        if d['status'] != 'OK':
            continue
        if d['duration'] < min_duration:
            continue
        if fp in duplicate_paths:
            continue
        qualifying.append(fp)

    qualifying.sort(key=lambda p: _sort_key(p.stem))
    print(f"  {GREEN}{len(qualifying)} files qualify{RESET} "
          f"(of {total} total â€” "
          f"{len(file_data) - len(qualifying)} skipped)\n")

    # â”€â”€ Phase 5: Extract metadata â”€â”€
    print("  Phase 4: Extracting metadata...")
    meta_list = []
    tag_sources = defaultdict(int)
    for fp in qualifying:
        folder_name = fp.parent.name
        meta        = extract_metadata(fp, folder_name)
        meta_list.append((fp, meta))
        tag_sources[meta['source']] += 1

    print(f"  Tag sources: "
          f"{GREEN}tags={tag_sources['tags']}{RESET}  "
          f"filename={tag_sources['filename']}  "
          f"folder={tag_sources['folder']}  "
          f"unknown={tag_sources['unknown']}\n")

    # â”€â”€ Phase 5: Copy files â”€â”€
    print("  Phase 5: Copying to output folder...")
    if not dry_run:
        output_path.mkdir(parents=True, exist_ok=True)
        review_path.mkdir(parents=True, exist_ok=True)

    existing_names  = set()
    copied          = 0
    review          = 0
    skipped         = 0
    csv_rows        = []
    start           = time.time()

    for i, (fp, meta) in enumerate(meta_list, 1):
        if i % 50 == 0 or i == len(meta_list):
            elapsed = time.time() - start
            rate    = i / elapsed if elapsed > 0 else 0
            eta     = (len(meta_list) - i) / rate if rate > 0 else 0
            pct     = i / len(meta_list) * 100
            bar     = 'â–ˆ' * int(pct/5) + 'â–‘' * (20-int(pct/5))
            print(f"\r    [{bar}] {pct:5.1f}%  {i}/{len(meta_list)}  ETA:{eta:.0f}s    ",
                  end='', flush=True)

        ext      = fp.suffix.lower()
        out_name = build_output_name(meta, ext, existing_names)

        if out_name is None:
            # No artist â€” send to review
            dest = review_path / fp.name
            dest_str = str(dest)
            action   = 'review'
            review  += 1
        else:
            dest     = output_path / out_name
            dest_str = str(dest)
            action   = 'copy'
            copied  += 1

        existing_names.add((out_name or fp.name).lower())

        try:
            if not dry_run:
                if action == 'copy':
                    shutil.copy2(str(fp), dest_str)
                else:
                    shutil.copy2(str(fp), dest_str)
        except Exception as e:
            action  = f'ERROR: {e}'
            skipped += 1
            copied  -= 1

        csv_rows.append({
            'source_path':   str(fp),
            'output_name':   out_name or fp.name,
            'destination':   dest_str,
            'artist':        meta['artist'],
            'title':         meta['title'],
            'album':         meta['album'],
            'tag_source':    meta['source'],
            'duration':      f"{file_data[fp]['duration']:.1f}",
            'action':        action,
        })

    print(f"\n")

    # â”€â”€ Write CSV report â”€â”€
    fieldnames = ['source_path','output_name','destination','artist','title',
                  'album','tag_source','duration','action']
    with open(csv_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(csv_rows)

    # â”€â”€ Terminal summary â”€â”€
    elapsed_total = time.time() - start
    skipped_total = total - len(qualifying)

    print(f"{BOLD}{CYAN}â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•{RESET}")
    print(f"{BOLD}  BUILD COMPLETE â€” {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}{RESET}")
    print(f"{BOLD}{CYAN}â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•{RESET}")
    print(f"  Source files scanned:  {total}")
    print(f"  {GREEN}Copied to library:     {copied}{RESET}")
    print(f"  {YELLOW}Sent to _needs_review: {review}{RESET}")
    print(f"  Skipped (bad/short/dup): {skipped_total}")
    if skipped:
        print(f"  {RED}Errors:                {skipped}{RESET}")
    if dry_run:
        print(f"\n  {YELLOW}DRY RUN â€” no files were actually copied{RESET}")
    print(f"\n  Tag sources:")
    print(f"    Full tags (mutagen):  {tag_sources['tags']}")
    print(f"    Parsed from filename: {tag_sources['filename']}")
    print(f"    Inferred from folder: {tag_sources['folder']}")
    print(f"    Unknown:              {tag_sources['unknown']}")
    print(f"\n  Reports saved to:")
    print(f"    {csv_path.resolve()}")
    print(f"    {summary_path.resolve()}\n")

    # â”€â”€ Text summary â”€â”€
    with open(summary_path, 'w', encoding='utf-8') as f:
        f.write("MUSIC LIBRARY BUILD SUMMARY  v1.0\n")
        f.write("==================================\n")
        f.write(f"Date:             {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"Sources:          {', '.join(source_dirs)}\n")
        f.write(f"Output:           {output_dir}\n")
        f.write(f"Min duration:     {min_duration}s\n\n")
        f.write(f"Total scanned:    {total}\n")
        f.write(f"Copied:           {copied}\n")
        f.write(f"Needs review:     {review}\n")
        f.write(f"Skipped:          {skipped_total}\n")
        f.write(f"Errors:           {skipped}\n\n")
        f.write(f"Tag sources:\n")
        f.write(f"  From tags:      {tag_sources['tags']}\n")
        f.write(f"  From filename:  {tag_sources['filename']}\n")
        f.write(f"  From folder:    {tag_sources['folder']}\n")
        f.write(f"  Unknown:        {tag_sources['unknown']}\n")


# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
#  ENTRY POINT
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='Music Library Builder v1.0 â€” extracts good songs into a clean organised folder'
    )
    parser.add_argument('sources', nargs='+',
        help='One or more source directories to scan')
    parser.add_argument('--output', required=True,
        help='Destination folder for the clean library')
    parser.add_argument('--min-duration', type=int, default=90,
        help='Minimum duration in seconds to qualify (default: 90)')
    parser.add_argument('--exclude', action='append', default=[], metavar='FOLDER',
        help='Folder name to skip (stackable). Example: --exclude "voice files"')
    parser.add_argument('--dry-run', action='store_true',
        help='Show what would be copied without actually copying anything')
    parser.add_argument('--report', default='library_build_report',
        help='Base name for report files (default: library_build_report)')

    args = parser.parse_args()

    build_library(
        source_dirs  = args.sources,
        output_dir   = args.output,
        min_duration = args.min_duration,
        exclude_dirs = args.exclude,
        dry_run      = args.dry_run,
        report_name  = args.report,
    )
