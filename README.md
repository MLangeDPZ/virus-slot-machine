# Virus Slot Machine – Prototyp v0.1

Exponat-Prototyp für die DPZ-Jubiläumsausstellung 2027 (Themenblock Infektionsforschung).
Reines HTML/CSS/JavaScript – keine Build-Tools, keine Frameworks, keine externen Ressourcen. Läuft komplett offline.

Konzept und offene Punkte: [docs/gameplan.md](docs/gameplan.md)

## Lokal starten

Der Browser lädt `content.json` per `fetch`, das funktioniert nicht beim direkten Öffnen der Datei (`file://`).
Deshalb einen kleinen lokalen Webserver starten (Python ist auf dem Mac vorinstalliert):

```bash
cd virus-slot-machine
python3 -m http.server 8000
```

Dann im Browser öffnen: <http://localhost:8000>

Kiosk-Test (Vollbild, wie später im Exponat):

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --kiosk --autoplay-policy=no-user-gesture-required http://localhost:8000
```

## Bedienung

| Eingabe | Aktion |
|---|---|
| Mausklick oder Leertaste | Drehen (der spätere Hebel sendet ebenfalls Leertaste) |
| `L` | Sprache wechseln DE ↔ EN |
| `1` / `2` / `3` | Debug: Spillover / Beinahe-Treffer / Niete erzwingen |

## Projektstruktur

```
index.html        Bühne (1080×1920, wird ins Fenster skaliert)
content.json      ALLE Inhalte DE/EN: Walzensymbole, 10 Spillover, Texte, Einstellungen
css/style.css     Layout & Styles (Hausschrift TheSansB als fonts/TheSansB.woff2 ablegen)
js/outcome.js     Ergebnislogik: wird VOR der Animation gewürfelt (40/35/25 %)
js/reels.js       Walzen-Animation
js/input.js       Eingabe-Abstraktion (Aktion „spin“, egal ob Maus/Taste/Hebel)
js/audio.js       Synthetisierte Sounds (Web Audio API)
js/main.js        Spielablauf, Sprachwechsel, Ergebnisscreen
```

## Inhalte bearbeiten

Alle Texte und Kombinationen stehen in `content.json` und lassen sich ohne Code-Änderung prüfen und anpassen:

- `reels` – Symbole je Walze (`id`, Platzhalter-Emoji `icon`, `label` DE/EN)
- `spillovers` – die 10 Kombinationen; `host`/`symptom`/`transmission` verweisen auf Symbol-`id`s.
  `reviewNote` dokumentiert, wo Mehrfachangaben aus dem Gameplan auf ein Symbol reduziert wurden.
- `nearMiss.byReel` – Lernhinweise je abweichender Walze; Platzhalter `{virus}` und `{correct}`
- `miss.texts` – Nieten-Texte
- `settings.weights` – Gewichtung Spillover / Beinahe-Treffer / Niete

Beinahe-Treffer und Nieten werden automatisch aus den Spillover-Kombinationen berechnet:
Beinahe-Treffer = 2 von 3 Walzen passen zu einem Virus, Niete = höchstens 1 Walze passt zu irgendeinem Virus.
Fehlerhafte Verweise in `content.json` werden in der Browser-Konsole gemeldet.

## Noch nicht enthalten

Mutations-Mechanik, Virendex, Attract-Modus, Credits/Logos und aufwendige Visuals – folgen im nächsten Schritt.
