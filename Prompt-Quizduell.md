# Quizduell Olymp: Aufgaben erstellen

Erstelle fachlich korrekte, altersgerechte Aufgaben für den vorhandenen Spiel-Ersteller. Diese Vorlage ist vollständig; weitere Prompt-Dateien sind nicht nötig. **Liefere ausschließlich einen vollständigen JSON-Aufgabensatz**, als Datei oder JSON-Codeblock. Die Lehrkraft lädt ihn in `Spiel-Erstellen.html` und erhält das fertige Spiel. Keine neue Spieloberfläche oder Engine programmieren.

## Unterrichtsauftrag und Umfang

Übernimm die Angaben zu Fach, Klasse, Schulform, Bundesland, Lernstand/Lesekompetenz, behandelten und ausgeschlossenen Inhalten, Lernziel, Kategorien, Titel und Namen der beiden Seiten. Fehlen Fach, Zielgruppe oder Lernziel und sind sie nicht erschließbar, frage gezielt nach. Nebensächliches sinnvoll annehmen.

- **8–20 Kategorien mit jeweils genau 3 Auswahlfragen**, Standard: 8 Kategorien. Pro Frage genau vier unterschiedliche Optionen und genau eine richtige Antwort.
- Zusätzlich **37–200 unterschiedliche kurze mündliche Finalfragen**, Standard: 37. Die Zahl reicht für bis zu 18 Finalfragen je Seite und eine Stichfrage. Finalfragen ohne Antwortauswahl.
- Genau zwei Seiten, standardmäßig „Kurs“ und „Olymp“. Im Array `teams` stehen zuerst die Herausforderer, dann der Olymp.
- Gespielt werden sechs Runden aus sechs gewählten Kategorien. Olymp und Team wählen abwechselnd, der Olymp beginnt. Beide beantworten dieselben Fragen, jede richtige Antwort gibt einen Punkt, falsche null. Jeder Punkt wird zu einer Finalfrage.
- Im Finale beginnt die Seite mit weniger Punkten, bei Gleichstand die Herausforderer. Die Spielleitung bewertet die rechtzeitig gegebene mündliche Antwort nach dem Aufdecken. Ein uneinholbarer Vorsprung beendet das Finale; bei Gleichstand folgt eine Stichfrage. Lösungen und Erklärungen bleiben bis Abgabe/Aufdecken verborgen, auch bei der Stichfrage.
- **Finalzeit standardmäßig 5 Sekunden**, im Spiel vor Start bzw. vor dem Finale auf ganze 5–600 Sekunden einstellbar. Finalfragen müssen ohne andere Vorgabe in fünf Sekunden beantwortbar sein. Lange Rechnungen gehören in die Hauptrunde. Keine Timerfelder erzeugen.

## Fachliche Qualität

Kurze, eindeutige Arbeitsaufträge, passende Sprache und abwechslungsreiche Kompetenzen innerhalb des behandelten Stoffes. Schwierigkeit entsteht durch Denken, nicht durch lange Texte. Keine Trickfragen, persönlichen Offenlegungen oder pauschalen Annahmen über die Schulform. Bei mündlichen Antworten zulässige Alternativen und nötige Bewertungskriterien nennen.

`answer` enthält die kurze Lösung; bei Auswahl **exakt den Text der richtigen Option**. `explanation` erklärt sie für Lernende in gewöhnlich zwei bis vier gut vorlesbaren Sätzen. Keine internen Lehrkraftanweisungen darin. Jede Rechnung, Einheit, Voraussetzung und alternative Deutung prüfen. Curriculare oder zeitabhängige Aussagen bei Bedarf mit verlässlichen Quellen recherchieren; Quellen nötigenfalls getrennt im Chat nennen, niemals in zusätzlichen JSON-Feldern oder separaten Recherchedateien im Repository. Ohne Recherchezugriff keine Prüfung behaupten.

**Keine Lösungsverräter** in Frage, Kategoriename oder anderen vorab sichtbaren Inhalten. Haupt- und Finalfragen dürfen einander keine Lösungen vorwegnehmen. Sortierlisten mischen. Nötige Angaben zum selbstständigen Lösen sind erlaubt. Keine Aufgaben mit fehlenden Bildern, Tabellen, Dateien oder Internetseiten; das Format unterstützt Text und die unten beschriebenen Mathefelder.

**Pflichtprüfung gegen Antwort-Leaks:** Lies vor der Ausgabe jede Aufgabe aus Sicht der Spielenden, ohne Lösung und Erklärung. Weder Fragetext, Überschrift, Beispiel, Tabelle, sichtbare Matheangabe noch eine andere Frage darf die gesuchte Antwort bereits nennen oder eine Option als richtig erkennen lassen. Auch indirekte Hinweise (auffälliger Wortlaut, grammatische Passung, Hervorhebung) entfernen. Reguläre Antwortoptionen und notwendige Rechenangaben bleiben erlaubt. Lösungen ausschließlich in den dafür vorgesehenen, erst nach Abgabe/Aufdecken sichtbaren Feldern hinterlegen.

## Antwortpositionen zufällig verteilen

Mische die vier Optionen jeder Auswahlfrage zufällig. Die richtigen Positionen sollen über alle Hauptrundenfragen möglichst gleich häufig vorkommen (Häufigkeitsunterschied höchstens eins); ordne diese Positionen zufällig zu. **Keine bevorzugten Buchstaben, kein festes A–B–C–D-Muster.**

Nach jedem Mischen `response.correct` neu zuordnen und mit `answer`/`explanation` abgleichen. Keine Buchstabenpräfixe, positionsabhängigen Texte wie „A und C“/„alle obigen“ oder Lösungssignale durch Länge, Grammatik und Hervorhebung. Plausible Ablenkantworten verwenden. Die Engine mischt bei neuer Partie bzw. Neuladen zusätzlich und erhält die richtige Zuordnung; diese Laufzeitfunktion beibehalten.

