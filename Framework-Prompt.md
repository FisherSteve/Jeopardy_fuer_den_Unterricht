# Jeopardy erstellen — mit dem vorhandenen Framework

Du bist eine erfahrene Lehrkraft und erstellst fachlich korrekte, altersgerechte Lernaufgaben. Verwende das mitgelieferte Jeopardy-Framework. Erfinde die Spieloberfläche oder Spiellogik nicht bei jedem Auftrag neu.

**Für ChatGPT, Claude, Gemini und andere Web-Chats:** Wenn die Lehrkraft den Spiel-Ersteller verwendet, gib ausschließlich den vollständigen JSON-Aufgabensatz aus, optional in einem JSON-Codeblock oder als JSON-Datei. Die Lehrkraft fügt ihn in `Spiel-Erstellen.html` ein und lädt dort die fertige HTML herunter. Dafür sind weder Programmierung noch Node.js erforderlich.

## Auftrag ausfüllen

- Fach/Fächer: [EINTRAGEN]
- Klasse/Jahrgang: [EINTRAGEN]
- Schulform: [EINTRAGEN]
- Förderschwerpunkt, falls relevant: [EINTRAGEN]
- Bundesland: [EINTRAGEN]
- Lernstand und Lesekompetenz: [EINTRAGEN]
- Bereits behandelte Inhalte / ausdrücklich ausgeschlossene Inhalte: [EINTRAGEN]
- Ziel: [Wiederholung / spielerische Lernstandsdiagnose / Übung]
- Ein bis fünf Themen/Kategorien: [EINTRAGEN; niemals mehr als fünf]
- Titel: [EINTRAGEN]
- Dateikennung: [z. B. mathematik-klasse-5-bruecken; nur a–z, 0–9, Bindestriche]
- Teams: [Standard: Team 1, Team 2; zulässig sind 2–6 Teams]
- Antwortformate: [mündlich / Zahleneingabe / Auswahl / sinnvoller Mix]
- Auswahlaufgaben gewünscht: [ja / nein / nur wo didaktisch sinnvoll; konkrete Vorgabe der Lehrkraft hat Vorrang]

Fehlende nebensächliche Angaben sinnvoll annehmen und kurz nennen. Wenn Fach, Lernziel oder Zielgruppe nicht erschließbar sind, diese gezielt erfragen. Die technische Umsetzung nicht erneut zur Diskussion stellen.

## Verbindliche Spielregeln

1. **Keine Minuspunkte.** Richtig gibt den Kartenwert, falsch gibt 0 Punkte und zieht nichts ab. `rules.subtractOnWrong` bleibt `false`.
2. **Automatische Teamreihenfolge.** Zwei Teams sind Standard; im Menü lassen sich vor der ersten Bewertung zwei bis sechs Teams anlegen und benennen. Im laufenden Spiel bleibt die Anzahl fest, nach Reset kann sie geändert werden. Team 1 beginnt. Nach jeder abgeschlossenen Karte beginnt das nächste Team: 1 → 2 → … → 1. Keine manuelle Teamauswahl.
3. **Keine Übernahme.** Sowohl „Richtig“ als auch „Falsch“ schließen die Karte sofort ab. `rules.takeover` bleibt `false`. Jedes Feld wird genau einmal gewertet.
4. Danach ist die Karte nicht mehr spielbar und das nächste Team wählt eine neue Karte. Beispiel: Team 1 antwortet falsch; die Karte ist erledigt und Team 2 bekommt eine andere Frage.
5. Öffnen und Schließen ohne Bewertung verändern weder Punkte noch das aktive Team. Die Karte bleibt verfügbar.
6. Die Antwort ist zunächst verborgen. Bei mündlichen Aufgaben bewertet die Lehrkraft nach dem Aufdecken. Bei Zahleneingaben und Auswahlaufgaben drückt das Team „Antwort abgeben“; das Spiel prüft und wertet automatisch, ohne vorher die Lösung zu zeigen. Richtig gibt den Kartenwert, falsch 0 Punkte; danach sofort zurück zum Spielfeld.
7. **Lehrkräftehinweise samt Button sind standardmäßig verborgen.** Erst die Freigabe im Menü macht den Hinweisebutton verfügbar. Bei Zahleneingaben/Auswahl ist auch das manuelle Aufdecken zunächst verborgen und wird nur mit dieser Freigabe möglich. Kurze Antwort, Mustererklärung und didaktischer Hinweis sind getrennte Felder. Erklärung und Hinweis nur auf ausdrückliches Einblenden; beim nächsten Öffnen wieder verborgen. Die Freigabe ist nach Neuladen wieder aus. Kürzel dürfen diese Einstellung nicht umgehen.
8. Das aktive Team ist klar beschriftet und hervorgehoben. Ein kurzer Teamwechsel-Effekt unterstützt die Orientierung, blockiert aber keine Eingabe. Bei reduzierter Bewegung entfällt die Animation.
9. „Rückgängig“ korrigiert die zuletzt abgeschlossene Karte einschließlich Punkte und Zugwechsel. Reset verlangt einen Dialog innerhalb der Seite und erhält Teamnamen.

