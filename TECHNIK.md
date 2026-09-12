# Wiederverwendbares Unterrichts-Jeopardy

Die Spiele werden aus einer gemeinsamen Engine und separaten Aufgabensätzen gebaut. Für ein neues Thema werden nur Inhalte erstellt; die Bedienung bleibt gleich.

## Direkt spielen

- **Klasse 5:** `spiele/mathematik-klasse-5/index.html`
- **Klasse 6:** `spiele/faechermix-klasse-6/index.html`

Die jeweilige `index.html` aus einem Spielordner auf das Gerät kopieren und in einem Browser öffnen, der lokale HTML-Dateien mit JavaScript ausführt. Sie enthält alle benötigten Bestandteile und benötigt keine Internetverbindung, Installation oder Node.js zum Spielen. Die ursprünglichen veralteten HTML-Dateien wurden entfernt.

**Bedienung:** Das hervorgehobene Team wählt eine Punktekarte. Antwort geben lassen, „Antwort anzeigen“, dann „Richtig“ oder „Falsch“. Beide Bewertungen schließen die Karte sofort ab; es gibt keine Übernahme. Richtig gibt den Kartenwert, falsch keine Punkte und keinen Abzug. Danach zeigt ein Ergebnis-Dialog die Wertung und das nächste Team. Bei falsch erscheinen Antwort und Erklärung bis zum bewussten Fortsetzen. Die Bewertungsbuttons nennen das aktive Team. Zwei Teams sind voreingestellt; im Menü lassen sich vor der ersten Bewertung zwei bis sechs Teams anlegen, entfernen und benennen. Im laufenden Spiel bleiben Anzahl und Reihenfolge fest. Reset erhält die Teams und gibt das Ändern der Anzahl wieder frei.

**Umfang:** Ein bis fünf Themen mit jeweils fünf Punktekarten. Das Brett hat entsprechend ein bis fünf Spalten und das Spiel endet nach 5 bis 25 Fragen. Es werden keine fehlenden Themen ergänzt.

**Selbst antworten:** Passende Aufgaben bieten ein Touch-Ziffernfeld oder große Antwortoptionen. Das Team gibt eine Zahl ein oder markiert seine Auswahl und drückt „Antwort abgeben“. Das Spiel wertet, schließt die Karte und wechselt automatisch zum nächsten Team. Einzelauswahl und Mehrfachauswahl sind möglich. Die Beispiele enthalten Zahleneingaben und einzelne Auswahlaufgaben; Aufgaben mit Erklärungen bleiben mündlich. Die Lehrkraft legt das Format je Aufgabe im Aufgabensatz fest; die Beispiele und Kriterien stehen in `Framework-Prompt.md`.

Im Zahlenfeld sind auch physische Zifferntasten, Komma/Punkt, Rücktaste, Entf und Minus möglich. Enter gibt die Antwort ab, wenn das Zahlenfeld fokussiert ist. Das Ziffernfeld hat zusätzlich Löschen und Vorzeichenwechsel. Dezimalzahlen werden exakt verglichen, etwa 2,60 = 2.6; Einheiten werden separat angezeigt. Brüche und Uhrzeiten werden nicht als Zahlenfeld-Eingabe interpretiert. Bei automatischen Aufgaben ermöglicht „Antwort anzeigen“ nach Freigabe im Menü alternativ eine manuelle Bewertung.

Eine kurze Animation zeigt den Wechsel. Sie entfällt bei der Systemeinstellung für reduzierte Bewegung. Nach einer Bewertung schützt eine 450-ms-Sperre das darunterliegende Brett vor dem zweiten Tap derselben Eingabe. Lehrkräftehinweise und ihr Button sind standardmäßig verborgen; eine Freigabe im Menü macht den Button verfügbar. Nach Neuladen ist diese Freigabe wieder aus. Auf dem gemeinsamen Bildschirm eingeblendete Hinweise und Lösungen sind für alle sichtbar; dies ist keine Authentifizierung.

**Tastatur:** Tab navigiert, Enter/Leertaste betätigen den fokussierten Button. In der Frage: A = Antwort ein/aus, R = richtig, F = falsch, H = Hinweise, Esc = schließen. Die Kürzel greifen nicht beim Bearbeiten der Teamnamen. Es ist keine manuelle Teamauswahl erforderlich.

