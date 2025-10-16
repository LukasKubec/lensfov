# Angle of View Calculator

A small browser-based tool for comparing the field of view of different focal lengths. Enter one or more lenses (for example `35`, `50mm`, `85`) and the app will calculate horizontal, vertical, and diagonal angles based on the selected sensor size. A simple bar chart highlights how wide each lens looks relative to the others.

## Features
- Parse single or multiple focal lengths with optional `mm` suffix.
- Choose from common sensor formats or provide custom width and height.
- Adjust subject distance and choose from people, car, Yoda, banana, or soccer/football field to see how many fit across the frame.
- See results instantly in a comparison table, bar chart, and layered visual overlay with people-width rows.
- Runs entirely in the browser; no backend or network access required.

## Getting started
```bash
npm install
npm run dev
```

Open the printed development URL in your browser to use the calculator locally. The page updates automatically as you edit the source.

## Production build
Generate an optimized static build that can be hosted on any static server (or opened from disk):
```bash
npm run build
```

The output is written to the `dist` directory.
