# Jeopardy: Aufgaben erstellen

Erstelle fachlich korrekte, altersgerechte Aufgaben für den vorhandenen Spiel-Ersteller. Diese Vorlage ist vollständig; weitere Prompt-Dateien sind nicht nötig. **Liefere ausschließlich einen vollständigen JSON-Aufgabensatz**, als Datei oder JSON-Codeblock. Die Lehrkraft lädt ihn in `Spiel-Erstellen.html` und erhält das fertige Spiel. Keine neue Spieloberfläche oder Engine programmieren.

## Unterrichtsauftrag

Übernimm die Angaben der Lehrkraft zu Fach, Klasse, Schulform, Bundesland, Lernstand/Lesekompetenz, behandelten und ausgeschlossenen Inhalten, Lernziel, Themen, Titel, Teamnamen und gewünschten Antwortformaten. Fehlen Fach, Zielgruppe oder Lernziel und sind sie nicht erschließbar, frage gezielt nach. Nebensächliches sinnvoll annehmen. Standard: zwei Teams „Team 1“ und „Team 2“, kein Punktabzug, didaktisch sinnvoller Mix aus mündlichen Aufgaben und Zahleneingaben; Auswahl nur auf Wunsch oder bei didaktischer Eignung.

## Umfang und Qualität

- **Ein bis fünf Kategorien mit jeweils genau fünf Aufgaben**, in der Reihenfolge 100, 200, 300, 400, 500 Punkte. Eine kurze Themenliste nicht auffüllen. Bei mehr als fünf gewünschten Themen eine Auswahl oder Zusammenfassung abstimmen.
- Steigere die Schwierigkeit: 100 = erkennen/wiedergeben; 200 = Grundwissen anwenden; 300 = Zusammenhänge; 400 = Strategie/begründen; 500 = Transfer/mehrere Schritte. Alles innerhalb des behandelten Stoffes. Schwierigkeit entsteht durch Denken, nicht durch unnötig lange Texte oder große Zahlen.
- Kurze, eindeutige Arbeitsaufträge; passende Sprache ohne pauschale Annahmen über die Schulform. Keine Trickfragen oder persönlichen Offenlegungen. Bei offenen Fragen akzeptierte Alternativen und Bewertungskriterien nennen.
- `answer` enthält die kurze Lösung. `explanation` erklärt sie für Lernende in gewöhnlich zwei bis vier gut vorlesbaren Sätzen. Interne didaktische Hinweise gehören ausschließlich in das optionale `teacherNote`.
- Jede Rechnung, Einheit, Voraussetzung und alternative Deutung prüfen. Bei curricularen oder zeitabhängigen Aussagen nötige Recherche mit verlässlichen Quellen durchführen; Quellen bei Bedarf getrennt im Chat nennen, niemals als zusätzliche JSON-Felder oder separate Recherchedateien im Repository. Ohne Recherchezugriff keine Prüfung behaupten.
- **Keine Lösungsverräter** in Frage, Überschrift, Tabelle, anderen Karten oder vorab sichtbaren Inhalten. Sortierlisten mischen. Nötige Angaben zum selbstständigen Lösen sind erlaubt. Erforderliche Tabellen tatsächlich mitliefern; keine Verweise auf fehlende Bilder, Dateien oder Internetseiten.

**Pflichtprüfung gegen Antwort-Leaks:** Lies vor der Ausgabe jede Aufgabe aus Sicht der Spielenden, ohne Lösung und Erklärung. Weder Fragetext, Überschrift, Beispiel, Tabelle, sichtbare Matheangabe noch eine andere Frage darf die gesuchte Antwort bereits nennen oder eine Option als richtig erkennen lassen. Auch indirekte Hinweise (auffälliger Wortlaut, grammatische Passung, Hervorhebung) entfernen. Reguläre Antwortoptionen und notwendige Rechenangaben bleiben erlaubt. Lösungen ausschließlich in den dafür vorgesehenen, erst nach Abgabe/Aufdecken sichtbaren Feldern hinterlegen.

## Antwortpositionen zufällig verteilen

Mische die Optionen jeder Auswahlfrage zufällig. Bei Einzelauswahl mit gleicher Optionszahl sollen die richtigen Positionen über den Aufgabensatz möglichst gleich häufig vorkommen (Häufigkeitsunterschied höchstens eins); ordne diese Positionen zufällig zu. **Keine bevorzugten Buchstaben, kein festes A–B–C–D-Muster.** Bei Mehrfachauswahl die richtigen Positionskombinationen variieren.

Nach jedem Mischen `response.correct` neu zuordnen und mit `answer`/`explanation` abgleichen. Keine Buchstabenpräfixe, positionsabhängigen Texte wie „A und C“/„alle obigen“ oder Lösungssignale durch Länge, Grammatik und Hervorhebung. Plausible Ablenkantworten verwenden. Die Engine mischt bei neuer Partie bzw. Neuladen zusätzlich und erhält die richtige Zuordnung; diese Laufzeitfunktion beibehalten.

## JSON-Format

Strukturbeispiel mit nur einer Aufgabe; **vor Ausgabe auf fünf Aufgaben je gewünschter Kategorie ergänzen**:

```json
{
  "schemaVersion": 1,
  "gameType": "jeopardy",
  "id": "mathematik-klasse-5",
  "title": "Jeopardy · Mathematik · Klasse 5",
  "teams": ["Team 1", "Team 2"],
  "rules": {"subtractOnWrong": false, "allowNegativeScores": false, "takeover": false},
  "categories": [{
    "title": "Zahlen und Rechnen",
    "questions": [{
      "id": "zahlen-100",
      "points": 100,
      "question": "Wie viel ist 347 + 125?",
      "answer": "472",
      "explanation": "347 + 100 = 447. Dazu kommen 25: Das ergibt 472.",
      "response": {"type": "number", "accepted": ["472"], "unit": ""}
    }]
  }]
}
```