„Rückgängig“ nimmt die letzte abgeschlossene Karte einschließlich Punktewertung und Zugwechsel zurück. Schließen ohne Bewertung lässt Karte und Team unverändert. Reset steht im Menü und erhält die Namen.

## Neue Spiele erstellen

Ohne Entwicklungswerkzeuge: `Spiel-Erstellen.html` öffnen, JSON einfügen oder laden, prüfen und als fertige HTML herunterladen. Der Ersteller enthält dieselbe Engine und Spielvorlage; er verarbeitet alles lokal. Die Anleitung für Lehrkräfte steht in `README.md`.

1. `Framework-Prompt.md` zusammen mit den Unterrichtsdaten an den Agenten geben. Für Klasse 5 enthält `Beispielbefüllung – Jeopardy Mathematik Klasse 5.md` den konkreten Auftrag.
2. Der Agent erstellt einen Aufgabensatz in `content/`.
3. Mit installiertem Node.js im Ordner ausführen:

```sh
node build.js content/mathematik-klasse-5.json
```

Alle Spiele bauen: `node build.js`. Eigenes Ausgabeziel: `node build.js content/mathematik-klasse-5.json spiele/mein-spiel/index.html`.

Es gibt keine Build-Abhängigkeiten. `npm install` ist dafür nicht nötig. Ohne Werkzeuge liefert das LLM JSON, das anschließend gebaut wird. Eine fertig gebaute HTML ist zugleich eine vollständig eingebettete Vorlage: Ihr `game-data`-Block kann gemäß Framework-Prompt ersetzt werden.

## Aufbau und Regeln für Änderungen

| Datei/Ordner | Zweck |
| --- | --- |
| `Framework-Prompt.md` | Vollständiger wiederverwendbarer Auftrag für Agenten und LLMs |
| `content/*.json` | Themen, Fragen, Antworten, Erklärungen, Hinweise, Tabellen und optionale Eingabe-/Auswahlformate |
| `framework/engine.js` | Datenvalidierung, Teamreihenfolge, Wertung, Wiederherstellung |
| `framework/app.js` | Gemeinsame Browserbedienung und Speicherung |
| `framework/template.html`, `style.css` | Gemeinsame Oberfläche |
| `build.js` | Baut die eigenständigen HTML-Dateien |
| `framework/creator.html` | Vorlage des lokalen Spiel-Erstellers |
| `framework/home.html`, `index.html` | Vorlage und erzeugte Startseite mit Links zu allen Spielordnern |
| `Spiel-Erstellen.html` | Eigenständiger Ersteller mit eingebetteter Engine und Spielvorlage |
| `spiele/*/index.html` | Fertige Spiele zum Weitergeben |
| `tests/` | Regeln, Browser-Verhalten und Screenshots |
| `PRUEFPROTOKOLL.md` | Tatsächliche Prüfung und verbleibende Grenzen |

Für GitHub Pages liegt jedes Spiel unter `spiele/<kennung>/index.html`. Auch ein einzelner Build aktualisiert die Root-Startseite aus allen vorhandenen Spielordnern; neue Spiele erscheinen dadurch automatisch. Explizite relative `index.html`-Links funktionieren sowohl unter dem Repository-Unterpfad auf GitHub Pages als auch bei lokaler Nutzung. Die Spiel-Dateien selbst benötigen keine relativen Assets. `.nojekyll` verhindert einen zusätzlichen Jekyll-Verarbeitungsschritt.

Neue Inhalte nicht durch Kopieren und Umschreiben einer Engine erstellen. Änderungen an der gemeinsamen Bedienung in `framework/` durchführen und alle Spiele neu bauen. Der Build prüft ein bis fünf Kategorien mit je fünf Aufgaben und eindeutige IDs. Inhalt wird als Text gerendert; HTML aus Aufgabensätzen wird nicht ausgeführt.

Die Klasse-5-Daten übernehmen den vorhandenen Ansatz mit einzelnen Präzisierungen: Quadrat mit rechten Winkeln, gleichmäßige Verteilung der Äpfel und eine tatsächlich dargestellte Altpapier-Tabelle. Klasse 6 übernimmt die vorhandenen Themen; kurze Antworten und Erklärungen sind jetzt getrennt. Die Übernahme ist keine vollständige curriculare Neuentwicklung aller 50 Aufgaben.

## Verhalten bei Unterbrechungen

