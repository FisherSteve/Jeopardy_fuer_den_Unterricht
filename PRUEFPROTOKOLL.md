# Prüfprotokoll

Stand: 12. September 2026. Ausgeführt auf Windows. Die fertigen Beispiele und der lokale Spiel-Ersteller wurden mit `node build.js` aus derselben Framework-Version gebaut.

## Ergebnis-Popup und Lernfeedback

Nach jeder Bewertung wird das Ergebnis groß in einem Dialog angezeigt. Richtige Antworten erhalten einen kurzen CSS-Jubel und eine Punkteanzeige. Bei falschen Antworten bleiben richtige Antwort und Erklärung sichtbar, bis fortgesetzt wird. Der nächste Teamname steht im selben Popup; es ist kein zweiter Dialogschritt nötig. Lehrkräftehinweise werden dabei nicht eingeblendet.

- `tests/feedback.cjs` in Chromium, Firefox und WebKit bestanden: richtige/falsche Zahleneingabe, falsche Auswahl und manuelle Bewertung, drei Teams mit zyklischem Wechsel, Lösung und Erklärung ohne Lehrkräftefreigabe, Doppelabgabe und Wiederherstellung einer offenen Rückmeldung nach Neuladen.
- Fortsetzen per Touch, Enter und Esc, Fokusbegrenzung und deaktivierte Animationen bei reduzierter Bewegung geprüft. Die Rückmeldung besitzt kein Zeitlimit; nach der letzten Karte führt sie zum Spielergebnis.
- Screenshots der richtigen und falschen Rückmeldung bei 1920 × 1080 und der mobilen Rückmeldung bei 390 × 844 kontrolliert.
- Die bestehende Engine-Testsuite (13 Tests) sowie Browser- und mobile Spielende-Prüfungen wurden mit dem neuen Ablauf erneut ausgeführt. Der lokale Spiel-Ersteller enthält ebenfalls die aktualisierte Oberfläche.

## GitHub-Pages-Struktur

Alle drei vorhandenen Spiele liegen jetzt unter `spiele/<kennung>/index.html`. Die Startseite wird aus den vorhandenen Spielordnern erzeugt. Das zusätzlich lokal vorhandene Spiel zur Elektronikerausbildung wurde einschließlich seines JSON-Aufgabensatzes übernommen.

- `tests/pages.cjs`: Startseite, alle drei Spiele und lokale Startseitenlinks unter dem simulierten Repository-Unterpfad `/Jeopardy_fuer_den_Unterricht/` in Chromium, Firefox und WebKit erfolgreich geprüft. Sowohl explizite `index.html`-Links als auch Verzeichnis-URLs liefern die Spielseite; Fragen lassen sich öffnen und schließen.
- Mobile Startseite bei 390 × 844 ohne horizontalen Überlauf geprüft und visuell kontrolliert.
- `npm test`: alle 13 Engine-Tests bestanden. `tests/browser.cjs` mit den neuen Spielpfaden in allen drei Engines bestanden.
- Acht lokale Markdown-Linkziele sowie `git diff --check` und `git diff --cached --check` geprüft.
- Historische Originalspiele und die alte allgemeine Prompt entfernt. Bereits getrackte Screenshots und generierte Test-HTML-Dateien aus dem Git-Index entfernt; lokale Testausgaben bleiben per `.gitignore` ausgeschlossen.

Dies ist eine lokale Prüfung der Pages-Struktur. Die Änderungen wurden dabei nicht auf GitHub gepusht oder als Live-Website veröffentlicht.

## Ausgeführte Prüfungen

| Prüfung | Ergebnis |
| --- | --- |
| `node --test tests/engine.test.js` | 13 Tests bestanden |
| `node tests/browser.cjs` mit Chrome for Testing 131.0.6778.204 | Bestanden |
| Dasselbe mit Playwright Firefox 153.0 | Bestanden |
| Dasselbe mit Playwright WebKit 26.5 | Bestanden |
| `node tests/visual.cjs` in allen drei Engines | Mobile Darstellung und sichtbares Spielende bestanden |
| Sichtprüfung erzeugter Screenshots | Brett, Frage, Zahlenfeld, Auswahl und Spiel-Ersteller kontrolliert |

Die Browserläufe nutzten vorhandene bzw. temporär installierte Testbrowser. Das eigentliche Spiel benötigt diese Werkzeuge nicht. Screenshots werden unter `tests/screenshots/` erzeugt und sind per `.gitignore` vom Repository ausgeschlossen.

## Was geprüft wurde

