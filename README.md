# Fretboard Trainer

A small side project built to test [Claude Code](https://claude.ai/code), and actually useful for learning guitar note positions.

Pick a string, set how many notes you want to drill, and the app gives you a random sequence of note names to find on the fretboard. It tracks your score and how long you took, so you can measure improvement over sessions.

**Live at [jesuswr.github.io](https://jesuswr.github.io)**

## Features

- All 6 strings in standard tuning, frets 0–11
- Synthesized guitar pluck on each tap (Karplus-Strong algorithm, Web Audio API)
- Score + completion time on the results screen
- Volume slider
- Mobile friendly

## Stack

Single `index.html` file — no build tools, no dependencies, no frameworks.
