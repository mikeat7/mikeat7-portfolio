"""
=============================================================
  MUSIC LIBRARY INTEGRITY SCANNER  v2.1
  Supports: MP3, WAV
  Features: Corruption/truncation detection,
            duplicate detection + smart move (keep longest),
            short file sorting,
            live recording / spoken intro / applause detection,
            quarantine of bad files
=============================================================
  Usage:
    python music_scanner_v2.py "C:/Music/My Music"

  Optional flags:
    --quarantine "D:/Bad_Music"
        Move CORRUPT/TRUNCATED files here

    --short "D:/Short_Sounds" --short-threshold 90
        Move files under 90 seconds here (default: 90)

    --live "D:/Live_Review"
        Move files with spoken intros or applause endings here
        for manual review  (requires: pip install librosa)

    --move-duplicates "D:/Duplicates"
        Move duplicate copies here, keeping the LONGEST version
        in your main library (two-pass scan)

    --no-duplicates
        Skip duplicate detection entirely (fastest)

    --output "my_report"
        Custom base name for report files
=============================================================
"""

import os
import sys
import csv
import struct
import hashlib
import shutil
import argparse
import time
from pathlib import Path
from datetime import datetime
from collections import defaultdict

# â”€â”€ ANSI colors â”€â”€
GREEN  = "\033[92m"
YELLOW = "\033[93m"
RED    = "\033[91m"
CYAN   = "\033[96m"
MAGENTA= "\033[95m"
RESET  = "\033[0m"
BOLD   = "\033[1m"

# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
#  MP3 ANALYSIS  (unchanged from v1)
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

MPEG_BITRATES = {
    (3, 3): [32,40,48,56,64,80,96,112,128,160,192,224,256,320],
    (3, 2): [32,48,56,64,80,96,112,128,160,192,224,256,320,384],
    (3, 1): [32,64,96,128,160,192,224,256,288,320,352,384,416,448],
    (2, 3): [8,16,24,32,40,48,56,64,80,96,112,128,144,160],
    (2, 2): [8,16,24,32,40,48,56,64,80,96,112,128,144,160],
    (2, 1): [32,48,56,64,80,96,112,128,144,160,176,192,224,256],
}
MPEG_SAMPLERATES = {
    3: [44100, 48000, 32000],
    2: [22050, 24000, 16000],
    0: [11025, 12000, 8000],
}

def parse_mp3_frame_header(data, offset):
    if offset + 4 > len(data):
        return None
    b = data[offset:offset+4]
    if b[0] != 0xFF or (b[1] & 0xE0) != 0xE0:
        return None
    mpeg_version = (b[1] >> 3) & 0x3
    layer        = (b[1] >> 1) & 0x3
    bitrate_idx  = (b[2] >> 4) & 0xF
    samplerate_idx = (b[2] >> 2) & 0x3
    padding      = (b[2] >> 1) & 0x1
    if mpeg_version == 1 or layer == 0:
        return None
    if bitrate_idx == 0 or bitrate_idx == 15:
        return None
    if samplerate_idx == 3:
        return None
    sr_table = MPEG_SAMPLERATES.get(mpeg_version)
    if sr_table is None:
        return None
    samplerate = sr_table[samplerate_idx]
    br_table_key = (mpeg_version if mpeg_version in (3,2) else 2, layer)
    br_table = MPEG_BITRATES.get(br_table_key)
    if br_table is None:
        return None
    bitrate = br_table[bitrate_idx - 1] * 1000
    if layer == 3:
        frame_size = int((12 * bitrate / samplerate + padding) * 4)
    else:
        samples = 1152 if (mpeg_version == 3) else 576
        frame_size = int(samples / 8 * bitrate / samplerate) + padding
    if frame_size < 21:
        return None
    return frame_size, bitrate, samplerate