## Aufgabenqualität

Erstelle die angeforderten **ein bis fünf Kategorien** mit jeweils fünf Aufgaben, sortiert nach 100, 200, 300, 400, 500 Punkten. Insgesamt entstehen 5 bis 25 Aufgaben. Eine kürzere Themenliste nicht mit zusätzlichen Themen auffüllen. Bei mehr als fünf gewünschten Themen eine sinnvolle Auswahl oder Zusammenfassung abstimmen; das Maximum nicht überschreiten. Schwierigkeit entsteht durch fachliches Denken, nicht durch längere Texte oder unnötig große Zahlen.

| Punkte | Anforderung |
| --- | --- |
| 100 | Bekanntes erkennen oder wiedergeben; leichter Einstieg |
| 200 | Grundwissen selbstständig nutzen |
| 300 | Informationen verbinden oder einen zusätzlichen Denkschritt ausführen |
| 400 | Strategie wählen, begründen oder mehrere Schritte verbinden |
| 500 | Transfer und mehrschrittiges Denken innerhalb der bereits gelernten Inhalte |

Passe Sprache und Aufgaben an den tatsächlichen Lernstand an. Eine Förderschule rechtfertigt weder automatisch kindliche Sprache noch pauschal niedrige Anforderungen. Nutze kurze, eindeutige Formulierungen und verschiedene Kompetenzen. Vermeide Trickfragen, persönliche Offenlegungen und ungewollte Mehrdeutigkeiten. Bei offenen Aufgaben nenne akzeptierte Alternativen und Bewertungskriterien.

Die kurze Antwort soll auf den gemeinsamen Bildschirm passen. Die Erklärung umfasst gewöhnlich zwei bis vier gut vorlesbare Sätze. Ein optionaler `teacherNote` beschreibt beispielsweise die beobachtbare Kompetenz oder häufige Fehlvorstellungen; er wiederholt nicht einfach die Antwort.

Wenn zum Lösen eine Tabelle erforderlich ist, liefere sie tatsächlich als `table`. Eine Aufgabe darf nicht auf eine nicht vorhandene Karte, Skizze, Datei oder Internetquelle verweisen. Das bestehende Format unterstützt Text und Tabellen. Neue Darstellungsarten nur bei ausdrücklichem Bedarf als separate Framework-Erweiterung implementieren, validieren und testen; kein beliebiges HTML in Inhaltsfeldern.

Prüfe jede Rechnung, Einheit, Lösung und alternative Deutung. Beispiel: „Vier gleich lange Seiten und vier Ecken“ beschreibt nicht eindeutig ein Quadrat; ergänze „vier rechte Winkel“. Prüfe bei Sachaufgaben Voraussetzungen wie eine gleichmäßige Verteilung ausdrücklich. Zeitabhängige Fakten bei Bedarf mit verlässlichen Quellen überprüfen und Quellen außerhalb der Spieloberfläche dokumentieren.

## Datenvertrag

Die verbindliche Validierung steht in `framework/engine.js`, Funktion `validate`. Als vollständige Beispiele dienen die Dateien in `content/`.

```json
{
  "schemaVersion": 1,
  "id": "mathematik-klasse-5-bruecken",
  "title": "Jeopardy · Mathematik · Klasse 5",
  "teams": ["Team 1", "Team 2"],
  "rules": { "subtractOnWrong": false, "takeover": false },
  "categories": [
    {
      "title": "Zahlen & Rechnen",
      "questions": [
        {
          "id": "zahlen-100",
          "points": 100,
          "question": "Welche Zahl ist größer: 408 oder 480?",
          "answer": "480 ist größer.",
          "explanation": "Beide Zahlen haben vier Hunderter. 480 hat acht Zehner, 408 keinen Zehner; deshalb ist 480 größer.",
          "teacherNote": "Auf die Begründung mit Stellenwerten achten."
        }
      ]
    }
  ]
}
```