- Genau ein bis fünf Themen; pro Thema fünf Aufgaben. Null oder mehr als fünf Themen werden abgewiesen. Anzeige und Gesamtzahl passen zum Aufgabensatz. Ein kurzes Spiel mit fünf sowie ein vollständiges mit 25 Fragen wurden im Browser bis zum Ende gespielt; alle Themenzahlen zusätzlich in der Engine geprüft.
- Zwei Teams als Standard, im Menü bis zu sechs hinzufügen und wieder entfernen. Drei Teams bleiben nach Neuladen erhalten; während des Spiels sind Anzahländerungen gesperrt. Reset erhält Teamzahl und Namen.
- Automatische zyklische Reihenfolge bei richtigen und falschen Antworten. Jede Bewertung schließt genau eine Karte. Keine Übernahme, keine Minuspunkte und kein Punktabzug bei bereits vorhandenen Punkten.
- Keine Wertung vor dem Aufdecken bei manueller Bedienung. Schnell aufeinanderfolgende Klicks erzeugen weder doppelte Punkte noch versehentlich die nächste Frage.
- Zahlenfeld per Touch und Tastatur: richtige und falsche Eingaben, leere Eingaben, Dezimalkomma und Dezimalpunkt, führende Nullen, Vorzeichen und ungültige Schreibweisen.
- Antwortauswahl per Touch mit bewusster Abgabe und automatischer Wertung. Die exakte Mengenprüfung für Mehrfachauswahl wurde zusätzlich in den Engine-Tests geprüft.
- Lehrkräftehinweise und Hinweisebutton standardmäßig verborgen. Bei automatischen Aufgaben ist auch das manuelle Aufdecken verborgen. Die Kürzel A und H umgehen diese Freigabe nicht. Nach Freigabe im Menü funktionieren Aufdecken, Hinweise und manuelle Bewertung.
- Schließen ohne Wertung, Punkteanzeige, Rückgängig, Reset-Abbruch, Reset mit Namenerhalt, Gewinner und Gleichstand.
- Speicherung und Wiederherstellung; beschädigte oder veraltete Spielstände werden verworfen. Das Spiel bleibt bei gesperrtem Speicher bedienbar.
- Kein horizontaler Seitenüberlauf bei den geprüften Ansichten 1920 × 1080, 1024 × 768, 768 × 1024, 390 × 844 und 844 × 390. Kleine Ansichten erlauben Scrollen innerhalb des Bretts bzw. Dialogs. Das Brett passt bei 1024 × 768 in die Höhe des Viewports.
- Fokus bleibt bei Tastaturnavigation im Dialog; Esc schließt. Das Spielende erhält Fokus und wird auch auf kleinen Displays in den sichtbaren Bereich gebracht. Touch-Kontext und reduzierte Bewegung wurden ausgeführt.
- Spiel-Ersteller: ungültige JSON-Eingabe, Einlesen einer JSON-Datei, Einfügen eines JSON-Codeblocks, Download einer eigenständigen HTML und Öffnen des erzeugten Spiels. Ein Text mit `</script>` und HTML-ähnlichem Inhalt bleibt Text und wird korrekt eingebettet.
- Keine externen HTTP-Anfragen und keine Konsolenfehler auf den überwachten Spielseiten während der Browserprüfungen.

## Grenzen der Prüfung

Die Prüfungen verwenden Browser-Automation auf Windows. **Nicht direkt geprüft** wurden physische Promethean-Displays, andere Schul-Touchscreens, echte Android-Geräte, Linux-Systeme sowie Safari auf einem echten iPad, iPhone oder Mac. Playwright-WebKit ist ein Engine-Test und keine Safari-Gerätefreigabe.

Vor Unterrichtseinsatz einmal auf dem tatsächlichen Gerät prüfen: Datei öffnen, Touch-Eingabe, Teamwechsel, Bildschirmrotation, Browserzoom und gegebenenfalls Vollbild. Insbesondere bei iOS/iPadOS kann eine HTML-Datei in einer Dateivorschau statt in einem JavaScript-fähigen Browser landen. Der geeignete Verteilungs- und Öffnungsweg gehört deshalb zur Geräteprüfung.

Die übernommenen Unterrichtsinhalte wurden punktuell präzisiert und um Antwortformate ergänzt. Die technische Prüfung ersetzt weder eine vollständige curriculare Prüfung noch die Kontrolle durch die unterrichtende Lehrkraft.

## Ergänzung vom 12.09.2026: optionale Wertung und Klasse 8

