Step-by-Step: Prototyp Virus Slot Machine (Influenza / Reassortment)
Stand: 09.11.2026 · gehört zu gameplan-virus-slot-machine.md v0.3
Prinzip: Ein Schritt = ein Prompt an Claude Code = ein sichtbares Ergebnis im Browser = ein Commit. Nie zwei Schritte in einem Prompt. Nach jedem Schritt im Browser (python3 -m http.server 8000) prüfen, erst dann weiter.
Reihenfolge-Logik: Erst Gerüst (sichtbar, tot), dann Logik (unsichtbar, richtig), dann Animation (sichtbar, lebendig), dann Inhalt, dann Ausstellungsbetrieb, dann Politur. Das verhindert, dass du schöne Animationen für eine Mechanik baust, die sich noch ändert.
Fachlicher Detailgrad in dieser Version: Der Prototyp zeigt das Prinzip des Reassortments – 8 Segmente werden neu gemischt, daraus entsteht ein Virus mit bestimmten Eigenschaften. Er behauptet nicht, welches Segment was codiert, und enthält keine Mutationsmechanik. Beides ist mit dem Forschenden noch zu besprechen (siehe Anhang B). Die Kopplung zwischen Mischung und Eigenschaften ist ein bewusster Platzhalter und liegt in content.json, damit sie nach dem Gespräch ohne Code-Eingriff ersetzt werden kann.
Phase 0 – Aufräumen vor dem Umbau
Schritt 0.1 – Alten Zoonose-Stand sichern
Nicht von Claude Code machen lassen, selbst im Terminal:
git add -A && git commit -m "Zoonose-Prototyp, Stand vor Influenza-Pivot"
git tag v0.1-zoonose
git push && git push --tags
Test: Tag erscheint auf GitHub unter „Tags". Erst dann weiter.
Schritt 0.2 – Gameplan und Regeln aktualisieren
Gameplan v0.3 in docs/gameplan.md einsetzen, dieses Dokument daneben als docs/schritte.md. Dann:
Prompt: Lies docs/gameplan.md und docs/schritte.md. Das Konzept hat gewechselt: von Zoonose (3 Walzen) zu Influenza-Reassortment (8 Gensegmente). Aktualisiere CLAUDE.md so, dass die festen Regeln weiter gelten (offline, keine CDNs, DE/EN ausschließlich in content.json, Hochkant 1080×1920, keine lizenzierten Dateien im Repo) und ergänze eine kurze Beschreibung des neuen Spielprinzips. Nimm dabei ausdrücklich auf, dass die Segmente in dieser Version keine benannten biologischen Funktionen haben und es keine Mutationsmechanik gibt. Ändere sonst nichts am Code.
Phase 1 – Statisches Gerüst
Schritt 1.1 – Bildschirmaufbau ohne jede Logik
Prompt: Ersetze die bisherige Spieloberfläche durch ein neues statisches Layout im Hochformat 1080×1920, noch ganz ohne Spiellogik und ohne Animation. Von oben nach unten: (1) Kopfzeile mit Titel, (2) Reihe mit drei Ausgangsviren – Virus 1 „Vogel" grün, Virus 2 „Vogel" blau, Virus 3 „Mensch" pink, jedes als Kreis mit 8 farbigen Segmenten in seiner Virusfarbe, (3) in der Mitte groß der Mischwirt Schwein als Platzhalterfläche, darin ein Raster aus 8 nummerierten Segment-Slots, (4) darunter vier Ergebniskacheln nebeneinander: Rezeptor, Körpertemperatur, Mensch-zu-Mensch-Übertragbarkeit, Vorimmunität – die vierte optisch abgesetzt (andere Rahmenfarbe plus Mensch-Icon), (5) schmale Fußleiste für Logos. Alles mit CSS-Variablen für die drei Virusfarben. Keine Interaktion.
Test: Seite sieht aus wie das spätere Spiel im Standbild. Proportionen im Hochformat stimmen, nichts wird abgeschnitten.
Schritt 1.2 – Skalierung für verschiedene Bildschirme
Prompt: Sorge dafür, dass das 1080×1920-Layout auf jedem Fenster proportional skaliert (CSS-Transform-Scale auf einem Wrapper, zentriert, schwarzer Rand außen). Keine weiteren Änderungen.
Test: Browserfenster verkleinern/vergrößern – Layout bleibt proportional.
Phase 2 – Logik, noch ohne Animation
Schritt 2.1 – Datenmodell in content.json
Prompt: Baue content.json neu auf. Struktur: ein Block viruses mit den drei Ausgangsviren (id, Farbe, Herkunft bird/human, Name DE/EN), ein Block segments mit den 8 Segmenten (nur Nummer und Anzeigelabel – keine biologische Funktionsbeschreibung), ein Block properties mit den vier Ergebnis-Eigenschaften und je zwei Zuständen (DE/EN), ein Block ui für alle Oberflächentexte DE/EN. Noch keine Ergebnistexte. Lade die Datei beim Start und fülle die Beschriftungen des Layouts daraus – keine Texte mehr fest im HTML.
Test: Ein Text in content.json ändern → Änderung erscheint im Browser. Kein deutscher oder englischer Text mehr im HTML/JS.
Schritt 2.2 – Reassortment als reine Funktion
Prompt: Schreibe in einem eigenen Modul js/reassortment.js eine Funktion, die eine Runde würfelt: Für jedes der 8 Segmente wird zufällig eines der drei Ausgangsviren als Herkunft gezogen. Rückgabe ist ein Array mit 8 Einträgen (Segmentnummer plus Herkunfts-Virus-id). Keine DOM-Manipulation in diesem Modul. Rufe die Funktion bei Klick/Leertaste auf und gib das Ergebnis vorerst nur in der Konsole aus.
Test: Mehrfach Leertaste → in der Konsole jedes Mal eine andere Mischung.
Schritt 2.3 – Mischung sichtbar machen (noch ohne Animation)
Prompt: Färbe nach jedem Spin die 8 Segment-Slots im Schwein sofort in den Farben der gezogenen Herkunftsviren ein. Noch keine Animation, nur sofortiges Umfärben.
Test: Leertaste → 8 Slots wechseln die Farben. Hier wird die Kernaussage zum ersten Mal sichtbar – guter Moment für einen ersten Screenshot an den Forschenden, bevor Animationszeit investiert wird.
Schritt 2.4 – Kopplung Mischung → vier Eigenschaften (Platzhalter)
Die Platzhalterregel steht in Anhang A. Sie ist bewusst schlicht und erhebt keinen fachlichen Anspruch – deshalb datengetrieben bauen, nicht fest im Code.
Prompt: Ergänze content.json um einen Block rules, der für jede der vier Ergebnis-Eigenschaften festlegt, welcher Segment-Slot sie bestimmt und welcher Herkunftstyp (bird/human) zu welchem Zustand führt. Regel siehe docs/schritte.md, Anhang A. Schreibe eine Funktion, die aus der 8er-Mischung die vier Eigenschaftszustände ableitet, und zwar ausschließlich anhand dieses rules-Blocks – keine Regel fest im Code. Die Struktur soll so allgemein sein, dass eine Eigenschaft später auch von mehreren Segmenten abhängen kann. Lasse nach jedem Spin die vier Ergebniskacheln ihren Zustand anzeigen. Noch keine Animation.
Test: Regel in content.json ändern → Verhalten ändert sich ohne Code-Eingriff. Das ist die Voraussetzung dafür, dass der Forschende mitentscheiden kann.
Schritt 2.5 – Testlauf-Skript
Prompt: Schreibe ein kleines Node-Skript tools/simulate.js, das die Reassortment- und Eigenschaftslogik 10.000-mal durchlaufen lässt und ausgibt, wie häufig jede Eigenschaftskombination und wie häufig der Jackpot vorkommt. Nur Konsole, nicht Teil der Webapp.
Test: node tools/simulate.js läuft. Diese Zahl ist die Diskussionsgrundlage für die offene Frage „Jackpot-Häufigkeit" mit dem Forschenden – damit lässt sich jeder Regelvorschlag sofort durchrechnen, statt über Bauchgefühl zu diskutieren.
Phase 3 – Die Animation (das Herzstück)
Erst jetzt, weil die Mechanik jetzt steht.
Schritt 3.1 – Viren fahren ins Schwein
Prompt: Animiere den Beginn einer Runde: Die drei Ausgangsviren oben bewegen sich auf das Schwein zu und verschwinden darin (ca. 1,2 s, mit leichtem Nachfedern). Danach startet der bisherige Spin. Reine CSS/JS-Animation.
Schritt 3.2 – Mischvorgang
Prompt: Ersetze das sofortige Umfärben der 8 Segment-Slots durch eine Mischanimation von etwa 2,5 s: Die Slots flackern schnell durch die drei Virusfarben, werden dabei langsamer und rasten nacheinander von links nach rechts auf ihrer Endfarbe ein – jedes Einrasten mit kurzem Aufleuchten und einem Klick-Sound. Das letzte Segment rastet merklich später ein.
Test: Fühlt sich das nach Slot-Automat an? Hier liegt der ganze Spannungsbogen – ruhig mehrfach an Timing und Easing nachjustieren.
Schritt 3.3 – Ergebniskacheln nacheinander
Prompt: Lasse die vier Ergebniskacheln nach der Mischanimation nacheinander im Abstand von ca. 0,5 s aufleuchten und ihren Zustand einnehmen. Die Vorimmunitäts-Kachel kommt zuletzt und deutlich abgesetzt.
Phase 4 – Ergebnisscreen und Inhalte
Schritt 4.1 – Ergebnisscreen
Prompt: Baue den Ergebnisscreen: das entstandene Virus groß mit seinen 8 Segmenten in den Herkunftsfarben, darunter die vier Eigenschaften als Icon-Kacheln, darunter ein Einordnungstext aus content.json (maximal 40–50 Wörter), darunter der Hinweis zum Neu-Drehen. Welcher Text erscheint, wird über die Eigenschaftskombination ausgewählt; die Zuordnung steht in content.json. Baue vorerst drei Kategorien: Jackpot (Pandemiepotenzial), teilweise angepasst, harmlos.
Schritt 4.2 – Jackpot-Inszenierung
Prompt: Beim Jackpot eine eigene Inszenierung vor dem Ergebnisscreen: Lauflichter, Screen-Shake, Partikel, Fanfare – etwa 2 s. Der Ergebnisscreen danach ist bewusst ruhig und sachlich. Der Kontrast ist Absicht.
Hinweis: Tonfall ist laut Gameplan eine offene Entscheidung des Forschenden. Deshalb so bauen, dass sich die Fanfare über einen Schalter in content.json abschwächen lässt.
Schritt 4.3 – Inhalte DE/EN füllen
Diese Texte kommen aus dem Chat, nicht von Claude Code.
Prompt: Trage die bereitgestellten Texte in content.json ein (DE und EN vollständig). Prüfe, dass jeder Schlüssel in beiden Sprachen existiert, und gib eine Warnung in der Konsole aus, falls nicht.
Schritt 4.4 – Sprachumschaltung
Prompt: Sprachwechsel mit Taste L beibehalten und auf die neuen Inhalte anwenden. Zusätzlich: Im Attract-Modus wechselt die Anzeige automatisch alle 8 s zwischen DE und EN.
Phase 5 – Ausstellungsbetrieb
Schritt 5.1 – Attract-Modus
Prompt: Baue den Attract-Modus neu: Maschine blinkt, die drei Ausgangsviren schweben oben, Aufforderung „Zieh am Hebel!" / „Pull the lever!" pulsiert, Hintergrund mit schwebenden Viruspartikeln als SVG. Jede Eingabe startet eine Runde.
Schritt 5.2 – Zustandsautomat und Hebelbedienung
Prompt: Fasse das Spiel in einen klaren Zustandsautomaten: attract → intro → spin → reveal → result → attract. Ein einziges Eingabeereignis („Hebel") steuert alles und bedeutet je nach Zustand etwas anderes: im Attract und im Result startet es eine neue Runde, während laufender Animationen wird es ignoriert. Nach 20 s im Result und nach 60 s Inaktivität zurück in den Attract-Modus. Maus, Leertaste und Hebel lösen dasselbe Ereignis aus.
Test: Eine ganze Runde ausschließlich mit der Leertaste spielbar – das ist die Probe darauf, ob das Exponat ohne Touchscreen funktioniert.
Schritt 5.3 – Kiosk-Härtung
Prompt: Kontextmenü, Textauswahl, Doppeltipp-Zoom und Scrollen deaktivieren. Cursor nach 3 s Inaktivität ausblenden. Kein Tracking, keine externen Requests. Prüfe, dass die App komplett offline lädt.
Test: Netzwerk in den Dev-Tools abschalten, neu laden – alles funktioniert.
Phase 6 – Politur und Übergabe
Schritt 6.1 – Look & Feel
Prompt: Setze das „Labor-Neon"-Farbschema durch: dunkler Hintergrund, leuchtende Ränder, Glow auf aktiven Elementen, Lauflichter am Rahmen wie bei einem echten Automaten. Virusfarben bleiben wie definiert. Achte auf Lesbarkeit aus zwei Metern Entfernung – Mindestschriftgröße prüfen.
Schritt 6.2 – Fußleiste
Prompt: Fußleiste mit DPZ-Logo, dem Hinweis „Gefördert durch die DFG" und klein den Bildquellen. Logos als lokale Dateien aus assets/, Pfade so, dass fehlende Dateien das Layout nicht zerschießen.
Schritt 6.3 – Sounds vervollständigen
Prompt: Vervollständige die Web-Audio-Sounds: Einrasten pro Segment (Tonhöhe steigend), Kachel-Aufleuchten, Jackpot-Fanfare, ruhiger Ton bei harmlosem Ergebnis. Alles synthetisiert, keine Audiodateien. Stummschaltung über content.json möglich.
Schritt 6.4 – Deploy und Freigabe-Link
Prompt: Stelle sicher, dass GitHub Pages den aktuellen Stand ausliefert, und ergänze die README um eine kurze Anleitung: lokaler Start, wo Inhalte geändert werden, wo die Regeln liegen.
Danach: Link an den Forschenden, zusammen mit den offenen Fragen aus Abschnitt 4 des Gameplans, den Punkten aus Anhang B und den Zahlen aus tools/simulate.js.
Anhang A – Platzhalterregel für die Kopplung Mischung → Eigenschaften
Damit der Prototyp überhaupt spielbar ist, braucht er irgendeine Regel. Die folgende ist ausdrücklich ein Platzhalter ohne fachlichen Anspruch – sie behauptet nicht, dass diese Segmente diese Eigenschaften bestimmen. Sie liegt in content.json und wird nach dem Gespräch mit dem Forschenden ersetzt.
Jede der vier Eigenschaften hängt an einem eigenen Segment-Slot:
Eigenschaft	Platzhalter-Slot	Regel
Rezeptor	Segment 1	Herkunft Mensch → Mensch-Rezeptor, Herkunft Vogel → Vogel-Rezeptor
Körpertemperatur	Segment 2	Herkunft Mensch → 37°, Herkunft Vogel → 42°
Mensch-zu-Mensch	Segment 3	Herkunft Mensch → gut, Herkunft Vogel → schlecht
Vorimmunität	Segment 4	Herkunft Mensch → Vorimmunität vorhanden, Herkunft Vogel → keine
Die Segmente 5–8 beeinflussen in dieser Version nichts; sie werden mitgemischt und mitgefärbt, weil das Mischen der acht Segmente die Kernaussage ist.
Jackpot nach dieser Regel: Segmente 1, 2 und 3 vom Menschenvirus, Segment 4 von einem der beiden Vogelviren. Trifft in rund 2–3 % der Züge zu. Ob das die gewünschte Häufigkeit ist, entscheidet der Forschende – tools/simulate.js rechnet jede Alternative sofort durch.
Was beim Gespräch zu klären ist:
Welche Segmente bestimmen tatsächlich welche Eigenschaft, und wie stark darf das vereinfacht werden?
Soll eine Eigenschaft von mehreren Segmenten gemeinsam abhängen? (Die Datenstruktur ist darauf vorbereitet.)
Wie selten soll der Jackpot sein?
Anhang B – Was absichtlich noch nicht gebaut wird
Fachlich noch zu klären, evtl. später umzusetzen:
Mutationsmechanik. Dem Forschenden im Gespräch vorschlagen. Hintergrund: Übertragbarkeit auf den Menschen entsteht realistisch nicht allein durch Reassortment, sondern braucht zusätzlich eine Anpassungsmutation. Das würde den Jackpot an zwei unabhängige Zufälle knüpfen und die Botschaft „nur eine seltene Kombination wird gefährlich" stärken – ist aber eine inhaltliche Entscheidung, keine technische.
Benennung der Segmentfunktionen. Welches Segment wofür codiert, und ob das für die Zielgruppe überhaupt gezeigt werden soll, statt nur „acht Segmente werden neu gemischt".
Endgültige Kopplungsregel (siehe Anhang A).
Bewusst zurückgestellt:
Freischalten realer Pandemien (1957, 1968, 2009) als Wiederspielwert
Virendex-Ersatz / Sammelmechanik
Hebel-Hardware-Anbindung (die Eingabe-Abstraktion aus Schritt 5.2 reicht vorerst)
Fotos und Illustrationen aus Mediendatenbank oder Adobe Stock
PWA / Service Worker