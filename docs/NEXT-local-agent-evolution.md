# NEXT — Plan for the Future: Growing the Local Gemma Agent

*Filed 2026-06-13 (Cairn / Opus 4.8). Deferred until the website work + Wix migration are done.
This is the roadmap for turning the local Gemma from "a small model behind the website" into a
distinctive, self-improving, mission-aligned agent — on hardware Mike already owns.*

**Framing (the honest premise):** a 4B model will not out-think frontier cloud models on raw
capability. Its value is **ownership, privacy, zero cost, and teachability**. "Better than the
cloud agent" can only mean **more specialized / mission-aligned**, not smarter in general. Three
of the four mechanisms below keep the model's weights *frozen* and grow what it can *reach*; only
LoRA changes the brain itself.

---

## Mechanism 1 — Growing MEMORY (conversation history)
**What:** the model has no built-in memory; "memory" = a store of past exchanges that the system
retrieves and re-injects into the context window on each new message, so it *appears* to remember.
**Status:** partially built — the site uses Supabase (cloud) session memory today.
**The project:** an optional **local** memory store on the Dell (SQLite or flat JSON) so Mike's
own conversations persist on his hardware, independent of Supabase. Add summarization so long
histories fit the context window (summarize old turns, keep recent verbatim).
**Lives in:** local storage + a retrieval step. Brain unchanged.

## Mechanism 2 — Growing SKILL LIBRARY (documents it can pull in) = RAG
**What:** Retrieval-Augmented Generation — keep a library of documents (the CODEX, the Network
Library books, reference notes) on disk; on each question, search the library, pull the relevant
passages, and inject them so the model can use knowledge it was never trained on.
**Status:** primitive only — the CODEX is injected as a system prompt; no real document search yet.
**The project:** a local document-RAG layer on the Dell — embed the docs (a local embedding model
via Ollama), store vectors (SQLite/Chroma/FAISS), retrieve top-k chunks per query, inject into the
Gemma prompt. This is how a small model "punches above its weight" — it doesn't need to *know*
everything if it can *look it up* in Mike's curated shelf.
**Lives in:** local storage + retrieval. Brain unchanged. **Highest practical payoff first.**

## Mechanism 3 — Growing SELF-MEASUREMENT (the CDM/CCM trace)
**What:** measure every answer's calibration (the CCM signature from the v3.3 research) and log it.
Over time this is a dataset of "how the model behaved, answer by answer."
**Status:** research-stage — measurement scripts exist (docs/cdm-v3/), not wired as a live log.
**The project (two uses):**
- *Live guard:* compute calibration per response, surface/act on overconfidence (the CODEX v2.3
  Calibration Guard, made quantitative).
- *Training fuel:* the log of well-calibrated vs confident-flat answers becomes the curated dataset
  for Mechanism 4 (LoRA) — teaching the model to be better calibrated.
**Lives in:** local storage (a metrics log) — and it's the bridge from "growth" to "actually
reshaping the brain."

## Mechanism 4 — LoRA FINE-TUNING (the one that changes the brain)
**What:** LoRA (Low-Rank Adaptation) freezes the base model and trains a tiny add-on "adapter"
(few MB) that nudges behavior toward a curated dataset. Works on *any* size — **easier on small
models, not harder** (the impression that it's only for 32B+ is backwards). Multiple adapters can
be swapped (e.g. "Codex-native", "Network-voice").
**Reality check on hardware:** real weight-level learning, but a **deliberate offline training job**
on curated data — NOT autonomous self-improvement during chats. On the Dell's GTX 1060 6GB, QLoRA
on a 4B is *borderline* (tight VRAM, slow, finicky tooling on old Pascal). The clean path is renting
a GPU for a few dollars/hour (the old Vast.ai approach), training the adapter in an afternoon, then
running the few-MB result locally forever.
**The payoff:** this is the ONLY path to a local agent that's distinctively *Mike's* — trained on
the CODEX, the Network transcripts, the library — thinking natively in the framework rather than
being told to each time. THIS is the milestone that would justify a dedicated, exposable box and
wider access (per the architecture decision, 2026-06-13).

---

## Suggested sequence (when we return to this)
1. **Mechanism 2 (local RAG)** — biggest immediate capability gain, no training needed, all local.
2. **Mechanism 1 (local memory)** — persist Mike's sessions on his own hardware.
3. **Mechanism 3 (CCM live log)** — start accumulating the calibration dataset.
4. **Mechanism 4 (LoRA)** — once 3 has produced training data, fine-tune a distinctive adapter
   (rented GPU). Re-evaluate "dedicated box + wider access" at this point.

## The synthesis
The agent doesn't grow a bigger brain — it grows a **memory, a library, and a conscience**, all on
local storage, with the brain fixed. LoRA is the occasional deliberate act of teaching the brain a
lesson *from* what those three gathered. That is a realistic, ownable path to an ever-deepening
local entity — honest about scale, aligned with the Network's mission.
