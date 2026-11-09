Virus Slot Machine – Gameplan v0.3
Stand: 09.11.2026 · DPZ-Jubiläumsausstellung 2027 (Oberthema Evolution), Themenblock Infektionsforschung
Großer Konzeptwechsel (Nov 2026): Nach dem Meeting mit dem zuständigen Forschenden wechselt das Exponat vom Zoonose-Fokus (Tier · Symptome · Übertragung) zum Influenza-/Reassortment-Fokus. Kernmechanik ist jetzt das Neu-Mischen der 8 Gensegmente von Influenza-A-Viren. Passt deutlich besser zur konkreten Forschung am DPZ. Der technische Unterbau bleibt gleich (siehe Abschnitt 2), die Spielmechanik und Inhalte werden neu gebaut.
0. Aktueller Status (09.11.2026)
Technischer Unterbau steht (aus dem Zoonose-Prototyp übernommen): VS Code + Git + Claude Code auf dem Mac, GitHub-Repo (öffentlich) + GitHub Pages aktiv, Hochkant-Layout, Spin per Mausklick/Leertaste, Inhalte DE/EN in content.json, Sprachwechsel per Taste L, Web-Audio-Sounds, einfacher Ergebnisscreen.
Wird neu gebaut: die gesamte Spielmechanik (Reassortment statt 3 Walzen) und die Inhalte.
Vorgehen Repo: im selben Repo weiterarbeiten, aber die Spiellogik sauber ersetzen. Alten Zoonose-Stand vorher sichern (Git-Tag v0.1-zoonose oder Branch), damit nichts verloren geht.
Lokale Vorschau: im Projektordner python3 -m http.server 8000 → http://localhost:8000.
0.1 Arbeitsweise (unverändert)
Claude Code = Werkstatt: alle Änderungen am Code / an content.json. Eine Aufgabe pro Prompt → im Browser testen → committen → pushen.
Claude-Chat (Projekt) = Planungsbüro: Konzept, Entscheidungen, Inhalte/Texte, Abstimmung mit Forschenden, Prompts für Claude Code.
Brücke: docs/gameplan.md. Änderungen hier im Chat → in docs/gameplan.md einfügen → Claude Code Bescheid geben.
CLAUDE.md im Projekt-Root mit festen Regeln (offline, keine CDNs, DE/EN in content.json, Hochkant 1080×1920, keine lizenzierten Dateien im öffentlichen Repo).
Repo ist öffentlich → niemals einchecken: TheSansB-Fontdateien, Adobe-Stock-Bilder, unveröffentlichtes DPZ-Material. Lokal halten + .gitignore + Fallback-Schrift online.
1. Die wissenschaftliche Grundidee (fachlicher Hintergrund)
Quelle: Vorlesungsfolien des Forschenden (v. a. Folie 1 „Hintergrund" und Folie 6 „Reassortment"), zusammengefasst in den Meetingnotizen.
Influenza-A-Viren haben 8 getrennte Gensegmente – anders als Viren mit einem einzigen, zusammenhängenden Genom. Jedes Segment codiert für andere Virusbestandteile (u. a. Oberflächenproteine).
Bei der Vermehrung in der Wirtszelle wird nur „geprüft", dass alle 8 Segmente vorhanden sind – nicht, aus welchem Virus sie stammen.
Sind mehrere Viren gleichzeitig im selben Wirt, kommt es zum „Mix-and-Match" (Reassortment): das neue Virus kann Segmente aus verschiedenen Ausgangsviren kombinieren (z. B. Segment 1,3,4,5,6 von Virus A und 2,7,8 von Virus B). So entstehen neue Virusvarianten.
Das Schwein als Mischwirt: Es trägt Rezeptoren für vogel- und menschenspezifische Viren und kann deshalb von beiden befallen werden → idealer Ort für die Neu-Mischung. (In der Vorlesungsfolie ist der Mischwirt ein Huhn/H7N9; für das Exponat wird das Schwein genutzt, weil es beide Rezeptortypen anschaulich erklärbar macht.)
Natürliches Reservoir: Wasser-/Geflügel (oft ohne Symptome). Geflügel hat eine höhere Körpertemperatur als der Mensch.
Was ein Virus für den Menschen gefährlich macht (die vier Eigenschaften im Spiel, s. u.): Anpassung an menschliche Rezeptoren, Anpassung an menschliche Körpertemperatur, Mensch-zu-Mensch-Übertragbarkeit, fehlende Vorimmunität in der Bevölkerung.
Vereinfachungen (Schwein als Mischwirt, vier unabhängige Ergebnis-Eigenschaften, Begriffe „Vogel/Mensch" statt Fachnamen) sind didaktisch gewollt. In den kommenden Gesprächen mit dem Forschenden wird geprüft, dass nichts fachlich schief hängt. Jetzt zählt zuerst: die Grundidee als Prototyp.
2. Technische Architektur (unverändert)
Reine Frontend-Webapp (HTML/CSS/JavaScript), kein Backend, keine Build-Tools.
Offline-first: keine CDNs, keine externen Fonts/APIs; alle Schriften, Bilder, Sounds lokal. Optional PWA/Service Worker.
Inhalte in content.json (Viren, Eigenschaften, Texte DE/EN, Quellen) → fachlich prüfbar ohne Code-Eingriff.
Hosting Prototyp: GitHub Pages (Link an Forschende).
Exponat: lokal auf Mini-PC/Raspberry Pi im Browser-Kiosk-Modus (Chromium --kiosk), Autostart, kein Internet nötig.
Eingabe-Abstraktion: Spiel reagiert auf ein Ereignis „Hebel/Spin". Hebel = Mikroschalter an Mikrocontroller (z. B. Arduino Pro Micro), der sich als Tastatur ausgibt (Leertaste). Code identisch, egal ob Maus, Tastatur oder Hebel.
Ausstellungsbetrieb: Attract-Modus, Auto-Reset nach ca. 60 s Inaktivität, kein Kontextmenü/Zoom, kein Tracking.
Animation: CSS/JS, ggf. GSAP (kostenlos, lokal eingebunden).
3. Neuer Spielablauf (Influenza / Reassortment)
Verzahnung der beiden im Meeting diskutierten Varianten: A (Segmente mischen) + B (Ergebnis-Eigenschaften), gekoppelt.
Attract-Modus: Maschine blinkt, drei Ausgangsviren schweben oben, „Zieh am Hebel!" / „Pull the lever!".
Drei Ausgangsviren oben (farblich klar getrennt, analog zur Reassortment-Grafik):
Virus 1 – Vogel (grün)
Virus 2 – Vogel (blau)
Virus 3 – Mensch (pink)
Befall des Schweins (Mischwirt): Die drei Viren fahren ins Schwein ein.
Spin = Reassortment-Animation im Schwein: Die 8 Gensegmente werden sichtbar neu durchgemischt. Jedes Segment behält die Farbe seines Herkunftsvirus → am Ende sieht man buchstäblich eine neue Mischung (z. B. „3 grün, 2 blau, 3 pink"). Das ist das Herzstück und der eigentliche „Dreh" der Slot-Machine.
Vier Ergebniskacheln unten rutschen/leuchten passend zur entstandenen Mischung auf (je zwei Zustände):
Rezeptor: Vogel ↔ Mensch
Körpertemperatur-Anpassung: warm/Geflügel (42°) ↔ kalt/Mensch (37°)
Mensch-zu-Mensch-Übertragbarkeit: schlecht ↔ gut
Vorimmunität 🧑 (betrifft den Menschen, nicht das Virus): optisch etwas abgesetzt (Farbe + Mensch-Icon), damit sie nicht mit den Viruseigenschaften verschwimmt.
Ergebnisscreen: erklärt knapp, was für ein Virus entstanden ist, plus Hintergrundwissen. Der „Jackpot" = an Mensch-Rezeptor angepasst, an 37° angepasst, gut übertragbar, keine Vorimmunität → ein Virus mit Pandemiepotenzial.
Begriffe: durchgehend einfache Sprache – „Vogel/Mensch", „warm/kalt" – statt Fachbegriffen wie „Alpha-2,3 / Alpha-2,6".
4. Entscheidungen für später (mit Forschendem)
Diese Punkte nicht jetzt festlegen – erst Prototyp der Grundidee, dann Abstimmung:
Jackpot-Häufigkeit: selten (realistisch, „seltener Zufall löst Pandemie aus") vs. häufiger (Exponat muss auch bei nur 1–2 Zügen wirken). → Forschender entscheidet.
Tonfall beim Jackpot: Slot-Machine „feiert" den Treffer, der „Gewinn" ist aber ein gefährliches Virus. Kontrast bewusst gestalten (Fanfare + ernüchternder Erklärtext), damit es nicht wie das Spielziel „gefährliches Virus bauen" wirkt. → Forschender entscheidet.
Wiederspielwert: z. B. Freischalten realer, durch Reassortment entstandener Grippe-Pandemien (1957, 1968, 2009) statt des alten „Virendex". → später.
Kopplung A↔B: wie genau welche Segment-Mischung welche Ergebnis-Eigenschaft bestimmt → fachlich mit Forschendem abstimmen.
Mutations-Mechanik aus dem alten Konzept: geht evtl. im Reassortment auf oder bleibt als zweiter Schritt → später.
5. Ergebnisscreen (kurzweilig, keine Textwüste)
Max. ca. 40–50 Wörter pro Sprache.
Darstellung des entstandenen Virus (gemischte Segmente in den Herkunftsfarben).
Die vier Eigenschaften als Icon-Kacheln.
1 Satz Einordnung (was bedeutet diese Mischung?).
optional 1 Satz „Forschung am DPZ".
Hinweis/Button: Neu drehen.
Kernbotschaften: (a) Influenzaviren mischen ihre Gensegmente neu (Reassortment), (b) der Mischwirt (Schwein) ist dafür zentral, (c) nur eine seltene Kombination wird für den Menschen gefährlich, (d) Evolution/Koevolution, One Health.
6. Bedienung nur mit Hebel (offener Punkt)
Zustandsabhängiger Hebel: Attract = Spin; Ergebnisscreen = nach Sekunden/nächstem Zug neue Runde.
Ggf. zusätzlicher günstiger Arcade-Knopf (über denselben Mikrocontroller) für Sprache o. Ä.
Sprache ohne Touch: zweisprachige Darstellung oder Attract wechselt DE/EN.
→ Prototyp so bauen, dass Varianten testbar sind.
7. Look & Feel
Echter Slot-Automat: „blinkend", Virusbezug sofort erkennbar.
Per Code: Reassortment-Animation mit Bewegung/Nachfedern, Lauflichter, Glow, Partikel, Screen-Shake, schwebende Viruspartikel (SVG).
Virus-Theming: Bezug zum begehbaren Coronavirus-Modell der Ausstellung, „Labor-Neon"-Farbschema.
Bilder nötig: Viren/Segmente als einheitlich illustrierte Icons; Fotos eher auf dem Ergebnisscreen (DPZ-Mediendatenbank / ggf. Adobe Stock).
8. Sound
Prototyp: Slot-Sounds per Web Audio API synthetisieren (keine Lizenzfragen). ✔
Später ggf. Freesound.org (CC0) / Pixabay.
9. Credits, Logos, Lizenzen
Bildquellen klein in der Ecke.
DPZ-Logo + „Gefördert durch die DFG" gut sichtbar (Vorschlag: schmale Fußleiste). DFG-Vorgaben zum Förderhinweis prüfen.
TheSansB: Lizenz über Zahlenmerkspiel vorhanden, WOFF2 lokal, nicht ins öffentliche Repo.
Adobe-Stock-Standardlizenz für Ausstellungsdisplay voraussichtlich ausreichend – gegenprüfen. Ebenfalls nicht ins öffentliche Repo.
10. Zielgruppe & Rahmen
Zielgruppe: Göttinger Bürger:innen mit Wissenschaftsinteresse, Studierende, Schüler:innen/Schulklassen ab 15.
Freigabe: Slot-Machine-Idee von Forschenden, vom Kommunikations-Team-Lead abgesegnet. Influenza-Pivot aus dem Meeting mit dem Forschenden.
Format: Hochkant, so nah wie möglich an echtem Slot-Automaten. Ziel fürs Exponat: möglichst kein Touchscreen (Hebel als Haupteingabe).
Agentur (die das Zahlenmerkspiel baute) soll nur Case + Hebelmechanik bauen → Prototyp muss optisch schon nah am Endprodukt sein.
11. Nächste Schritte
Alten Stand sichern (Git-Tag v0.1-zoonose / Branch).
Diesen Gameplan in docs/gameplan.md einsetzen, Claude Code Bescheid geben.
Spiellogik ersetzen – step by step:
Drei Ausgangsviren + Schwein-Layout (statisch) aufbauen.
Reassortment-Animation: 8 farbige Segmente mischen.
Vier Ergebniskacheln mit Logik an die Mischung koppeln (Vorimmunität abgesetzt).
Ergebnisscreen auf neue Inhalte umstellen.
content.json auf Influenza-Inhalte (DE/EN) umbauen.
Attract-Modus + Auto-Reset auf neues Konzept anpassen.
Danach: Link an Forschende zur fachlichen Prüfung → offene Entscheidungen aus Abschnitt 4 klären.