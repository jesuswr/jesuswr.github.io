# Fretboard Trainer

A small side project built to test [Claude Code](https://claude.ai/code), and actually useful for learning guitar note positions and intervals.

**Live at [jesuswr.github.io](https://jesuswr.github.io)**

## Modes

### Note Burst
Pick a string and a sequence length. The app gives you a random sequence of note names to find on the fretboard — tap the right fret as fast as you can. Tracks score and completion time so you can measure improvement.

### Ear Training
Listen to two notes played back to back and identify the interval between them (Perfect 4th or Perfect 5th). Good for building relative pitch alongside fretboard knowledge.

## Features

- All 6 strings in standard tuning (E A D G B e), frets 0–11
- Synthesized guitar pluck on each tap (Karplus-Strong algorithm, Web Audio API)
- Triangle oscillator tones for ear training intervals
- Score + completion time on results
- Volume slider
- Mobile friendly

## Stack

No build tools, no dependencies, no frameworks.

```
index.html        — markup
style.css         — styles
js/audio.js       — shared audio engine
js/note-burst.js  — note burst logic
js/ear-training.js — ear training logic
js/app.js         — event listeners and shared helpers
```
