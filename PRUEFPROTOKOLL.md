# Prüfprotokoll

Stand: 12. September 2026. Ausgeführt auf Windows. Die fertigen Beispiele und der lokale Spiel-Ersteller wurden mit `node build.js` aus derselben Framework-Version gebaut.

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