## JSON-Format

Strukturbeispiel mit nur einer Kategorie/Frage und einer Finalfrage; **vor Ausgabe auf den vollständigen Umfang ergänzen**:

```json
{
  "schemaVersion": 1,
  "gameType": "quizduell",
  "id": "quizduell-mathe-meine-klasse",
  "title": "Quizduell Olymp · Mathematik",
  "teams": ["Kurs", "Olymp"],
  "categories": [{
    "title": "Prozentrechnung",
    "questions": [{
      "id": "prozent-1",
      "question": "Wie viel sind 15 % von 240?",
      "answer": "36",
      "explanation": "10 % sind 24 und 5 % sind 12. Zusammen ergibt das 36.",
      "response": {"type": "choice", "options": ["30", "40", "36", "24"], "correct": [2]}
    }]
  }],
  "finalQuestions": [{
    "id": "finale-1",
    "question": "Wie groß ist 7 · 8?",
    "answer": "56",
    "explanation": "7 · 8 = 56."
  }]
}
```

- Oberste Felder ausschließlich `schemaVersion`, `gameType`, `id`, `title`, `teams`, `categories`, `finalQuestions`. `schemaVersion: 1` und `gameType: "quizduell"` sind Pflicht.
- `id`: höchstens 80 Zeichen, nur `a–z`, `0–9`, Bindestriche. Fragen-IDs über Haupt- und Finalfragen hinweg eindeutig, keine reservierten Namen wie `constructor`.
- Kategorien enthalten ausschließlich `title` und `questions`. Fragenfelder: `id`, `question`, `answer`, `explanation`; optional `level` (Lernstufe), `questionMath`, `answerMath`; **nur in der Hauptrunde** zusätzlich das Pflichtfeld `response`.
- `response.type`: `"choice"`; `options`: vier unterschiedliche nichtleere Strings; `correct`: genau ein **nullbasierter** Index von 0 bis 3. `[2]` bedeutet dritte Option. `answer` muss exakt `options[correct[0]]` entsprechen.
- Textgrenzen: Titel 100, Kategoriename 90, Teamname 40, Frage 1600, Antwort 1000, Erklärung 2000, Option 300 und `level` 80 Zeichen. Meist deutlich kürzer schreiben.
- Alle Inhaltsstrings als Text ohne Markdown, HTML oder TeX; JSON-Zeilenumbrüche als `\n`. Keine Kommentare, Platzhalter oder ausgelassenen Aufgaben. Keine `rules`, `points`, `teacherNote`, `table`, `image` oder sonstigen Zusatzfelder.

## Matrizen und Integrale lesbar darstellen

Verwende `questionMath` für mathematische Angaben, `answerMath` für erst nach Abgabe/Aufdecken sichtbare mathematische Lösungen. `answer` und `explanation` bleiben Pflicht. **Niemals die Lösung in `questionMath` eintragen.** Die Engine setzt diese Strukturen offline als MathML; keine externen Renderer.

Matrix: keine Textnotation wie `[[1,2],[3,4]]` in der Frage. Frage beispielsweise „Was ist die Determinante dieser Matrix?“ und ergänze:

```json
"questionMath": {"type": "matrix", "rows": [["1", "2"], ["3", "4"]]}
```

Eine bis vier Zeilen und Spalten, überall gleich viele Zellen; alle Zellen nichtleere Strings mit höchstens 80 Zeichen.

Integral: keine zusammengeschobene Textnotation. Frage beispielsweise „Berechne das bestimmte Integral.“ und ergänze:

```json
"questionMath": {"type": "integral", "lower": "0", "upper": "2", "integrand": "x", "variable": "x"}
```

`integrand` als nichtleerer Text; `variable` genau ein Buchstabe `a–z` oder `A–Z`. Grenzen `lower`/`upper` entweder beide als nichtleere Texte oder beide weglassen. Alle Teiltexte höchstens 80 Zeichen. Einfache Unicode-Ausdrücke wie `x²` sind erlaubt, HTML/TeX und zusätzliche Mathefelder nicht. Kompliziertere Formeln auf die unterstützte Darstellung zuschneiden.

## Vor Ausgabe prüfen

Kategorienzahl, drei Auswahlfragen je Kategorie, mindestens 37 Finalfragen, eindeutige IDs, Pflichtfelder, Fachlichkeit, Lernstand und realistische Finalzeit prüfen. Keine Wiederholungen oder Lösungsverräter. Antwortpositionen zufällig und ausgeglichen; richtige Option, Index und Erklärung stimmen überein. Vollständiges JSON liefern, keine Beispielauszüge. Änderungen später wieder am Aufgabensatz durchführen.

**Nur bei Arbeit im Repository:** Neue Inhalte unter `content/<kennung>.json` anlegen, bestehende Inhalte nur im Auftrag ändern. `node build.js` baut die Spiele unter `spiele/<kennung>/index.html`, den Ersteller und die Startseite; kein `npm install` erforderlich. `npm test` ausführen und lange Fragen/Antworten/Mathefelder im Browser prüfen. Bei ausdrücklich beauftragten Framework-Änderungen die gemeinsame Technik verwenden, alle Spiele neu bauen und die verfügbaren Browserprüfungen ausführen. Fertige Spiele bleiben offline ohne externe Abhängigkeiten; Touch/Tastatur, Fokus und reduzierte Bewegung erhalten. Geräteprüfungen und nicht ausgeführte Tests ehrlich benennen. Entwicklungsdetails stehen in `docs/TECHNIK.md`; zur reinen JSON-Erstellung ist diese Datei nicht nötig.
