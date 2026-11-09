# Virus Slot Machine – Project Rules

Museum exhibit (DPZ anniversary exhibition 2027, theme: evolution / infection research). Concept reference: **[docs/gameplan.md](docs/gameplan.md)** (v0.3) – read it before larger changes; it wins over assumptions. The step-by-step build plan is **[docs/schritte.md](docs/schritte.md)** – one step per prompt, in order.

## Game concept (Influenza reassortment)

The concept changed in Nov 2026 from zoonosis (3 reels: animal · symptoms · transmission) to **influenza A reassortment**. The old zoonosis state is archived under the git tag `v0.1-zoonose`. Don't build new features on the old reel logic – it is being replaced.

- **Three source viruses** at the top: Virus 1 "bird" (green), Virus 2 "bird" (blue), Virus 3 "human" (pink).
- They infect the **pig as mixing host**. A **spin** shuffles the **8 gene segments**: each segment randomly takes its origin from one of the three viruses and keeps that virus's colour, so the result is visibly a new mix (e.g. 3 green, 2 blue, 3 pink).
- **Four result tiles** follow from the mix, two states each: receptor (bird ↔ human), body-temperature adaptation (42° ↔ 37°), human-to-human transmission (poor ↔ good), prior immunity (present ↔ none – concerns humans, not the virus, so it is visually set apart).
- **Jackpot** = human receptor + 37° + good transmission + no prior immunity → pandemic potential. Then a result screen with a short explanation (max. ~40–50 words per language).
- Plain language throughout ("bird/human", "warm/cold"), no jargon like α-2,3 / α-2,6.

**Deliberately not in this version:**
- **Segment names/functions are reference data, not game logic.** `content.json` lists the standard short names (PB2 … NS) with a plain-language function per segment, marked for researcher review. On screen only the numbers are shown until the researcher decides otherwise. Don't add further biological claims, and don't derive game rules from the segment functions.
- **No mutation mechanic.** Reassortment only.
- The mix → property coupling is a **placeholder** (docs/schritte.md, Appendix A) and lives **only in `content.json`** (`rules` block), never hardcoded in JS, so researchers can change it without touching code.

## Standing rules

- **Plain HTML/CSS/JS.** No build tools, bundlers, npm or frameworks. Must run from a static server (`python3 -m http.server 8000`) and GitHub Pages as-is. (Exception: standalone Node dev scripts in `tools/`, not part of the webapp.)
- **Offline only.** No CDNs, external fonts, external APIs or tracking. Every font, image, sound and library (e.g. GSAP) lives locally in the repo.
- **All visitor-facing text in `content.json`, always DE + EN.** No hardcoded strings in JS/HTML. Content must stay reviewable by researchers without touching code.
- **Portrait 1080×1920 stage**, scaled to fit the window (see `js/main.js`). Design in stage pixels.
- **One input action: "spin".** Click / Space = lever (the physical lever is a microcontroller sending Space). Game logic only listens to abstract actions from `js/input.js`, never to raw events. Extra actions (e.g. language toggle `L`) go through the same abstraction.
- **Never commit licensed files** – the repo is public: no TheSansB font files, no Adobe Stock assets, no DPZ media-database or unpublished DPZ material. Keep them local, exclude via `.gitignore`, and provide a fallback (e.g. system font) so the online version still works.

## Workflow

One task per prompt → test in browser → commit. Don't commit or push unless asked.