- Alle Spiele und der Spiel-Ersteller neu gebaut; 14 Engine-Tests bestanden.
- Chromium 131, Firefox 153 und WebKit 26.5: scoring.cjs, feedback.cjs, browser.cjs und visual.cjs bestanden. Standard ohne Abzug, Untergrenze 0, negative Werte, tatsächliche Punktedifferenz im Popup, Reset, Rückgängig und Speicherung geprüft. Menü-Screenshot kontrolliert.
- klasse8.cjs: alle 25 Aufgaben des neuen Mathematikquiz mit unabhängig festgelegten erwarteten Antworten in allen drei Engines korrekt gewertet; Teamfolge und Endstände 3900/3600 geprüft. Spielfeld-Screenshot kontrolliert.
- pages.cjs: Startseite und vier Spiele unter einem Repository-Unterpfad einschließlich Verzeichnis-URLs in allen drei Engines geprüft.
- Öffentliche Startseite per HTTP mit Status 200 erreichbar. README enthält direkte Pages-Links und den Online-Spiel-Ersteller.
- Physische Touchdisplays, Android, Linux und echtes Safari auf Apple-Geräten wurden weiterhin nicht direkt getestet.

## Ergänzung vom 12.09.2026: Meme-Mix ab etwa 14

- Neuer Aufgabensatz mit fünf Rubriken und 25 Fragen (17 Auswahl-, acht Zahlenfragen). Fakten und Deutschland-Bezug der Netz-/Gaming-Themen recherchiert.
- node build.js und npm test: erfolgreich, alle 14 Engine-Tests bestanden. Keine Änderung an Engine oder Oberfläche.
- tests/meme-mix.cjs in Chromium 131, Firefox 153 und WebKit 26.5: alle 25 unabhängig festgelegten Antworten richtig gewertet, Teamwechsel und Spielende korrekt; falsche Antwort zeigt Lösung und Erklärung. Kleine Touch-Ansicht geprüft.
- tests/pages.cjs: Startseite, fünf Spiele und Verzeichnis-Links unter Repository-Unterpfad in allen drei Engines bestanden.
- Screenshots für schmale Ansicht sowie längste Frage, Antwort und Erklärung visuell geprüft. Lange Inhalte bleiben im Dialog scrollbar.
- Physische Promethean-Displays, echte Android-/Apple-Geräte und Linux wurden nicht direkt getestet.

## Ergänzung vom 13.09.2026: Klasse 10 – Startklar

- Neues Einstiegsquiz: fünf Rubriken, 25 Fragen (18 Auswahlfragen, sieben Zahleneingaben). Grundlagen aus früheren Jahrgängen und Allgemeinwissen; kein neu behandelter Klasse-10-Stoff vorausgesetzt.
- Build erfolgreich; alle 14 Engine-Tests bestanden. Engine und Oberfläche unverändert.
- tests/klasse10-start.cjs in Chromium 131, Firefox 153 und WebKit 26.5 bestanden: alle 25 Antworten gegen unabhängig festgelegte Erwartungen geprüft, Teamfolge und Spielende korrekt. Reset und falsche Antwort mit Lösung/Erklärung ebenfalls geprüft.
- Längste Frage, längste Antwortoption und längste Erklärung auf schmalem Bildschirm dargestellt und Screenshots visuell kontrolliert; lange Inhalte im Dialog scrollbar.
- tests/pages.cjs: Startseite und sechs Spiele einschließlich Verzeichnis-URLs unter Repository-Unterpfad in allen drei Engines bestanden.
- Physische Schuldisplays, echte Android-/Apple-Geräte und Linux wurden nicht direkt geprüft.

## Ergänzung vom 13.09.2026: Erwachsenenquiz und aussagekräftige Spielnamen

- Erwachsenenquiz als Inhaltsdatei übernommen und mit dem gemeinsamen Framework gebaut; alle sieben Spiele mit kurzen Themenangaben im Titel versehen. Bestehende URLs bleiben erhalten; Startseite und README aktualisiert.
- Build erfolgreich; alle 14 Engine-Tests bestanden. Engine und Oberfläche unverändert.
- Erwachsenenquiz in Chromium 131, Firefox 153 und WebKit 26.5 vollständig durchgespielt: 25 Karten, automatische Wertungen, Teamfolge und Endstände geprüft. Startseite und alle sieben Spiele unter Repository-Unterpfad in allen drei Engines geprüft.
- Schmale Startseite sowie lange Frage und Ergebnisanzeige visuell kontrolliert.
- Regel gegen direkte und indirekte Lösungsverräter in Framework-Prompt und Agentenanleitung ergänzt. Anschließend die bereits sortierte Ereignisliste einer Frage gemischt; erneuter Build und gezielte Inhaltsprüfung bestanden.
- Physische Schuldisplays, echte Android-/Apple-Geräte und Linux wurden nicht direkt geprüft.
