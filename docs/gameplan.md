Virus Slot Machine – Gameplan v0.1
Stand: 28.10.2026 · DPZ-Jubiläumsausstellung 2027 (Oberthema Evolution), Themenblock Infektionsforschung
1. Projektrahmen & Entscheidungen
Vorgehen: Prototyp bauen → fachliche Abstimmung mit den Forschenden → überarbeitete Version an die Agentur (die bereits das Zahlenmerkspiel-Exponat gebaut hat). Die Agentur soll nur noch Case + Hebelmechanik bauen → Prototyp muss optisch schon nah am Endprodukt sein (Kosten niedrig halten).
Zielgruppe: Göttinger Bürger:innen mit Wissenschaftsinteresse, Studierende, Schüler:innen/Schulklassen ab 15.
Freigabe: Slot-Machine-Idee kam von den Forschenden, vom Kommunikations-Team-Lead abgesegnet.
Format: Hochkant (Portrait), so nah wie möglich an einem echten Slot-Automaten.
Eingabe: Prototyp per Mausklick UND Tastatur (Leertaste) startbar. Ziel fürs Exponat: möglichst kein Touchscreen (günstiger) → Hebel als einzige (bzw. Haupt-)Eingabe.
Sprachen: Deutsch + Englisch, schon im Prototyp.
Hausschrift: TheSansB (wird bereits im Zahlenmerkspiel-Exponat verwendet; als lokale WOFF2-Datei einbinden).
IT: GitHub-Nutzung von der DPZ-IT freigegeben.
Entwicklungsrechner: Mac, VS Code (noch zu installieren) + Claude Code.
2. Technische Architektur
Reine Frontend-Webapp (HTML/CSS/JavaScript), kein Backend.
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
Prototyp: Slot-Sounds per Web Audio API synthetisieren (keine Lizenzfragen).
Später ggf. austauschen: Freesound.org (Filter CC0), Pixabay Sounds.
9. Credits, Logos, Lizenzen
Bildquellen klein in der Bildecke.
Sound-/Gesamtcredits als kleines „©“-Overlay (schließt automatisch, man verlässt nie das Spiel) bzw. ohne Touch in der Attract-Rotation.
DPZ-Logo + „Gefördert durch die Deutsche Forschungsgemeinschaft (DFG)“ gut sichtbar, Vorschlag: feste schmale Fußleiste auf allen Screens. DFG-Vorgaben zum Förderhinweis prüfen.
TheSansB: Lizenz für Exponat-/Web-Einbettung über Zahlenmerkspiel bereits gegeben – Font-Dateien (WOFF2) besorgen.
Adobe Stock Standardlizenz für Ausstellungsdisplay voraussichtlich ausreichend – kurz gegenprüfen.
10. Offene Punkte
Bildschirmgröße (Hochkant ist gesetzt).
Endgültige Bedienung: nur Hebel vs. Hebel + Knopf (siehe Abschnitt 4).
Fachliche Prüfung der 10 Kombinationen + Beinahe-Treffer-/Nieten-Texte durch Forschende.
Bildauswahl (Mediendatenbank / Adobe Stock), Icon-Stil.
11. Nächste Schritte (29.10.)
VS Code Setup auf dem Mac:
VS Code installieren (code.visualstudio.com)
Git: im Terminal xcode-select --install (installiert Git mit) oder über git-scm.com
GitHub-Account (ggf. DPZ-Organisation)
Claude-Code-Erweiterung in VS Code installieren, mit Claude-Konto anmelden
ggf. Admin-Rechte am Dienstrechner prüfen
Repository + Projektstruktur in Claude Code anlegen.
Erster Prototyp: Hochkant-Layout, 3 Walzen, Spin per Mausklick + Leertaste, Platzhalter-Icons, Content-JSON mit den 10 Kombinationen, DE/EN.