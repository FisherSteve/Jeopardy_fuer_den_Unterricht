# Jeopardy für den Unterricht

Ein Lernspiel für Touchdisplays, Tablets und Computer. Eigene Aufgaben kannst du mit **ChatGPT, Claude, Gemini oder einer anderen KI** erstellen. Programmieren musst du dafür nicht.

Du brauchst einen Browser. Für neue Aufgaben brauchst du zusätzlich Zugang zu einer KI. Die fertigen Spiele kommen ohne Internet aus, wenn das Gerät lokale HTML-Dateien im Browser ausführen kann.

## Ich möchte erst einmal spielen

1. Lade den gesamten Projektordner herunter, zum Beispiel als ZIP von GitHub, und entpacke ihn.
2. Öffne den Ordner **spiele**.
3. Öffne eines der Beispiele im Browser:
   - [Mathematik, Klasse 5](spiele/mathematik-klasse-5.html)
   - [Fächermix, Klasse 6](spiele/faechermix-klasse-6.html)
4. Öffne im Spiel **Menü**. Dort kannst du die Teamnamen ändern und vor der ersten Bewertung weitere Teams hinzufügen. Zwei Teams sind voreingestellt; bis zu sechs sind möglich.
5. Jetzt kann das hervorgehobene Team eine Punktekarte wählen.

Falls GitHub beim Anklicken einer HTML-Datei nur Quelltext zeigt: Die Datei herunterladen und anschließend auf dem Gerät öffnen. Die Codeansicht auf GitHub ist noch nicht das Spiel.

## So läuft eine Runde ab

- **Team 1 beginnt.** Danach folgen Team 2, Team 3 usw. Die Reihenfolge läuft automatisch im Kreis.
- Das aktive Team wählt eine Karte und beantwortet die Frage.
- **Mündliche Aufgabe:** Die Lehrkraft drückt „Antwort anzeigen“ und bewertet mit „Richtig“ oder „Falsch“.
- **Zahlenaufgabe:** Das Team tippt seine Antwort auf dem Ziffernfeld ein und drückt „Antwort abgeben“.
- **Auswahlaufgabe:** Das Team markiert die passende Antwort und drückt „Antwort abgeben“. Falls mehrere Antworten möglich sind, steht dies dabei.
- **Richtig gibt Punkte. Falsch gibt keine Minuspunkte.** In beiden Fällen ist die Karte anschließend erledigt. Es gibt keine Übernahme durch ein anderes Team.
- Danach ist automatisch das nächste Team mit einer neuen Karte dran. Eine kurze Animation zeigt den Wechsel.

Ein Spiel hat **ein bis fünf Themen mit jeweils fünf Karten**, also 5 bis 25 Fragen. Sobald alle Karten erledigt sind, erscheint das Ergebnis.

## Ich möchte mein eigenes Spiel erstellen

### Schritt 1: Der KI den Auftrag geben

Öffne ChatGPT, Claude, Gemini oder eine andere KI. Lade die Datei [Framework-Prompt.md](Framework-Prompt.md) in den Chat hoch. Falls Hochladen nicht möglich ist, öffne die Datei und kopiere ihren gesamten Text in den Chat.

Schreibe darunter zum Beispiel:

> Erstelle einen vollständigen JSON-Aufgabensatz für den mitgelieferten Jeopardy-Spiel-Ersteller. Gib nur den JSON-Aufgabensatz aus und programmiere kein neues Spiel.
>
> Fach: Mathematik. Klasse: 5. Schulform: Förderschule, Schwerpunkt Lernen. Ziel: Wiederholung von Grundschulwissen. Kurze Sätze und gut verständliche Aufgaben.
>
> Drei Themen: Zahlen und Rechnen; Geld; Formen. Je Thema fünf Aufgaben mit 100 bis 500 Punkten.
>
> Zwei Teams zum Start. Eindeutige Rechenergebnisse mit Zahlenfeld, passende Vergleichsaufgaben mit Antwortauswahl. Begründungen mündlich bewerten. Keine Minuspunkte, keine Übernahme.

Ersetze Fach, Klasse, Themen und Wünsche durch deine eigenen Angaben. Gib höchstens fünf Themen an. Du kannst auch ausdrücklich schreiben: **„Keine Auswahlaufgaben“** oder **„Nur mündliche Aufgaben“**.

Für eine ausführlichere Mathematik-Vorlage gibt es den [Inhaltsauftrag für Klasse 5](Beispielbefüllung%20%E2%80%93%20Jeopardy%20Mathematik%20Klasse%205.md).

### Schritt 2: Die KI-Antwort kopieren

Die KI liefert einen längeren Text mit geschweiften Klammern, Fragen und Lösungen. Das ist der **JSON-Aufgabensatz**: Er enthält die Spielinhalte in einem festgelegten Format. Du musst dieses Format nicht selbst schreiben können.

Kopiere den gesamten JSON-Text. Viele Chatoberflächen bieten dafür einen Kopierknopf am Codeblock. Wenn die KI eine `.json`-Datei bereitstellt, kannst du stattdessen diese herunterladen.

### Schritt 3: Das Spiel bauen lassen

1. Öffne die heruntergeladene Datei **[Spiel-Erstellen.html](Spiel-Erstellen.html)** im Browser.
2. Füge den kopierten Text in das große Feld ein. Alternativ wählst du die JSON-Datei aus.
3. Drücke **„Prüfen und Spiel erstellen“**.
4. Drücke anschließend **„Spiel herunterladen“**.