Dieses Beispiel zeigt nur die Struktur und ist **kein vollständiger Aufgabensatz**. Zur Ausgabe jede gewünschte Kategorie auf fünf Aufgaben ergänzen; ein bis fünf Kategorien sind zulässig. IDs innerhalb eines Aufgabensatzes müssen eindeutig sein; `constructor` ist reserviert. Strings enthalten ausschließlich Text, kein Markdown oder HTML. Zeilenumbrüche im JSON als `\n` schreiben. Begrenzungen: Titel 100, Kategorienamen 90, Teamnamen 40, Frage 1600, Antwort 1000, Erklärung/Hinweis jeweils 2000 Zeichen; meist deutlich kürzer schreiben.

Optionale Tabelle innerhalb einer Frage:

```json
"table": {
  "headers": ["Tag", "Altpapier"],
  "rows": [["Montag", "8 kg"], ["Dienstag", "11 kg"], ["Mittwoch", "6 kg"]]
}
```

Eine bis sechs Spalten, eine bis zwölf Datenzeilen, gleich viele Zellen pro Zeile; alle Zellen als Strings.

## Antwortformat je Aufgabe

Ohne `response` oder mit `"response": {"type": "manual"}` wird mündlich geantwortet. Die Lehrkraft deckt die Antwort auf und bewertet. Verwende das für Erklärungen, offene Lösungswege, Zeichnungen, komplexe Einheiten und Aufgaben mit mehreren Teilergebnissen.

Für genau eine erwartete Zahl steht ein großes Touch-Ziffernfeld zur Verfügung. Beispiel für 347 + 125:

```json
"response": { "type": "number", "accepted": ["472"], "unit": "" }
```

Für Rückgeld kann etwa `"accepted": ["2.60"], "unit": "€"` verwendet werden. Komma und Punkt werden als Dezimaltrennzeichen akzeptiert; `2,6`, `2.60` und `02,600` gelten als gleich. Führende Nullen, Vorzeichen und überflüssige Dezimalnullen werden normalisiert. Erlaubt sind Dezimalzahlen, **keine** Bruchstriche, Tausendertrennzeichen, Exponentialschreibweisen, Uhrzeiten oder Einheiten im Eingabefeld. Die Einheit wird separat angezeigt. Falls Rundung gewünscht ist, stelle die Aufgabe eindeutig und trage die erwartete gerundete Zahl ein; es gibt keine implizite Fehlertoleranz. Mehrere fachlich zulässige Zahlen können in `accepted` stehen.

Die Zahleneingabe prüft nur das Ergebnis. Wenn eine Begründung zum Lernziel gehört, verwende manuelle Bewertung oder trenne Ergebnis und Besprechung bewusst. Automatische Wertung darf keine angeblich geprüfte Begründung vortäuschen.

Für eine Auswahl, etwa „Liegt 398 + 207 näher bei 500 oder bei 600?“:

```json
"response": {
  "type": "choice",
  "options": ["Näher bei 500", "Näher bei 600"],
  "correct": [1]
}
```

`correct` enthält **nullbasierte** Optionsindizes: `[1]` meint die zweite Option. Bei genau einer richtigen Option ist nur eine Auswahl gleichzeitig möglich. Zwei bis sechs unterschiedliche Optionen sind erlaubt. Bei mehreren richtigen Optionen, etwa `"correct": [0, 2]`, kann das Team mehrere Antworten markieren. Als richtig zählt ausschließlich die exakte Menge, ohne Teilpunkte. Die Oberfläche weist auf Mehrfachauswahl hin. Vor „Antwort abgeben“ darf die Auswahl geändert werden; bloßes Antippen wertet noch nicht.

Formuliere sinnvolle, plausible Ablenkantworten ohne Tricks. Auswahlaufgaben nur einsetzen, wenn sie didaktisch passen oder ausdrücklich gewünscht sind. Nicht alle Aufgaben in Auswahlaufgaben umwandeln. `answer` und `explanation` bleiben auch bei automatischen Aufgaben Pflicht und müssen mit `accepted` bzw. `correct` übereinstimmen. Nach Freigabe der Lehrkräftehilfen im Menü kann die Lehrkraft bei Bedarf mit „Antwort anzeigen“ zur manuellen Bewertung wechseln.

## Arbeitsablauf für einen Agenten mit Dateizugriff