Das Spiel speichert nach Möglichkeit automatisch im Browser. Es speichert Teamnamen und Bewertungsereignisse, keine Schülerprofile. Punkte und aktives Team werden aus den abgeschlossenen Karten berechnet. Eine lediglich geöffnete Frage ist noch nicht abgeschlossen. Schließen und erneutes Öffnen führen deshalb zu keinem Zugwechsel.

Die Ergebnis-Rückmeldung verwendet denselben modalen Dialog mit eigener Ansicht. Eine offene Rückmeldung wird als `feedbackId` neben dem Spielstand gespeichert und nach Neuladen ausschließlich für die letzte abgeschlossene Karte rekonstruiert. Ihr Fortsetzen verändert die Punkte nicht. Eine 450-ms-Sperre verhindert, dass eine Doppelabgabe das Popup sofort überspringt. Danach kann es per Touch, Enter, Leertaste oder Esc bestätigt werden; ein Zeitlimit gibt es nicht. Das letzte Popup führt zum fokussierten Spielergebnis. `explanation` ist öffentliches Lernfeedback, `teacherNote` bleibt intern. Der visuelle Jubel nutzt ausschließlich CSS und respektiert reduzierte Bewegung; Audio und externe Assets sind nicht nötig.

Jedes Spiel hat eine eigene Kennung. Zusätzlich wird der vollständige Inhalt verglichen: Bei geänderten Fragen oder Regeln beginnt ein neuer Spielstand. Beschädigte Speicherstände werden verworfen. Fällt das Speichern aus, bleibt das Spiel bedienbar und zeigt einen Hinweis; nach Neuladen ist der Stand dann möglicherweise weg. Derselbe Aufgabensatz sollte nur in einem Tab gleichzeitig gespielt werden; Tab-Synchronisation und geräteübergreifende Speicherung sind nicht implementiert.

## Browser und Schuldisplays

Die Oberfläche verwendet standardisierte Browserfunktionen und keine gerätespezifische Promethean-Anbindung. Touch funktioniert ebenso auf anderen interaktiven Displays. Querformat bietet den besten Überblick. Auf schmalen Displays bleibt die Mindestgröße der Karten erhalten und das Brett lässt sich seitlich verschieben; Frage und Bewertungsbuttons passen sich an. Sehr lange Inhalte können im Dialog vertikal gescrollt werden.

Vollbild wird nur angeboten, wenn der Browser es unterstützt; die Funktion kann außerdem vom Gerät oder eingebetteten Browser verweigert werden. Das Spiel funktioniert weiter im Browserfenster. Siehe [MDN zur Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API).

Das Speicherverhalten für lokal geöffnete `file:`-URLs ist browserabhängig und nicht standardisiert. Deshalb ist die Speicherung fehlertolerant. Siehe [MDN zu localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

**iOS/iPadOS:** Eine HTML-Vorschau in der Dateien-App ist nicht gleichbedeutend mit Ausführung in Safari. Ob eine einzelne lokale HTML direkt im Browser geöffnet werden kann, hängt vom konkreten Öffnungsweg ab. Wenn das Gerät nur eine Vorschau anbietet, dieselbe HTML über eine schulische statische Webadresse in Safari öffnen. Dafür wird beim Laden eine Verbindung benötigt; automatisches Offline-Neuladen dieser Webadresse wird nicht zugesichert. Auf allen Plattformen ist der tatsächliche Browser- und Dateiverteilungsweg Teil der Geräteprüfung.

## Prüfen

```sh
npm test
node build.js
```

Für Browserprüfungen zusätzlich Playwright bereitstellen und die Testbrowser installieren, etwa in einer eigenen Testumgebung:

```sh
npm install --no-save playwright
npx playwright install chromium firefox webkit
node tests/browser.cjs
node tests/visual.cjs
node tests/pages.cjs
node tests/feedback.cjs
```

Optional setzen: `PLAYWRIGHT_MODULE` = Pfad zur vorhandenen Playwright-Installation, `CHROMIUM_EXECUTABLE` = Chrome-Programmdatei, `PLAYWRIGHT_BROWSERS_PATH` = Browsercache und `BROWSER_ENGINES` = kommaseparierte Auswahl. Diese Werkzeuge sind nur für Tests nötig, nicht zum Bauen oder Spielen.

WebKit-Automation ersetzt keinen Test auf einem echten iPad. Vor Einsatz im Unterricht am tatsächlichen Display einmal Kartenwahl, Bewertung, Teamwechsel, Scrollen, Zoom und den lokalen Öffnungsweg prüfen.