def skip_id3v2(data):
    if data[:3] == b'ID3':
        if len(data) < 10:
            return 0
        size_bytes = data[6:10]
        size = ((size_bytes[0] & 0x7F) << 21 | (size_bytes[1] & 0x7F) << 14 |
                (size_bytes[2] & 0x7F) << 7  | (size_bytes[3] & 0x7F))
        flags = data[5]
        footer = 10 if (flags & 0x10) else 0
        return 10 + size + footer
    return 0

def read_xing_vbri_header(data, frame_offset, frame_size):
    for xing_offset in [frame_offset + 36, frame_offset + 21, frame_offset + 13]:
        if xing_offset + 8 <= len(data):
            tag = data[xing_offset:xing_offset+4]
            if tag in (b'Xing', b'Info'):
                flags = struct.unpack('>I', data[xing_offset+4:xing_offset+8])[0]
                if flags & 0x1:
                    if xing_offset + 12 <= len(data):
                        num_frames = struct.unpack('>I', data[xing_offset+8:xing_offset+12])[0]
                        return num_frames, 'Xing/Info'
    vbri_offset = frame_offset + 36
    if vbri_offset + 14 <= len(data):
        if data[vbri_offset:vbri_offset+4] == b'VBRI':
            num_frames = struct.unpack('>I', data[vbri_offset+14:vbri_offset+18])[0] if vbri_offset+18 <= len(data) else None
            if num_frames:
                return num_frames, 'VBRI'
    return None, None

def analyze_mp3(path):
    result = {
        'format': 'MP3', 'status': 'OK', 'duration_sec': 0,
        'frame_count': 0, 'declared_frames': None, 'bitrate_kbps': 0,
        'samplerate': 0, 'notes': [], 'recoverable': True
    }
    try:
        with open(path, 'rb') as f:
            data = f.read()
    except Exception as e:
        result['status'] = 'READ_ERROR'
        result['notes'].append(f'Cannot read file: {e}')
        result['recoverable'] = False
        return result

    if len(data) < 128:
        result['status'] = 'CORRUPT'
        result['notes'].append('File too small to be a valid MP3')
        result['recoverable'] = False
        return result

    offset = skip_id3v2(data)
    first_frame_offset = None
    search_limit = min(offset + 8192, len(data) - 4)
    for i in range(offset, search_limit):
        r = parse_mp3_frame_header(data, i)
        if r:
            first_frame_offset = i
            break

    if first_frame_offset is None:
        result['status'] = 'CORRUPT'
        result['notes'].append('No valid MP3 frame found in first 8KB')
        result['recoverable'] = False
        return result

    r0 = parse_mp3_frame_header(data, first_frame_offset)
    declared_frames, vbr_type = read_xing_vbri_header(data, first_frame_offset, r0[0])
    result['declared_frames'] = declared_frames

    pos = first_frame_offset
    frame_count = 0
    bitrates = []
    samplerate = 0
    consecutive_invalid = 0

    while pos < len(data) - 3:
        r = parse_mp3_frame_header(data, pos)
        if r:
            frame_size, bitrate, sr = r
            frame_count += 1
            bitrates.append(bitrate)
            samplerate = sr
            consecutive_invalid = 0
            pos += frame_size
        else:
            if pos >= len(data) - 128:
                break
            consecutive_invalid += 1
            pos += 1
            if consecutive_invalid > 2048:
                result['notes'].append(f'Frame sync lost at byte {pos} â€” large corrupt region')
                result['status'] = 'CORRUPT'
                break

    result['frame_count'] = frame_count
    result['samplerate'] = samplerate

    if bitrates:
        avg_bitrate = sum(bitrates) / len(bitrates)
        result['bitrate_kbps'] = round(avg_bitrate / 1000, 1)
        if samplerate > 0:
            result['duration_sec'] = round(frame_count * 1152 / samplerate, 2)

    if declared_frames and frame_count < declared_frames * 0.95:
        pct = round(frame_count / declared_frames * 100, 1)
        result['status'] = 'TRUNCATED'
        result['notes'].append(
            f'{vbr_type} header declared {declared_frames} frames; only {frame_count} found ({pct}% complete)'
        )
        result['recoverable'] = True

    if frame_count == 0:
        result['status'] = 'CORRUPT'
        result['notes'].append('Zero valid frames found')
        result['recoverable'] = False

    return result


# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
#  WAV ANALYSIS  (unchanged from v1)
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

def analyze_wav(path):
    result = {
        'format': 'WAV', 'status': 'OK', 'duration_sec': 0,
        'frame_count': 0, 'declared_frames': None, 'bitrate_kbps': 0,
        'samplerate': 0, 'notes': [], 'recoverable': True
    }
    try:
        with open(path, 'rb') as f:
            header = f.read(44)
            file_size = os.path.getsize(path)
    except Exception as e:
        result['status'] = 'READ_ERROR'
        result['notes'].append(f'Cannot read file: {e}')
        result['recoverable'] = False
        return result

    if len(header) < 44:
        result['status'] = 'CORRUPT'
        result['notes'].append('Header too short â€” file is severely truncated')
        result['recoverable'] = False
        return result

    if header[:4] != b'RIFF':
        result['status'] = 'CORRUPT'
        result['notes'].append('Missing RIFF marker â€” not a valid WAV file')
        result['recoverable'] = False
        return result

    if header[8:12] != b'WAVE':
        result['status'] = 'CORRUPT'
        result['notes'].append('Missing WAVE identifier')
        result['recoverable'] = False
        return result

    riff_declared_size = struct.unpack('<I', header[4:8])[0]
    riff_actual_size = file_size - 8
    if riff_declared_size > riff_actual_size + 1:
        pct = round(riff_actual_size / riff_declared_size * 100, 1)
        result['status'] = 'TRUNCATED'
        result['notes'].append(
            f'RIFF header declares {riff_declared_size} bytes; file has {riff_actual_size} bytes ({pct}% complete)'
        )

    if header[12:16] != b'fmt ':
        result['status'] = 'CORRUPT'
        result['notes'].append('fmt chunk not found at expected offset')
        result['recoverable'] = False
        return result

    fmt_size = struct.unpack('<I', header[16:20])[0]
    audio_format    = struct.unpack('<H', header[20:22])[0]
    num_channels    = struct.unpack('<H', header[22:24])[0]
    sample_rate     = struct.unpack('<I', header[24:28])[0]
    byte_rate       = struct.unpack('<I', header[28:32])[0]
    bits_per_sample = struct.unpack('<H', header[34:36])[0]

    result['samplerate'] = sample_rate
    result['bitrate_kbps'] = round(byte_rate * 8 / 1000, 1)

    if audio_format not in (1, 3, 6, 7, 65534):
        result['notes'].append(f'Unusual audio format code: {audio_format}')

    if sample_rate == 0 or num_channels == 0 or bits_per_sample == 0:
        result['status'] = 'CORRUPT'
        result['notes'].append('Invalid audio parameters (zero sample rate, channels, or bit depth)')
        result['recoverable'] = False
        return result

    data_chunk_size = None
    try:
        with open(path, 'rb') as f:
            f.seek(12 + 8 + fmt_size)
            for _ in range(20):
                chunk_id = f.read(4)
                if len(chunk_id) < 4:
                    break
                chunk_size_bytes = f.read(4)
                if len(chunk_size_bytes) < 4:
                    break
                chunk_size = struct.unpack('<I', chunk_size_bytes)[0]
                if chunk_id == b'data':
                    data_chunk_size = chunk_size
                    break
                f.seek(chunk_size, 1)
    except Exception:
        pass

    if data_chunk_size is None:
        result['status'] = 'CORRUPT'
        result['notes'].append('data chunk not found â€” no audio data in file')
        result['recoverable'] = False
        return result

    bytes_per_sample_frame = (bits_per_sample // 8) * num_channels
    if bytes_per_sample_frame > 0:
        declared_sample_frames = data_chunk_size // bytes_per_sample_frame
        result['declared_frames'] = declared_sample_frames
        result['frame_count'] = declared_sample_frames
        if sample_rate > 0:
            result['duration_sec'] = round(declared_sample_frames / sample_rate, 2)

    if result['status'] == 'TRUNCATED':
        result['recoverable'] = True

    return result


# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
#  DUPLICATE DETECTION
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

def content_hash(path, chunk_size=262144):
    """
    Hash first 256KB + last 256KB + file size.
    Reliable enough for duplicate detection without reading entire file.
    """
    h = hashlib.md5()
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
#  LIVE / SPEECH / APPLAUSE DETECTION
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

LIBROSA_AVAILABLE = False
try:
    import librosa
    import numpy as np
    LIBROSA_AVAILABLE = True
except ImportError:
    pass


def _score_segment(y, sr):
    """
    Returns (applause_score, speech_score) for an audio segment.
    Both scores are 0.0â€“1.0. Higher = more likely.

    Applause:  broadband noise, high ZCR, high spectral centroid, high flatness
    Speech:    moderate ZCR, low-to-mid centroid, low flatness, irregular energy
    """
    if len(y) < sr // 2:          # less than 0.5 seconds â€” skip
        return 0.0, 0.0

    flatness  = float(librosa.feature.spectral_flatness(y=y)[0].mean())
    zcr       = float(librosa.feature.zero_crossing_rate(y)[0].mean())
    centroid  = float(librosa.feature.spectral_centroid(y=y, sr=sr)[0].mean())
    rms       = float(librosa.feature.rms(y=y)[0].mean())

    # Skip silent segments
    if rms < 0.001:
        return 0.0, 0.0

    # Applause: high flatness + high ZCR + high centroid
    applause_score = (
        min(flatness * 1.8, 1.0) * 0.55 +
        min(zcr / 0.4, 1.0)      * 0.30 +
        min(centroid / 8000, 1.0) * 0.15
    )

    # Speech: moderate ZCR, centroid 500â€“3000 Hz, low flatness
    centroid_speech = max(0.0, 1.0 - abs(centroid - 1500) / 2000)
    speech_score = (
        min(zcr / 0.15, 1.0)      * 0.40 +
        centroid_speech            * 0.40 +
        max(0.0, 1.0 - flatness * 8) * 0.20
    )

    return round(applause_score, 3), round(speech_score, 3)


def detect_live_content(path, duration_sec):
    """
    Analyze the first 30s (for speech intro) and last 20s (for applause outro).
    Returns (is_live, reason_string) where is_live is True/False.

    Thresholds (tuned on simulated signals, conservative to reduce false positives):
      applause_score > 0.28  in last 20s  => applause ending
      speech_score   > 0.52  in first 30s => spoken intro
    """
    if not LIBROSA_AVAILABLE:
        return False, ''

    if duration_sec < 10:
        return False, ''          # too short to meaningfully analyse

    reasons = []

    try:
        # Load at reduced sample rate for speed (22050 Hz is sufficient)
        target_sr = 22050

        # â”€â”€ Check first 30s for speech intro â”€â”€
        intro_dur = min(30.0, duration_sec * 0.4)
        y_intro, _ = librosa.load(path, sr=target_sr, duration=intro_dur, mono=True)
        _, speech_score = _score_segment(y_intro, target_sr)
        if speech_score > 0.52:
            reasons.append(f'spoken intro detected (score={speech_score:.2f})')

        # â”€â”€ Check last 20s for applause â”€â”€
        outro_dur = min(20.0, duration_sec * 0.3)
        offset = max(0.0, duration_sec - outro_dur)
        y_outro, _ = librosa.load(path, sr=target_sr, offset=offset,
                                   duration=outro_dur, mono=True)
        applause_score, _ = _score_segment(y_outro, target_sr)
        if applause_score > 0.28:
            reasons.append(f'applause/crowd ending detected (score={applause_score:.2f})')

        # â”€â”€ Also check first 30s for applause (intro crowd noise) â”€â”€
        applause_intro, _ = _score_segment(y_intro, target_sr)
        if applause_intro > 0.28 and 'applause/crowd ending detected' not in ' '.join(reasons):
            reasons.append(f'crowd noise in intro (score={applause_intro:.2f})')

    except Exception as e:
        return False, f'live-detect error: {e}'

    if reasons:
        return True, ' | '.join(reasons)
    return False, ''


# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
#  SAFE FILE MOVE  (handles name collisions)
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

def safe_move(src, dest_dir, index):
    """Move src to dest_dir, handling filename collisions."""
    src = Path(src)
    dest = Path(dest_dir) / src.name
    if dest.exists():
        dest = Path(dest_dir) / f"{src.stem}_{index}{src.suffix}"
    try:
        shutil.move(str(src), str(dest))
        return str(dest), None
    except Exception as e:
        return None, str(e)


# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
#  MAIN SCANNER
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

def scan_library(root_dir, quarantine_dir=None, short_dir=None, short_threshold=90,
                 live_dir=None, duplicate_dir=None, skip_duplicates=False,
                 exclude_dirs=None, output_name='music_scan_report'):

    if sys.platform == 'win32':
        os.system('color')

    # Normalise excluded folder names to lowercase for case-insensitive matching
    exclude_set = set(d.lower() for d in (exclude_dirs or []))

    root_path = Path(root_dir)
    if not root_path.exists():
        print(f"{RED}ERROR: Directory not found: {root_dir}{RESET}")
        sys.exit(1)

    for d in [quarantine_dir, short_dir, live_dir, duplicate_dir]:
        if d:
            Path(d).mkdir(parents=True, exist_ok=True)

    # Warn if live detection requested but librosa missing
    if live_dir and not LIBROSA_AVAILABLE:
        print(f"\n{YELLOW}  WARNING: --live flag used but librosa is not installed.")
        print(f"  Run:  pip install librosa   then try again.")
        print(f"  Live detection will be skipped this run.{RESET}\n")

    print(f"\n{BOLD}{CYAN}â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•{RESET}")
    print(f"{BOLD}{CYAN}   MUSIC LIBRARY INTEGRITY SCANNER  v2.0{RESET}")
    print(f"{BOLD}{CYAN}â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•{RESET}")
    print(f"  Scanning:  {root_dir}")
    if quarantine_dir: print(f"  Quarantine: {quarantine_dir}")
    if short_dir:      print(f"  Short (<{short_threshold}s): {short_dir}")
    if live_dir:       print(f"  Live review: {live_dir}  {'(librosa ready)' if LIBROSA_AVAILABLE else '(librosa MISSING)'}")
    if duplicate_dir:  print(f"  Duplicates -> : {duplicate_dir}  (keeping longest version)")
    if exclude_set:    print(f"  Excluding:   {', '.join(sorted(exclude_set))}")
    print(f"  Started:   {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

    print("  Cataloguing files...", end='', flush=True)
    all_files = []
    for ext in ('*.mp3', '*.MP3', '*.wav', '*.WAV', '*.wave', '*.WAVE'):
        for fp in root_path.rglob(ext):
            # Skip if any part of the path matches an excluded folder name
            if exclude_set and any(part.lower() in exclude_set for part in fp.parts):
                continue
            all_files.append(fp)
    total = len(all_files)
    skipped_msg = f"  ({len([f for f in root_path.rglob('*.mp3')] ) - total} excluded)" if exclude_set else ""
    print(f" {GREEN}{total} files found{RESET}{skipped_msg}\n")

    if total == 0:
        print(f"{YELLOW}  No MP3 or WAV files found in {root_dir}{RESET}")
        sys.exit(0)

    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    csv_path     = Path(output_name + f'_{timestamp}.csv')
    summary_path = Path(output_name + f'_{timestamp}_summary.txt')

    fieldnames = [
        'filepath', 'filename', 'format', 'status', 'recoverable',
        'duration_sec', 'duration_readable', 'bitrate_kbps', 'samplerate',
        'frame_count', 'declared_frames', 'file_size_mb',
        'is_short', 'is_live', 'live_reason',
        'duplicate_of', 'action_taken', 'notes'
    ]

    stats = defaultdict(int)
    hash_map = {}
    duplicate_pairs = []
    start_time = time.time()

    with open(csv_path, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()

        for i, filepath in enumerate(all_files, 1):
            # Progress bar
            if i % 50 == 0 or i == total:
                elapsed = time.time() - start_time
                rate = i / elapsed if elapsed > 0 else 0
                eta = (total - i) / rate if rate > 0 else 0
                pct = i / total * 100
                bar = 'â–ˆ' * int(pct / 5) + 'â–‘' * (20 - int(pct / 5))
                print(f"\r  [{bar}] {pct:5.1f}%  {i}/{total}  {rate:.0f}/s  ETA:{eta:.0f}s    ",
                      end='', flush=True)

            ext = filepath.suffix.lower()
            file_size_mb = round(os.path.getsize(filepath) / (1024*1024), 2)

            # â”€â”€ Integrity analysis â”€â”€
            if ext == '.mp3':
                analysis = analyze_mp3(str(filepath))
            elif ext in ('.wav', '.wave'):
                analysis = analyze_wav(str(filepath))
            else:
                continue

            status = analysis['status']
            dur    = analysis['duration_sec']
            stats['total'] += 1
            stats[status]  += 1
            if status != 'OK':
                stats['issues'] += 1
            if not analysis['recoverable'] and status != 'OK':
                stats['unrecoverable'] += 1

            # â”€â”€ Short file check â”€â”€
            is_short = (dur > 0 and dur < short_threshold)
            if is_short:
                stats['short'] += 1

            # â”€â”€ Live / speech / applause detection â”€â”€
            is_live    = False
            live_reason = ''
            if live_dir and LIBROSA_AVAILABLE and status == 'OK' and dur >= 10:
                is_live, live_reason = detect_live_content(str(filepath), dur)
                if is_live:
                    stats['live'] += 1

            # â”€â”€ Duplicate detection (pass 1: collect) â”€â”€
            # Use resolved absolute path to prevent self-matching via symlinks
            # or rglob yielding the same file twice
            duplicate_of = ''
            if not skip_duplicates:
                resolved_path = str(filepath.resolve())
                fhash = content_hash(resolved_path)
                if fhash:
                    if fhash not in hash_map:
                        hash_map[fhash] = []
                    # Only add if this exact resolved path not already present
                    existing_paths = [e['path'] for e in hash_map[fhash]]
                    if resolved_path not in existing_paths:
                        hash_map[fhash].append({
                            'path': resolved_path,
                            'duration': dur,
                            'status': status,
                        })

            # â”€â”€ File actions (move) â”€â”€
            # Priority: corrupt/truncated â†’ quarantine
            #           short (and OK)    â†’ short folder
            #           live (and OK)     â†’ live review folder
            action_taken = ''
            moved = False

            if not moved and quarantine_dir and status in ('CORRUPT', 'TRUNCATED', 'READ_ERROR'):
                dest, err = safe_move(str(filepath), quarantine_dir, i)
                if dest:
                    action_taken = f'Moved to quarantine: {dest}'
                    moved = True
                else:
                    analysis['notes'].append(f'Quarantine move failed: {err}')

            if not moved and short_dir and is_short and status == 'OK':
                dest, err = safe_move(str(filepath), short_dir, i)
                if dest:
                    action_taken = f'Moved to short folder: {dest}'
                    moved = True
                else:
                    analysis['notes'].append(f'Short-move failed: {err}')

            if not moved and live_dir and is_live and status == 'OK':
                dest, err = safe_move(str(filepath), live_dir, i)
                if dest:
                    action_taken = f'Moved to live review: {dest}'
                    moved = True
                else:
                    analysis['notes'].append(f'Live-move failed: {err}')

            # â”€â”€ Duration formatting â”€â”€
            mins = int(dur // 60)
            secs = int(dur % 60)
            duration_readable = f"{mins}:{secs:02d}" if dur > 0 else "unknown"

            row = {
                'filepath':         str(filepath),
                'filename':         filepath.name,
                'format':           analysis['format'],
                'status':           status,
                'recoverable':      'Yes' if analysis['recoverable'] else 'No',
                'duration_sec':     dur,
                'duration_readable': duration_readable,
                'bitrate_kbps':     analysis['bitrate_kbps'],
                'samplerate':       analysis['samplerate'],
                'frame_count':      analysis['frame_count'],
                'declared_frames':  analysis['declared_frames'] or '',
                'file_size_mb':     file_size_mb,
                'is_short':         'Yes' if is_short else '',
                'is_live':          'Yes' if is_live else '',
                'live_reason':      live_reason,
                'duplicate_of':     duplicate_of,
                'action_taken':     action_taken,
                'notes':            ' | '.join(analysis['notes'])
            }
            writer.writerow(row)

    # â”€â”€ PASS 2: Duplicate resolution â”€â”€
    # For each group of identical files, keep the longest, move the rest.
    if not skip_duplicates:
        dup_csv_rows = []
        for fhash, group in hash_map.items():
            if len(group) < 2:
                continue
            # Sort: longest duration first; on tie, prefer OK status
            group.sort(key=lambda x: (x['duration'], x['status'] == 'OK'), reverse=True)
            keeper = group[0]
            losers = group[1:]
            for loser in losers:
                stats['duplicates'] += 1
                duplicate_pairs.append((loser['path'], keeper['path']))
                action = f"Duplicate of {keeper['path']} (kept longest: {keeper['duration']:.1f}s vs {loser['duration']:.1f}s)"
                if duplicate_dir:
                    dest, err = safe_move(loser['path'], duplicate_dir, stats['duplicates'])
                    if dest:
                        action += f" | Moved to: {dest}"
                    else:
                        action += f" | Move failed: {err}"
                dup_csv_rows.append({'path': loser['path'], 'kept': keeper['path'], 'action': action})

        # Append duplicate rows to CSV
        if dup_csv_rows:
            with open(csv_path, 'a', newline='', encoding='utf-8') as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                for row in dup_csv_rows:
                    writer.writerow({
                        'filepath': row['path'],
                        'filename': Path(row['path']).name,
                        'format': '', 'status': 'DUPLICATE',
                        'recoverable': 'N/A',
                        'duration_sec': '', 'duration_readable': '',
                        'bitrate_kbps': '', 'samplerate': '',
                        'frame_count': '', 'declared_frames': '',
                        'file_size_mb': round(os.path.getsize(row['path']) / (1024*1024), 2) if Path(row['path']).exists() else '',
                        'is_short': '', 'is_live': '', 'live_reason': '',
                        'duplicate_of': row['kept'],
                        'action_taken': row['action'],
                        'notes': ''
                    })

    elapsed_total = time.time() - start_time

    # â”€â”€ TERMINAL SUMMARY â”€â”€
    print(f"\n\n{BOLD}{CYAN}â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•{RESET}")
    print(f"{BOLD}  SCAN COMPLETE â€” {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}{RESET}")
    print(f"{BOLD}{CYAN}â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•{RESET}")
    print(f"  Time elapsed:    {elapsed_total:.1f}s ({elapsed_total/60:.1f} min)")
    print(f"  Files scanned:   {stats['total']}")
    print(f"  {GREEN}OK:              {stats['OK']}{RESET}")
    if stats['TRUNCATED']:
        print(f"  {YELLOW}Truncated:       {stats['TRUNCATED']}  (songs end too early){RESET}")
    if stats['CORRUPT']:
        print(f"  {RED}Corrupt:         {stats['CORRUPT']}{RESET}")
    if stats['READ_ERROR']:
        print(f"  {RED}Read errors:     {stats['READ_ERROR']}{RESET}")
    if stats['short']:
        print(f"  {CYAN}Short (<{short_threshold}s):    {stats['short']}  (ringtones/sounds){RESET}")
    if stats['live']:
        print(f"  {MAGENTA}Live/speech:     {stats['live']}  (flagged for review){RESET}")
    if stats['duplicates']:
        moved_str = f"  ({stats['duplicates']} moved to review)" if duplicate_dir else ""
        print(f"  {YELLOW}Duplicates:      {stats['duplicates']}{moved_str}{RESET}")
    if stats['unrecoverable']:
        print(f"  {RED}Unrecoverable:   {stats['unrecoverable']}{RESET}")

    print(f"\n  {BOLD}Reports saved to:{RESET}")
    print(f"    {csv_path.resolve()}")

    # â”€â”€ TEXT SUMMARY â”€â”€
    with open(summary_path, 'w', encoding='utf-8') as sf:
        sf.write("MUSIC LIBRARY SCAN SUMMARY  v2.0\n")
        sf.write("=================================\n")
        sf.write(f"Scanned:         {root_dir}\n")
        sf.write(f"Date:            {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        sf.write(f"Duration:        {elapsed_total:.1f}s\n\n")
        sf.write(f"Total files:     {stats['total']}\n")
        sf.write(f"OK:              {stats['OK']}\n")
        sf.write(f"Truncated:       {stats['TRUNCATED']}\n")
        sf.write(f"Corrupt:         {stats['CORRUPT']}\n")
        sf.write(f"Read errors:     {stats['READ_ERROR']}\n")
        sf.write(f"Short (<{short_threshold}s):   {stats['short']}\n")
        sf.write(f"Live/speech:     {stats['live']}\n")
        sf.write(f"Duplicates:      {stats['duplicates']}\n")
        if duplicate_dir:
            sf.write(f"Duplicates moved to: {duplicate_dir}\n")
        sf.write(f"Unrecoverable:   {stats['unrecoverable']}\n")
        if duplicate_pairs:
            sf.write("\nDUPLICATE PAIRS:\n")
            for a, b in duplicate_pairs:
                sf.write(f"  {a}\n    == {b}\n")

    print(f"    {summary_path.resolve()}\n")


# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
#  ENTRY POINT
# â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='Music Library Integrity Scanner v2.0 â€” MP3 and WAV'
    )
    parser.add_argument('directory',
        help='Root directory of your music library (scans all subfolders)')
    parser.add_argument('--quarantine', default=None,
        help='Move CORRUPT/TRUNCATED files here')
    parser.add_argument('--short', default=None, metavar='FOLDER',
        help='Move files shorter than --short-threshold seconds here')
    parser.add_argument('--short-threshold', type=int, default=90,
        help='Duration in seconds below which a file is "short" (default: 90)')
    parser.add_argument('--live', default=None, metavar='FOLDER',
        help='Move files with spoken intros or applause endings here for review '
             '(requires: pip install librosa)')
    parser.add_argument('--move-duplicates', default=None, metavar='FOLDER',
        help='Move duplicate copies here, keeping the longest version in your library')
    parser.add_argument('--no-duplicates', action='store_true',
        help='Skip duplicate detection entirely (fastest)')
    parser.add_argument('--exclude', action='append', default=[], metavar='FOLDER',
        help='Folder name to exclude from scanning (can be used multiple times). '
             'Matches any folder with that name anywhere in the tree. '
             'Example: --exclude "voice files" --exclude "ist1"')
    parser.add_argument('--output', default='music_scan_report',
        help='Base name for output report files (no extension)')

    args = parser.parse_args()

    scan_library(
        root_dir        = args.directory,
        quarantine_dir  = args.quarantine,
        short_dir       = args.short,
        short_threshold = args.short_threshold,
        live_dir        = args.live,
        duplicate_dir   = args.move_duplicates,
        skip_duplicates = args.no_duplicates,
        exclude_dirs    = args.exclude,
        output_name     = args.output,
    )
