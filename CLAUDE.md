# Virus Slot Machine – Project Rules

Museum exhibit (DPZ anniversary exhibition 2027). Concept reference: **[docs/gameplan.md](docs/gameplan.md)** – read it before larger changes; it wins over assumptions.

## Standing rules

- **Plain HTML/CSS/JS.** No build tools, bundlers, npm or frameworks. Must run from a static server (`python3 -m http.server 8000`) and GitHub Pages as-is.
- **Offline only.** No CDNs, external fonts, external APIs or tracking. Every font, image, sound and library (e.g. GSAP) lives locally in the repo.
- **All visitor-facing text in `content.json`, always DE + EN.** No hardcoded strings in JS/HTML. Content must stay reviewable by researchers without touching code.
- **Portrait 1080×1920 stage**, scaled to fit the window (see `js/main.js`). Design in stage pixels.
- **One input action: "spin".** Click / Space = lever (the physical lever is a microcontroller sending Space). Game logic only listens to abstract actions from `js/input.js`, never to raw events. Extra actions (e.g. a test "mutate" key) go through the same abstraction.
- **Never commit licensed files** – the repo is public: no TheSansB font files, no Adobe Stock assets, no DPZ media-database material. Keep them local, exclude via `.gitignore`, and provide a fallback (e.g. system font) so the online version still works.

## Workflow

One task per prompt → test in browser → commit. Don't commit or push unless asked.
