# Jeopardy & Quizduell für den Unterricht

Gemeinsam rätseln, Wissen wiederholen und eigene Fragen mitbringen: Wähle ein fertiges Spiel oder erstelle mit einer KI ein Quiz für deine Klasse. Gespielt wird direkt im Browser – am Touchdisplay, mit Beamer oder am Computer.

**[▶ Spiele öffnen](https://fishersteve.github.io/Jeopardy_fuer_den_Unterricht/)** · **[Eigenes Spiel erstellen](https://fishersteve.github.io/Jeopardy_fuer_den_Unterricht/Spiel-Erstellen.html)**

Zum Spielen brauchst du kein Konto und keine Installation.

## In drei Schritten losspielen

1. Öffne die **Spielübersicht** oben und wähle ein Spiel.
2. Lege die Teams fest: bei **Jeopardy im Menü**, bei **Quizduell auf dem Startbildschirm**.
3. Zeige das Spiel der Klasse und startet gemeinsam. Lösungen und Erklärungen erscheinen nach der Abgabe oder dem Aufdecken.

| | Jeopardy | Quizduell Olymp |
| --- | --- | --- |
| Wer spielt? | Zwei bis sechs Teams | Zwei Seiten: Klasse und Olymp, frei benennbar |
| Wie läuft es ab? | Das aktive Team wählt eine Punktekarte. Danach wechselt der Zug automatisch. | Beide Seiten beantworten dieselben Auswahlfragen. Danach folgt ein mündliches Finale. |
| Wie viele Fragen? | Ein bis fünf Themen mit je fünf Fragen | Sechs Runden mit je drei Fragen, anschließend Finalfragen |
| Wie wird geantwortet? | Mündlich, über ein Zahlenfeld oder durch Auswahl | In den Runden durch Auswahl, im Finale mündlich |
| Gibt es eine Zeitbegrenzung? | Auf Wunsch einschaltbar | Im Finale standardmäßig **5 Sekunden pro Frage**, einstellbar |

## Fertige Spiele entdecken

Alle Spiele findest du in der [Spielübersicht](https://fishersteve.github.io/Jeopardy_fuer_den_Unterricht/). Darunter sind:

| Spiel | Inhalt |
| --- | --- |
| **Quizduell · Mathematik bis Ende Klasse 8** | Realschule NRW: Zahlen, Terme, Gleichungen, Zuordnungen, Prozentrechnung, Geometrie und Zufall |
| **Quizduell · Englisch bis Ende Klasse 5** | Realschule NRW: Alltag, Schule, Familie, Freizeit, Wortschatz und grundlegende Grammatik |
| **Quizduell · Mathematik Klasse 8–13** | Ein Fragenvorrat bis zur Oberstufe, einschließlich Matrizen und Integralen |
| **Jeopardy · Mathematik Klasse 5** | Zahlen, Größen, Geometrie, Daten und Knobeln |
| **Jeopardy · Fächermix Klasse 6** | Deutschland, Englisch, Brüche, Ägypten und Pubertät |
| **Jeopardy · Mathematik Klasse 8 NRW** | Terme, Zuordnungen, Prozentrechnung, Geometrie und Zufall |
| **Jeopardy · Start Klasse 10** | Memes, Mediencheck, Mathematik, Natur und Weltwissen |
| **Jeopardy · Meme-Mix ab 14** | Memes, Gaming, Tiere, Weltraum und Kopfrätsel |
| **Jeopardy · Allgemeinwissen für Erwachsene** | Welt, Geschichte, Wissenschaft, Kultur und Alltag |
| **Jeopardy · Elektronik, 3. Lehrjahr** | Sicherheit, Schaltungen und Messtechnik |

Wähle die Inhalte passend zum Lernstand deiner Klasse. Das Mathematik-Quizduell **8–13 enthält auch Oberstufenstoff**. Das Englisch-Quiz für Ende Klasse 5 wählt grundlegende Inhalte aus dem gemeinsamen Lernbereich Klasse 5/6; die Reihenfolge kann je nach Schule abweichen.

## Ein eigenes Spiel erstellen

Du brauchst eine KI deiner Wahl, zum Beispiel ChatGPT, Claude oder Gemini, und unseren Spiel-Ersteller. Der Ablauf ist für beide Spielarten gleich.

### 1. Der KI die Vorlage und deinen Wunsch geben

Lade die Datei **[Framework-Prompt.md](Framework-Prompt.md)** herunter und füge sie deinem KI-Chat als Anhang hinzu. Alternativ kannst du ihren gesamten Text in den Chat kopieren. Die Vorlage beschreibt, wie die Aufgaben aufgebaut sein müssen.

Ergänze einen Auftrag wie diesen und passe Fach, Klasse und Themen an:

**Beispiel für Jeopardy**

> Erstelle mit der beigefügten Vorlage ein Jeopardy für Mathematik, Ende Klasse 8, Realschule NRW. Drei Themen: lineare Gleichungen, Prozentrechnung und Flächen. Je Thema fünf Aufgaben mit steigender Schwierigkeit. Verwende kurze Arbeitsaufträge, Zahlenfelder für eindeutige Rechenergebnisse und mündliche Aufgaben für Begründungen. Gib den vollständigen JSON-Aufgabensatz aus.

**Beispiel für Quizduell**

> Erstelle mit der beigefügten Vorlage ein Quizduell Olymp für Englisch, Ende Klasse 5, Realschule NRW. Nutze acht Kategorien mit je drei Auswahlfragen und 37 kurze mündliche Finalfragen. Inhalte: Schule, Familie, Freizeit, Alltag, Zahlen, einfache Dialoge und grundlegende Grammatik. Finalfragen sollen in fünf Sekunden beantwortbar sein. Teams: „Klasse“ und „Olymp“. Gib den vollständigen JSON-Aufgabensatz aus.

Nenne möglichst konkret, was ihr bereits behandelt habt und was noch nicht vorkommen soll. Bei Jeopardy sind ein bis fünf Themen möglich. Eine [ausführlichere Beispielvorlage für Mathematik Klasse 5](docs/Beispielbefüllung%20%E2%80%93%20Jeopardy%20Mathematik%20Klasse%205.md) hilft bei weiteren Wünschen.

### 2. Den Aufgabensatz übernehmen

Die KI liefert die Fragen und Lösungen als **JSON**. Das ist eine Textdatei mit deinen Spielinhalten. Kopiere den vollständigen Text über den Kopierknopf am Antwortblock oder lade die angebotene `.json`-Datei herunter.

### 3. Das fertige Spiel herunterladen

1. Öffne den **[Spiel-Ersteller](https://fishersteve.github.io/Jeopardy_fuer_den_Unterricht/Spiel-Erstellen.html)**.
2. Füge den kopierten Text ein oder wähle deine JSON-Datei aus.
3. Klicke auf **„Prüfen und Spiel erstellen“**.
4. Klicke auf **„Spiel herunterladen“**.

Du erhältst eine **HTML-Datei**, die das komplette Spiel enthält. Öffne sie im Browser und probiere einige Fragen aus. Prüfe dabei auch die Lösungen: Der Spiel-Ersteller kontrolliert das Dateiformat; die fachliche Prüfung bleibt bei dir.

### 4. Aufbewahren und im Unterricht einsetzen

Kopiere die fertige HTML-Datei auf das Unterrichtsgerät, einen USB-Stick oder in eure Dateiablage. Hebe auch die JSON-Datei auf: Zum Ändern einzelner Fragen gibst du sie später wieder an die KI und erstellst aus der überarbeiteten Fassung ein neues Spiel.

Der Spiel-Ersteller verarbeitet die eingefügten Inhalte auf deinem Gerät und lädt sie nicht auf einen Server hoch.

## Jeopardy spielen

Das hervorgehobene Team wählt eine Punktekarte. Bei **mündlichen Aufgaben** deckt die Spielleitung die Antwort auf und bewertet mit „Richtig“ oder „Falsch“. **Zahlen- und Auswahlaufgaben** prüft das Spiel beim Abgeben automatisch.

Eine richtige Antwort bringt den Kartenwert, eine falsche standardmäßig **0 Punkte**. Die Karte ist danach erledigt; das nächste Team ist dran. Es gibt keine Übernahme durch andere Teams. Im Ergebnisfenster seht ihr die Wertung und das nächste Team. Bei falschen Antworten bleiben Lösung und Erklärung sichtbar, bis ihr weiterklickt.

Die Teams wechseln automatisch der Reihe nach. Wenn alle Karten gespielt sind, erscheint das Endergebnis.

### Praktische Einstellungen im Menü

| Du möchtest … | So geht es |
| --- | --- |
| Teamnamen oder die Teamzahl ändern | Namen bearbeiten; vor der ersten Bewertung bis zu sechs Teams anlegen |
| Die Bedenkzeit begrenzen | „Timer einschalten“ und Zeiten je Punktewert anpassen |
| Bei falschen Antworten Punkte abziehen | „Punktabzug bei falscher Antwort“ vor der ersten Bewertung aktivieren; wahlweise bei 0 stoppen oder negative Punktestände erlauben |
| Lehrkräftehinweise sehen | „Lehrkräftehinweise freigeben“ aktivieren; danach bei Bedarf in der Frage öffnen |
| Eine versehentliche Wertung korrigieren | „Rückgängig“ nimmt die letzte Karte samt Punkten und Teamwechsel zurück |
| Eine neue Runde beginnen | „Spiel zurücksetzen“; Teamnamen und Einstellungen bleiben erhalten |
| Musik während der Fragen hören | „Musik während der Fragen“ aktivieren; Hinweise zur Musik stehen weiter unten |

Lehrkräftehinweise sind zunächst verborgen. Sie sind von den Erklärungen für die Klasse getrennt. Die Freigabe erlaubt bei Zahlen- und Auswahlaufgaben auch manuelles Aufdecken und Bewerten. Nach dem Neuladen ist sie wieder ausgeschaltet.

<details>
<summary>Mehr zum Jeopardy-Timer</summary>

Der Timer ist zunächst aus. Voreingestellt sind **30 / 45 / 60 / 90 / 120 Sekunden** für Karten mit 100 / 200 / 300 / 400 / 500 Punkten. Du kannst jede Zeit auf ganze **5–600 Sekunden** ändern; Änderungen gelten ab der nächsten Frage.

Standardmäßig wird eine Frage nach Zeitablauf automatisch als falsch gewertet. Lösung, Erklärung und das nächste Team erscheinen dann im Ergebnisfenster. Wenn du „Nach Zeitablauf automatisch falsch werten“ ausschaltest, erscheint nur „Zeit abgelaufen“ und ihr könnt noch abgeben oder bewerten.

Bei geöffneten Lehrkräftehinweisen und beim Wechsel in einen anderen Tab pausiert der Timer. Aufdecken, Abgeben oder Schließen beendet ihn. Beim erneuten Öffnen einer unbewerteten Karte startet die volle Zeit.

</details>

## Quizduell Olymp spielen

1. **Seiten benennen:** Tragt auf dem Startbildschirm die Namen ein und legt die Finalzeit fest.
2. **Kategorie wählen:** Olymp und Herausforderer wählen abwechselnd aus drei angebotenen Kategorien. Der Olymp beginnt.
3. **Getrennt antworten:** Der Olymp gibt seine Antwort zuerst über die Tasten **1–4** oder „Olymp: Touch-Eingabe“ ein. Dabei schaut die andere Seite weg. Danach wählt das Team seine Antwort und loggt sie ein.
4. **Gemeinsam auflösen:** Jede richtige Antwort gibt einen Punkt. Lösung und Erklärung bleiben bis „Nächste Frage“ stehen.
5. **Finale spielen:** Nach sechs Runden wird jeder gesammelte Punkt zu einer Finalfrage. Die Seite mit weniger Punkten beginnt; bei Gleichstand die Herausforderer.

Im Finale startet die Spielleitung jede Frage mit **„Frage starten“**. Die Antwort wird laut gegeben. Nach Zeitablauf oder „Antwort gegeben · aufdecken“ bewertet die Spielleitung, ob die rechtzeitig gegebene Antwort richtig war.

**Die Finalzeit beträgt standardmäßig 5 Sekunden je Frage.** Du kannst sie beim Spielstart und nochmals vor dem Finale auf ganze **5–600 Sekunden** einstellen. Beim Wechsel in einen anderen Tab pausiert die Zeit. Bei Gleichstand folgt eine Stichfrage, deren Lösung erst beim Aufdecken erscheint.

Der Tonschalter aktiviert auf Wunsch kurze Signale. Eine Musikdatei wird dafür nicht benötigt. „Neue Partie“ übernimmt die Namen und die eingestellte Finalzeit.

**Die laufende Quizduell-Partie wird nicht gespeichert.** Lass den Spieltab während der Partie geöffnet; Neuladen beginnt neu. Jeopardy merkt sich den Spielstand dagegen nach Möglichkeit im verwendeten Browser.

## Spiele mitnehmen und teilen

**Ohne Internet spielen:** Lade dein eigenes Spiel herunter oder [lade die Spielesammlung als ZIP herunter](https://github.com/FisherSteve/Jeopardy_fuer_den_Unterricht/archive/refs/heads/main.zip). Entpacke die Sammlung und öffne `index.html` im Hauptordner. Einzelne fertige Spiele findest du im Ordner `spiele`, jeweils als `index.html` im passenden Unterordner.

Zum Weitergeben reicht die fertige HTML-Datei. Sie funktioniert offline, wenn das Gerät lokale HTML-Dateien im Browser ausführt. Für selbst erstellte Spiele kannst du einen aussagekräftigen Dateinamen vergeben.

**Am iPad oder iPhone:** Die Dateien-App zeigt HTML-Dateien manchmal nur als Vorschau; dort funktionieren Spielknöpfe möglicherweise nicht. Nutze dann einen geeigneten Browser-Öffnungsweg oder eine schulische Webadresse. Teste das Öffnen einmal auf dem Unterrichtsgerät. Zum Laden einer Webadresse brauchst du eine Internetverbindung.

**Per Link teilen:** Du kannst die fertige HTML-Datei über eine geeignete schulische Webablage veröffentlichen. Eine weitere Möglichkeit ist [Netlify Drop](https://app.netlify.com/drop); die [Anleitung zum Hochladen](https://docs.netlify.com/deploy/create-deploys/) beschreibt den Ablauf. Für eine eigene GitHub-Pages-Kopie findest du Hinweise in der [technischen Anleitung](docs/TECHNIK.md).

<details>
<summary>Musik zu einem Jeopardy hinzufügen</summary>

Bei den Spielen auf unserer Spieleseite ist die Musik bereits verfügbar. Du schaltest sie im Menü ein. Sie startet beim Öffnen einer Frage und stoppt beim Aufdecken, Abgeben oder Schließen. Nach dem Neuladen ist sie wieder ausgeschaltet.

Bei einem selbst erstellten oder einzeln heruntergeladenen Spiel legst du eine MP3 mit dem genauen Namen **Jeopardy-theme-song.mp3** neben die HTML-Datei. Der Spiel-Ersteller lädt die Musik nicht mit herunter. Ohne MP3 funktioniert das Spiel ebenfalls.

Beim Verlassen des Tabs stoppt die Musik. Bei geöffneten Lehrkräftehinweisen pausiert sie und läuft danach weiter, solange noch Bedenkzeit bleibt und die Antwort nicht aufgedeckt wurde.

</details>

## Wenn etwas nicht klappt

| Situation | Das hilft |
| --- | --- |
| Der Spiel-Ersteller meldet einen Fehler | Kopiere die Meldung in denselben KI-Chat und bitte um einen korrigierten, vollständigen JSON-Aufgabensatz. Füge die neue Fassung ein und prüfe erneut. |
| GitHub zeigt nur Text oder Programmcode | Öffne die [Spieleseite](https://fishersteve.github.io/Jeopardy_fuer_den_Unterricht/). Alternativ: HTML-Datei herunterladen und im Browser öffnen. |
| Eine Frage oder Lösung passt nicht | Lass die KI den JSON-Aufgabensatz korrigieren und erstelle das Spiel erneut. |
| Das Spiel ist auf dem Display zu klein | Nutze die Vollbildfunktion, sofern verfügbar, oder ändere den Browserzoom. Querformat bietet mehr Überblick. |
| Jeopardy zeigt noch den alten Spielstand | Wähle im Menü „Spiel zurücksetzen“, bevor eine neue Gruppe beginnt. |

<details>
<summary>Bedienung mit der Tastatur</summary>

Mit **Tab** wechselst du zwischen Bedienelementen; **Enter oder Leertaste** betätigen einen ausgewählten Button. Alle Spielaktionen sind auch per Touch möglich.

Bei **Jeopardy**: **A** zeigt oder verbirgt die Antwort, sofern manuelle Bewertung freigegeben ist. Nach dem Aufdecken bewerten **R** und **F** richtig oder falsch. **H** öffnet freigegebene Lehrkräftehinweise, **Esc** schließt die Frage ohne Bewertung. Im Zahlenfeld funktionieren Ziffern, Komma, Punkt und Rücktaste; **Enter** gibt die Antwort ab.

Bei **Quizduell** gibt der Olymp seine Auswahl mit **1–4** ein. Im Finale bewerten **R** und **F** nach dem Aufdecken die mündliche Antwort.

</details>

<details>
<summary>Aufbau, Weiterentwicklung und Tests</summary>

Die [technische Anleitung](docs/TECHNIK.md) beschreibt den Aufbau, die Spielregeln im Detail, die Veröffentlichung und die Prüfungen. Die Spielinhalte liegen in `content/`, die gemeinsame Spieltechnik in `framework/`. Mit `node build.js` werden alle Spiele, der Spiel-Ersteller und die Startseite aktualisiert.

Für beide Spielarten gilt: Neue Aufgaben werden als JSON erstellt. Die [Framework-Prompt](Framework-Prompt.md) enthält die Vorgaben, auch für zufällig verteilte richtige Antwortpositionen und die lesbare Darstellung von Matrizen und Integralen im Quizduell.

</details>