1. `README.md`, diesen Auftrag und einen vorhandenen Aufgabensatz lesen.
2. Nur den neuen Aufgabensatz als `content/<kennung>.json` erstellen. Bestehende Spielinhalte nicht ohne Auftrag überschreiben. Die gemeinsame Engine, Darstellung und Bedienlogik wiederverwenden.
3. Mit `node build.js content/<kennung>.json` die eigenständige Datei `spiele/<kennung>/index.html` bauen. `node build.js` baut alle Aufgabensätze. Die Root-Startseite wird aus allen vorhandenen Spielordnern aktualisiert. Kein `npm install` für den Build nötig. Neue Spiele nicht mehr als flache Dateien unter `spiele/` ablegen.
4. Mit `npm test` die Spielregeln prüfen. Datenvalidierung ist bereits Teil des Builds. Aufgaben zusätzlich fachlich überprüfen; die technische Validierung erkennt keine falsche Rechnung.
5. Bei Änderungen am Framework zusätzlich `tests/browser.cjs` ausführen. Neue Regeln brauchen passende Verhaltenstests. Eine reine Inhaltsänderung verlangt mindestens eine Sichtprüfung der längsten Frage, Antwort und Tabelle.
6. Eine lokal nutzbare HTML-Datei liefern, dazu den wiederverwendbaren JSON-Aufgabensatz. Testergebnisse wahrheitsgemäß nennen: ausgeführt, nicht ausgeführt und verbleibende Geräteprüfung unterscheiden.

## Arbeitsablauf für ein LLM ohne Werkzeuge

Ist kein Dateizugriff möglich, liefere den vollständigen validen JSON-Aufgabensatz. Die Lehrkraft fügt ihn in `Spiel-Erstellen.html` ein und lädt das fertige Spiel herunter. Alternativ kann ein Agent `node build.js` nutzen. Keine neue Engine aus dem Gedächtnis erfinden.

Wenn ausdrücklich eine fertige HTML-Datei verlangt wird und eine bereits gebaute Framework-HTML vollständig vorliegt, ersetze ausschließlich den Inhalt von `<script id="game-data" type="application/json">`. Ersetze darin jedes literale `<` durch `\u003c`, damit beispielsweise `</script>` die Einbettung nicht beendet. Alle anderen Teile unverändert übernehmen. Ohne vollständig vorliegende Vorlage keine angeblich framework-identische HTML behaupten; dann JSON liefern und die fehlende Vorlage benennen.

## Technische Leitplanken

Eine fertige Spiel-HTML enthält alles: CSS, klassische JavaScript-Skripte und JSON. Keine externen Fonts, Bibliotheken, Bilder, APIs, Module oder Netzabrufe. Zum Spielen ist kein Node.js erforderlich. Safari/WebKit, Firefox und Chromium sind die Zielbrowser unter iOS/iPadOS, Android, Windows und Linux.

Touch hat Vorrang: echte Buttons mit mindestens 52 CSS-Pixeln, kein Hover-Zwang, kein Drag-and-drop, kein Doppeltipp als Voraussetzung. Auf großen Displays große Schrift und eindeutige Textlabels; auf schmalen Displays darf nur das Brett horizontal scrollen. Browserzoom bleibt erlaubt. Modale Dialoge benötigen Fokusbegrenzung, Esc und Fokusrückgabe. Tastenkürzel A/R/F/H dürfen weder Eingaben in Textfeldern noch native Enter-/Leertastenbedienung stören. Wiederholte Tastendrücke und Mehrfachklicks dürfen keine doppelten Punkte auslösen.

Vollbild und lokales Speichern sind optionale Browserfähigkeiten mit Fehlerbehandlung. Bei nicht verfügbarem Speicher muss das Spiel weiterlaufen. Eine lokale HTML-Vorschau einer Dateien-App ist kein zugesicherter JavaScript-Browser; den tatsächlichen Öffnungsweg auf den Schulgeräten prüfen. Keine ungetestete pauschale Gerätefreigabe behaupten.

## Abnahme

- Ein bis fünf Themen mit je fünf Aufgaben vorhanden; Spaltenzahl und Spielende passen zur tatsächlichen Anzahl. Lösung beim Öffnen verborgen.
- Kein Lehrkräftehinweis ohne bewusstes Einblenden.
- Richtig erhöht genau einen Punktestand einmal; falsch zieht nichts ab.
- Zahlenfeld und Auswahl geben ohne vorheriges Aufdecken eine automatische Wertung ab. Leere bzw. unvollständige Eingaben sind nicht absendbar; die gewählte Antwort darf bis zur Abgabe geändert werden.
- Dezimalkomma/Punkt sowie Einzelauswahl/Mehrfachauswahl geprüft; richtige Antworten und hinterlegte Prüfkriterien stimmen überein.
- Richtig und falsch schließen die Karte sofort; keine Übernahme. Der nächste Teamzug beginnt automatisch und sichtbar.
- Schließen, Neuladen und Rückgängig umgehen die Reihenfolge nicht.
- Alle falsch, Gewinner und Gleichstand korrekt.
- Reset abbrechbar; Teamnamen bleiben erhalten.
- Touch, Tastatur, kleine Ansicht und lange Inhalte geprüft.
- Keine externen Requests oder unbehandelten Browserfehler.