Du erhältst eine fertige `.html`-Datei. Sie enthält das Spiel und alle Aufgaben. Zum Spielen musst du keine weiteren Dateien mitgeben.

**Es erscheint eine Fehlermeldung?** Kopiere die Meldung zurück in deinen KI-Chat und bitte um einen korrigierten, vollständigen Aufgabensatz. Ersetze danach den Text im Spiel-Ersteller und versuche es erneut.

Die technische Prüfung erkennt beispielsweise fehlende Fragen oder ungültige Antwortoptionen. Ob eine Aufgabe fachlich richtig und für deine Klasse geeignet ist, musst du zusätzlich prüfen.

### Schritt 4: Kurz ausprobieren und mitnehmen

Öffne dein fertiges Spiel und prüfe vor dem Unterricht einige Fragen, die Lösungen und das Zahlenfeld. Kopiere dann **die fertige HTML-Datei** auf das Schulgerät, einen USB-Stick oder in eure übliche Dateiablage.

Hebe auch den JSON-Aufgabensatz auf. Wenn du später Fragen ändern möchtest, gib ihn wieder an die KI und baue aus der neuen Fassung erneut ein Spiel. Du musst nicht von vorne anfangen.

## Nützliche Einstellungen

| Wunsch | So geht es |
| --- | --- |
| Mehr Teams | Menü → „Team hinzufügen“, vor der ersten Bewertung |
| Teamnamen ändern | Menü → Namen bearbeiten |
| Lehrkräftehinweise nutzen | Menü → „Lehrkräftehinweise freigeben“ einschalten |
| Falschen Klick korrigieren | „Rückgängig“ nimmt die letzte Karte, ihre Wertung und den Teamwechsel zurück |
| Neu anfangen | Menü → „Spiel zurücksetzen“; Teamnamen und Teamzahl bleiben erhalten |
| Größere Bildschirmfläche | „Vollbild“, sofern der Browser diese Funktion anbietet |

**Lehrkräftehinweise sind zunächst vollständig ausgeblendet**, auch ihr Button. Nach der Freigabe im Menü lassen sie sich in einer Frage gezielt einblenden. Bei Zahlen- und Auswahlaufgaben erlaubt diese Freigabe auch das manuelle Aufdecken und Bewerten. Nach dem Neuladen ist die Freigabe wieder aus. Die Menüeinstellung ist keine Passwortsperre; die Lehrkraft bedient das Menü.

Das Spiel merkt sich den Spielstand nach Möglichkeit im verwendeten Browser. Wenn Speichern nicht möglich ist, zeigt es einen Hinweis und bleibt spielbar. Für eine neue Lerngruppe das Spiel zurücksetzen. Auf gemeinsam genutzten Geräten am besten neutrale Teamnamen verwenden.

## Mit Tastatur spielen

- **Tab** wechselt zum nächsten Bedienelement; **Enter oder Leertaste** betätigen einen gewählten Button.
- **A** zeigt die Antwort oder blendet sie aus, sofern manuelle Bewertung freigegeben ist.
- **R** bewertet richtig, **F** falsch — nach dem Aufdecken der Antwort.
- **H** öffnet oder schließt freigegebene Lehrkräftehinweise.
- **Esc** schließt eine Frage ohne Bewertung.
- Im Zahlenfeld funktionieren auch **Ziffern, Komma, Punkt und Rücktaste**. Wenn das Zahlenfeld fokussiert ist, gibt **Enter** die Antwort ab.

Alle Spielaktionen sind auch per Touch möglich.

## Auf welchen Geräten geht das?

Die Oberfläche ist für **Promethean-Displays und andere Touchscreens** sowie Safari/WebKit-, Firefox- und Chromium-Browser ausgelegt. Dazu gehören beispielsweise Chrome und Edge. Querformat bietet den besten Überblick. Auf einem schmalen Bildschirm lässt sich das Brett seitlich verschieben.

Auf Windows- und Linux-Computern kannst du die fertige HTML-Datei in einem Browser öffnen. Auch auf Android hängt der Öffnungsweg von der verwendeten Datei-App und dem Browser ab.

**Bei iPad und iPhone:** Die Dateien-App zeigt HTML manchmal nur als Vorschau. In einer Vorschau laufen die Spielknöpfe möglicherweise nicht. Dann braucht ihr einen geeigneten Browser-Öffnungsweg oder stellt dieselbe HTML-Datei über eine schulische Webadresse bereit. Beim Laden über eine Webadresse wird eine Verbindung benötigt. Teste diesen Schritt einmal auf eurem tatsächlichen Gerät.

Der Spiel-Ersteller verarbeitet eingefügte Aufgaben lokal. Er lädt keine Inhalte zu einem Server hoch. Für die Erstellung neuer Aufgaben mit einer KI gelten die Bedingungen des jeweiligen KI-Dienstes.

## Für Menschen, die das Framework weiterentwickeln möchten

Die gemeinsame Spieltechnik steht in `framework/`, die wiederverwendbaren Inhalte in `content/`. [TECHNIK.md](TECHNIK.md) beschreibt Aufbau, Build und Tests. [PRUEFPROTOKOLL.md](PRUEFPROTOKOLL.md) dokumentiert die ausgeführten Prüfungen und die noch offenen Gerätetests.

Die ursprünglichen Dateien im Hauptordner sind als Vergleich erhalten. Für neue Spiele bitte die **Framework-Prompt** und den **Spiel-Ersteller** verwenden.