- `schemaVersion`: 1; `gameType`: `"jeopardy"` (bei alten Datensätzen auch weglassbar).
- `id`: höchstens 80 Zeichen, nur `a–z`, `0–9`, Bindestriche. Fragen-IDs im gesamten Satz eindeutig, keine reservierten Namen wie `constructor`.
- Textgrenzen: Titel 100, Kategoriename 90, Teamname 40, Frage 1600, Antwort 1000, Erklärung und Lehrkräftehinweis je 2000 Zeichen. Meist deutlich kürzer schreiben. Zwei bis sechs Teamnamen.
- Alle Inhaltsstrings als Text, ohne Markdown, HTML oder TeX. JSON-Zeilenumbrüche als `\n`; keine Kommentare, Platzhalter oder ausgelassenen Aufgaben.
- Fragenfelder: `id`, `points`, `question`, `answer`, `explanation`; optional `teacherNote`, `response`, `table`. Keine zusätzlichen Darstellungs-, Timer- oder Musikfelder erfinden.

### Antwortformat je Aufgabe

**Mündlich:** `response` weglassen oder `{"type":"manual"}`. Geeignet für Begründungen, offene Lösungswege, Zeichnungen, Brüche/Uhrzeiten und mehrere Teilergebnisse. Die Lehrkraft deckt auf und bewertet.

**Zahl:** `"response": {"type":"number", "accepted":["2.60"], "unit":"€"}`. Ein bis 20 akzeptierte Dezimalzahlen als Strings, jeweils höchstens 40 Zeichen; optionale Einheit höchstens 30 Zeichen. Komma/Punkt, Vorzeichen und führende bzw. nachgestellte Nullen werden normalisiert. Keine Bruchstriche, Tausendertrennzeichen, Exponentialschreibweisen oder Einheiten in `accepted`. Rundung ausdrücklich verlangen und das gerundete Ergebnis hinterlegen; es gibt keine implizite Toleranz. Das Zahlenfeld prüft nur das Ergebnis, keine Begründung.

**Auswahl:** Beispiel für „Liegt 398 + 207 näher bei 500 oder bei 600?“:

```json
"response": {
  "type": "choice",
  "options": ["Näher bei 500", "Näher bei 600"],
  "correct": [1]
}
```

Zwei bis sechs unterschiedliche Optionen mit jeweils höchstens 300 Zeichen. `correct` enthält eindeutige **nullbasierte** Indizes: `[1]` bezeichnet die zweite Option. Mehrfachauswahl ist mit mehreren Indizes möglich; nur die exakt richtige Menge zählt, ohne Teilpunkte. `answer` und `explanation` bleiben Pflicht und müssen mit den Prüfkriterien übereinstimmen. Wünsche wie „keine Auswahlaufgaben“ einhalten.

### Optionale Tabelle

```json
"table": {
  "headers": ["Tag", "Altpapier"],
  "rows": [["Montag", "8 kg"], ["Dienstag", "11 kg"]]
}
```

Eine bis sechs Spalten, eine bis zwölf Datenzeilen; gleich viele Zellen pro Zeile wie Überschriften, alle Zellen als Strings.

## Bestehende Spielregeln berücksichtigen

Richtig gibt den Kartenwert, falsch standardmäßig 0. Nur auf ausdrücklichen Wunsch `subtractOnWrong: true`; Abzug dann höchstens bis 0, außer `allowNegativeScores: true`. `takeover` bleibt immer `false`. Jede Bewertung erledigt die Karte und wechselt automatisch zum nächsten Team. Lösung und Erklärung bleiben bei falscher Antwort bis zur Bestätigung sichtbar; `teacherNote` bleibt ohne Freigabe verborgen. Automatische Aufgaben werden bei Abgabe geprüft, ohne vorherige Lösung. Rückgängig, Reset, Touch/Tastatur, Fokus und reduzierte Bewegung sind bereits implementiert.

Der optionale Fragentimer ist zunächst aus, im Menü auf 5–600 Sekunden einstellbar (Vorgaben nach Punktewert: 30/45/60/90/120). Optionale Musik und alle Oberflächeneinstellungen werden vom Spiel verwaltet. Dafür keine Inhaltsfelder oder neuen Funktionen erzeugen. Die fertige HTML funktioniert offline; nur freiwillige Musik nutzt eine separate MP3.

## Vor Ausgabe prüfen

Kategorienzahl und fünf aufsteigende Punktewerte, eindeutige IDs, vollständige Pflichtfelder, Fachlichkeit, Lernstand, fehlende Lösungsverräter, zufällige/ausgeglichene Antwortpositionen und korrekte Lösungszuordnung überprüfen. Vollständiges JSON liefern, keine Beispielauszüge. Änderungen später wieder am Aufgabensatz durchführen.

**Nur bei Arbeit im Repository:** Neue Inhalte unter `content/<kennung>.json` anlegen, bestehende Inhalte nur im Auftrag ändern. `node build.js` baut die Spiele unter `spiele/<kennung>/index.html`, den Ersteller und die Startseite; kein `npm install` erforderlich. `npm test` ausführen und lange Fragen/Antworten/Tabellen im Browser prüfen. Bei ausdrücklich beauftragten Framework-Änderungen die gemeinsame Technik verwenden, alle Spiele neu bauen und die verfügbaren Browserprüfungen ausführen. Keine externen Abhängigkeiten in fertige Spiele aufnehmen; Geräteprüfungen und nicht ausgeführte Tests ehrlich benennen. Entwicklungsdetails stehen in `docs/TECHNIK.md`; zur reinen JSON-Erstellung ist diese Datei nicht nötig.
