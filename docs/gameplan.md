Virus Slot Machine – Gameplan v0.2
Stand: 03.11.2026 · DPZ-Jubiläumsausstellung 2027 (Oberthema Evolution), Themenblock Infektionsforschung
0. Aktueller Status (03.11.2026)
Setup erledigt: VS Code + Git + Claude-Code-Erweiterung auf dem Mac, GitHub-Account angelegt.
Projektordner: ~/Projects/virus-slot-machine (Git-Repo), Gameplan liegt unter docs/gameplan.md.
Erster Prototyp läuft: Hochkant-Layout, 3 Walzen (Tier · Symptome · Übertragung), Spin per Mausklick + Leertaste, gewichtete Ergebnislogik (40/35/25), einfacher Ergebnisscreen, Inhalte DE/EN in content.json, Sprachwechsel per Taste L, Emoji-Platzhalter, Web-Audio-Sounds.
Online: GitHub-Repo (öffentlich) + GitHub Pages aktiv (https://<username>.github.io/virus-slot-machine/).
Lokale Vorschau: im Projektordner python3 -m http.server 8000 → http://localhost:8000 (Doppelklick auf index.html funktioniert nicht, da JSON geladen wird).
Noch nicht gebaut: Mutation, Virendex, Attract-Modus, Auto-Reset, Slot-Automaten-Look, echte Icons/Bilder, Credits/Fußleiste.
0.1 Arbeitsweise
Claude Code = Werkstatt: alle Änderungen am Code/an content.json. Eine Aufgabe pro Prompt → im Browser testen → committen → pushen (Sync Changes).
Claude-Chat (Projekt) = Planungsbüro: Konzept, Entscheidungen, Inhalte/Texte, Abstimmung mit Forschenden, Prompts für Claude Code.
Brücke: docs/gameplan.md. Bei Änderungen hier Gameplan aktualisieren → in docs/gameplan.md einfügen → Claude Code Bescheid geben.
CLAUDE.md im Projekt-Root mit festen Regeln (offline, keine CDNs, DE/EN in content.json, Hochkant 1080×1920, keine lizenzierten Dateien im Repo).
Repo ist öffentlich → niemals einchecken: TheSansB-Fontdateien, Adobe-Stock-Bilder, unveröffentlichtes Material aus der DPZ-Mediendatenbank. Lösung (offen): Dateien lokal halten und per .gitignore ausschließen, mit Fallback-Schrift für die Online-Version.
1. Projektrahmen & Entscheidungen
Vorgehen: Prototyp bauen → fachliche Abstimmung mit den Forschenden → überarbeitete Version an die Agentur (die bereits das Zahlenmerkspiel-Exponat gebaut hat). Die Agentur soll nur noch Case + Hebelmechanik bauen → Prototyp muss optisch schon nah am Endprodukt sein (Kosten niedrig halten).
Zielgruppe: Göttinger Bürger:innen mit Wissenschaftsinteresse, Studierende, Schüler:innen/Schulklassen ab 15.
Freigabe: Slot-Machine-Idee kam von den Forschenden, vom Kommunikations-Team-Lead abgesegnet.
Format: Hochkant (Portrait), so nah wie möglich an einem echten Slot-Automaten.
Eingabe: Prototyp per Mausklick UND Tastatur (Leertaste) startbar. Ziel fürs Exponat: möglichst kein Touchscreen (günstiger) → Hebel als einzige (bzw. Haupt-)Eingabe.
Sprachen: Deutsch + Englisch, schon im Prototyp.
Hausschrift: TheSansB (wird bereits im Zahlenmerkspiel-Exponat verwendet; als lokale WOFF2-Datei einbinden, nicht im öffentlichen Repo).
IT: GitHub-Nutzung von der DPZ-IT freigegeben.
Entwicklungsrechner: Mac, VS Code + Claude Code.
2. Technische Architektur
Reine Frontend-Webapp (HTML/CSS/JavaScript), kein Backend, keine Build-Tools.
Offline-first: keine CDNs, keine externen Fonts/APIs; alle Schriften, Bilder, Sounds lokal im Projekt. Optional PWA/Service Worker.
Inhalte in separater JSON-Datei (Tiere, Symptome, Übertragungswege, Viren, Texte DE/EN, Quellenangaben) → fachlich prüfbar ohne Code-Eingriff.
Hosting Prototyp: GitHub Pages (Link an Forschende).
Exponat: lokal auf Mini-PC/Raspberry Pi im Browser-Kiosk-Modus (Chromium --kiosk), Autostart, kein Internet nötig.
Eingabe-Abstraktion: Spiel reagiert auf ein Ereignis „Hebel/Spin“. Hebel = Mikroschalter an Mikrocontroller (z. B. Arduino Pro Micro), der sich als Tastatur ausgibt und z. B. Leertaste sendet. Code bleibt identisch, egal ob Maus, Tastatur oder Hebel.
Ausstellungsbetrieb: Attract-Modus, Auto-Reset nach ca. 60 s Inaktivität, kein Kontextmenü/Zoom, kein Tracking.
Animation: CSS/JS, ggf. GSAP (kostenlos, lokal eingebunden).
3. Spielablauf
Attract-Modus: Maschine blinkt, Viruspartikel schweben, „Zieh am Hebel!“ / „Pull the lever!“.
Spin: 3 Walzen drehen, stoppen nacheinander (je eigener Sound → Spannung).
Walze 1: Wer wird befallen? (Tier, Zoonose-Fokus)
Walze 2: Welche Symptome?
Walze 3: Welche Übertragungswege?
Ergebnis:
„Spillover!“ (Jackpot): Kombination = echtes Virus → Lichtshow, Fanfare, Ergebnisscreen.
Beinahe-Treffer (2 von 3): kurzer Lernhinweis („Fast! Hantaviren kommen von Nagetieren, werden aber über Staub übertragen.“).
Niete: witziger kurzer Hinweis, warum das biologisch nicht passt.
„Mutieren lassen“ (bestätigt als zentrale Evolutions-Mechanik): Eine Walze dreht erneut – das Virus mutiert. Botschaft: Eine einzige Veränderung (z. B. neuer Übertragungsweg) entscheidet, ob ein Tiervirus zum Problem für den Menschen wird.
Mehrfachspiel: „Virendex“ sammelt gefundene Spillover-Viren („3 von 10 entdeckt“), Reset nach Inaktivität. Funktioniert mit einem Durchgang und mit mehreren.
Gewichtete Logik: Ergebnis wird vor der Animation festgelegt (Richtwert: 40 % Spillover, 35 % Beinahe-Treffer, 25 % Niete), Walzen landen passend. (Echte Spielautomaten funktionieren genauso – möglicher Fun Fact.)
4. Bedienung nur mit Hebel (offener Punkt, Vorschlag)
Ohne Touchscreen braucht es eine Lösung für Mutation, Sprache und Credits:
Zustandsabhängiger Hebel: Hebel im Attract-Modus = Spin. Hebel auf dem Ergebnisscreen = Mutation (zufällige Walze, max. 1–2 Mutationen pro Runde, Anzeige „Hebel ziehen zum Mutieren“). Danach bzw. nach einigen Sekunden ohne Eingabe: nächster Hebelzug = neue Runde.
Alternative: ein zusätzlicher günstiger Arcade-Knopf (wenige Euro, läuft über denselben Mikrocontroller) für „Mutieren“ oder Sprachwahl.
Sprache ohne Touch: zweisprachige Darstellung oder Attract-Modus wechselt DE/EN; bzw. zweiter Knopf.
Credits ohne Touch: Credits erscheinen in der Rotation des Attract-Modus. → Mit Forschenden/Team abstimmen; Prototyp so bauen, dass beide Varianten testbar sind.
5. Ergebnisscreen (kurzweilig, keine Textwüste)
Max. ca. 40–50 Wörter pro Sprache:
Virusname + Bild (Mediendatenbank DPZ)
3 Icon-Kacheln: Wirt · Symptome · Übertragung
1 Satz Evolution (z. B. „HIV entstand aus einem Affenvirus (SIV), das sich an den Menschen angepasst hat.“)
optional 1 Satz „Forschung am DPZ“
Hinweis/Button: Mutieren lassen · Neu drehen
Kernbotschaften: (a) Viren evolvieren/mutieren (DPZ-Forschung u. a. zu neuen SARS-CoV-2-Varianten), (b) Koevolution: Wir evolvieren nicht allein, Viren mutieren schneller als unser Immunsystem nachkommt, (c) One Health, (d) Zoonosen.
6. Inhaltsvorschlag: 10 Spillover-Kombinationen
Entwurf – muss fachlich von den Forschenden geprüft werden.
#	Tier	Symptome	Übertragung	Virus
1	Schimpanse	Immunschwäche	Blut/Körperflüssigkeiten	HIV (aus SIV)
2	Makake	Neurologisch	Biss/Kratzer	Herpes-B-Virus
3	Fledermaus	Atemwege	Tröpfchen/Aerosole	SARS-CoV-2 (Ursprung vermutlich Fledermaus-Coronaviren)
4	Dromedar	Atemwege	enger Kontakt/Tröpfchen	MERS-CoV
5	Vogel	Atemwege/Fieber	Kontakt/Tröpfchen	Vogelgrippe H5N1
6	Vogel	Fieber, selten Hirnhautentzündung	Mückenstich	West-Nil-Virus
7	Nagetier (Rötelmaus)	Fieber/Niere	Staub mit Ausscheidungen	Hantavirus (Puumala)
8	Nagetier	Fieber/Hirnhautentzündung	Zeckenstich	FSME-Virus
9	Hund	Neurologisch	Biss	Tollwut
10	Flughund	Hämorrhagisches Fieber	Körperflüssigkeiten	Marburg- oder Ebolavirus
Walzeninhalte daraus:
Tiere (8): Schimpanse, Makake, Fledermaus, Flughund, Dromedar, Vogel, Nagetier, Hund
Symptome (6): Atemwege, Fieber, Neurologisch, Hämorrhagisch, Immunschwäche, Niere
Übertragung (6): Tröpfchen/Aerosole, Biss/Kratzer, Körperflüssigkeiten, Mücke, Zecke, Staub
7. Look & Feel
Ziel: ansprechend, „blinkend“, echter Slot-Automat, Virusbezug sofort erkennbar – keine flachen Walzen auf einfarbigem Screen.
Per Code: Walzenrotation mit Bewegungsunschärfe und Nachfedern, Lauflichter, Glow, Konfetti/Partikel, Screen-Shake, schwebende Viruspartikel (SVG), Gewinnlinien.
Bilder nötig: Walzensymbole als einheitlich illustrierte Icons (z. B. Vektor-Set Adobe Stock); Fotos (Viren aus DPZ-Mediendatenbank, ggf. Adobe Stock) eher auf dem Ergebnisscreen. Automatenrahmen auf dem Screen nur bei Variante ohne physisches Case.
Virus-Theming: Walzenrahmen als Virushülle mit Spikes (Bezug zum begehbaren Coronavirus-Modell), Lichter als Viruspartikel, „Labor-Neon“-Farbschema.
8. Sound
Prototyp: Slot-Sounds per Web Audio API synthetisieren (keine Lizenzfragen). ✔ im ersten Prototyp umgesetzt.
Später ggf. austauschen: Freesound.org (Filter CC0), Pixabay Sounds.
9. Credits, Logos, Lizenzen
Bildquellen klein in der Bildecke.
Sound-/Gesamtcredits als kleines „©“-Overlay (schließt automatisch, man verlässt nie das Spiel) bzw. ohne Touch in der Attract-Rotation.
DPZ-Logo + „Gefördert durch die Deutsche Forschungsgemeinschaft (DFG)“ gut sichtbar, Vorschlag: feste schmale Fußleiste auf allen Screens. DFG-Vorgaben zum Förderhinweis prüfen.
TheSansB: Lizenz für Exponat-/Web-Einbettung über Zahlenmerkspiel bereits gegeben – Font-Dateien (WOFF2) besorgen. Nicht ins öffentliche Repo (siehe 0.1).
Adobe Stock Standardlizenz für Ausstellungsdisplay voraussichtlich ausreichend – kurz gegenprüfen. Ebenfalls nicht ins öffentliche Repo.
10. Offene Punkte
Bildschirmgröße (Hochkant ist gesetzt).
Endgültige Bedienung: nur Hebel vs. Hebel + Knopf (siehe Abschnitt 4).
Fachliche Prüfung der 10 Kombinationen + Beinahe-Treffer-/Nieten-Texte durch Forschende.
Bildauswahl (Mediendatenbank / Adobe Stock), Icon-Stil.
Umgang mit lizenzierten Dateien (Font, Bilder) bei öffentlichem Repo: lokal + .gitignore + Fallback online?
11. Nächste Schritte
CLAUDE.md anlegen lassen (Prompt siehe unten).
Mutations-Mechanik (Abschnitt 3.4 + 4): zustandsabhängiger Hebel, max. 1–2 Mutationen pro Runde, Ergebnis wird neu bewertet. Prototyp so bauen, dass auch Variante „zweiter Knopf“ (z. B. Taste M) testbar ist.
Attract-Modus + Auto-Reset (60 s Inaktivität), Hinweis „Zieh am Hebel!“ DE/EN.
Feinschliff: Virendex, Slot-Automaten-Look, Credits/Fußleiste.
Danach: Link an Forschende zur fachlichen Prüfung.
Prompt für CLAUDE.md:
Read docs/gameplan.md and create a CLAUDE.md in the project root with the standing rules for this project: plain HTML/CSS/JS without build tools, offline only (no CDNs, external fonts or APIs), all texts DE/EN in content.json, portrait 1080x1920 scaled to fit, input abstraction via one "spin" action (click/space = lever), never commit licensed files (TheSansB fonts, Adobe Stock, DPZ media), docs/gameplan.md is the concept reference. Keep it short.