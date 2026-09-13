# Jeopardy für den Unterricht

Ein Lernspiel für Touchdisplays, Tablets und Computer. Eigene Aufgaben kannst du mit **ChatGPT, Claude, Gemini oder einer anderen KI** erstellen. Programmieren musst du dafür nicht.

**[Jetzt spielen](https://fishersteve.github.io/Jeopardy_fuer_den_Unterricht/) · [Eigenes Spiel erstellen](https://fishersteve.github.io/Jeopardy_fuer_den_Unterricht/Spiel-Erstellen.html)**

Das Repository ist öffentlich und die Spieleseite ist über GitHub Pages erreichbar. Zum Spielen ist kein GitHub-Konto nötig.

Du brauchst einen Browser. Für neue Aufgaben brauchst du zusätzlich Zugang zu einer KI. Die fertigen Spiele kommen ohne Internet aus, wenn das Gerät lokale HTML-Dateien im Browser ausführen kann.

## Ich möchte erst einmal spielen

1. Öffne die [Startseite auf GitHub Pages](https://fishersteve.github.io/Jeopardy_fuer_den_Unterricht/). Dort sind alle Spiele verlinkt.
2. Alternativ: [Lade den Projektordner als ZIP herunter](https://github.com/FisherSteve/Jeopardy_fuer_den_Unterricht/archive/refs/heads/main.zip), entpacke ihn und öffne die **index.html im Hauptordner**. Ihre Links funktionieren auch lokal.
3. Direkt im Browser spielen:
   - [Erwachsene · Welt, Geschichte, Wissenschaft, Kultur & Alltag](https://fishersteve.github.io/Jeopardy_fuer_den_Unterricht/spiele/allgemeinwissen-erwachsene/)
   - [Start Klasse 10 · Memes, Mediencheck, Mathe, Natur & Weltwissen](https://fishersteve.github.io/Jeopardy_fuer_den_Unterricht/spiele/klasse-10-start-meme-wissen/)
   - [Ab 14 · Memes, Gaming, Tiere, Weltraum & Kopfrätsel](https://fishersteve.github.io/Jeopardy_fuer_den_Unterricht/spiele/meme-mix-ab-14/)
   - [Mathe Klasse 8 NRW · Terme, Zuordnungen, Prozent, Geometrie & Zufall](https://fishersteve.github.io/Jeopardy_fuer_den_Unterricht/spiele/mathematik-klasse-8-nrw/)
   - [Mathe Klasse 5 · Zahlen, Größen, Geometrie, Daten & Knobeln](https://fishersteve.github.io/Jeopardy_fuer_den_Unterricht/spiele/mathematik-klasse-5/)
   - [Klasse 6 · Deutschland, Englisch, Brüche, Ägypten & Pubertät](https://fishersteve.github.io/Jeopardy_fuer_den_Unterricht/spiele/faechermix-klasse-6/)
   - [Elektronik, 3. Lehrjahr · Sicherheit, Schaltungen & Messtechnik](https://fishersteve.github.io/Jeopardy_fuer_den_Unterricht/spiele/elektronikerausbildung-abschluss-wiederholung/)
4. Öffne im Spiel **Menü**. Dort kannst du die Teamnamen ändern und vor der ersten Bewertung weitere Teams hinzufügen. Zwei Teams sind voreingestellt; bis zu sechs sind möglich.
5. Jetzt kann das hervorgehobene Team eine Punktekarte wählen.

Falls GitHub beim Anklicken einer HTML-Datei nur Quelltext zeigt: Die Datei herunterladen und anschließend auf dem Gerät öffnen. Die Codeansicht auf GitHub ist noch nicht das Spiel.

## So läuft eine Runde ab

- **Team 1 beginnt.** Danach folgen Team 2, Team 3 usw. Die Reihenfolge läuft automatisch im Kreis.
- Das aktive Team wählt eine Karte und beantwortet die Frage.
- **Mündliche Aufgabe:** Die Lehrkraft drückt „Antwort anzeigen“ und bewertet mit „Richtig“ oder „Falsch“.
- **Zahlenaufgabe:** Das Team tippt seine Antwort auf dem Ziffernfeld ein und drückt „Antwort abgeben“.
- **Auswahlaufgabe:** Das Team markiert die passende Antwort und drückt „Antwort abgeben“. Falls mehrere Antworten möglich sind, steht dies dabei.
- **Standardwertung: Richtig gibt den Kartenwert, falsch 0 Punkte.** In beiden Fällen ist die Karte anschließend erledigt. Es gibt keine Übernahme durch ein anderes Team.
- Nach jeder Bewertung erscheint ein großes Ergebnis-Popup: **„Richtig!“** mit kurzem visuellen Jubel und Punkteanzeige oder **„Nicht richtig“** mit der richtigen Antwort und einer kurzen Erklärung.
- Im selben Popup steht deutlich, welches Team als Nächstes dran ist. Mit **„Weiter mit Team …“** gelangt ihr zum Spielfeld. Lösung und Erklärung bleiben ohne Zeitlimit stehen, damit ihr sie gemeinsam besprechen könnt. Nach der letzten Frage führt der Button zum Spielergebnis.

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

1. Öffne den **[Spiel-Ersteller online](https://fishersteve.github.io/Jeopardy_fuer_den_Unterricht/Spiel-Erstellen.html)**. Alternativ kannst du die heruntergeladene Datei `Spiel-Erstellen.html` im Browser öffnen.
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
| Musik abspielen | Menü → „Hintergrundmusik abspielen“; standardmäßig aus |
| Mehr Teams | Menü → „Team hinzufügen“, vor der ersten Bewertung |
| Punktabzug einschalten | Menü → „Punktabzug bei falscher Antwort“, vor der ersten Bewertung; standardmäßig aus |
| Untergrenze wählen | Bei aktiviertem Punktabzug: „Negative Punktestände erlauben“ einschalten oder ausgeschaltet lassen, damit der Stand bei 0 stoppt |
| Teamnamen ändern | Menü → Namen bearbeiten |
| Lehrkräftehinweise nutzen | Menü → „Lehrkräftehinweise freigeben“ einschalten |
| Falschen Klick korrigieren | „Rückgängig“ nimmt die letzte Karte, ihre Wertung und den Teamwechsel zurück |
| Neu anfangen | Menü → „Spiel zurücksetzen“; Teamnamen, Teamzahl und Wertungseinstellungen bleiben erhalten |
| Größere Bildschirmfläche | „Vollbild“, sofern der Browser diese Funktion anbietet |

**Lehrkräftehinweise sind zunächst vollständig ausgeblendet**, auch ihr Button. Nach der Freigabe im Menü lassen sie sich in einer Frage gezielt einblenden. Bei Zahlen- und Auswahlaufgaben erlaubt diese Freigabe auch das manuelle Aufdecken und Bewerten. Nach dem Neuladen ist die Freigabe wieder aus. Die Menüeinstellung ist keine Passwortsperre; die Lehrkraft bedient das Menü.

Die Erklärung nach einer falschen Antwort ist für die ganze Klasse gedacht und wird immer gezeigt. Interne Lehrkräftehinweise bleiben dabei verborgen. Das Ergebnis-Popup lässt sich auch mit **Enter, Leertaste oder Esc** fortsetzen. Animationen entfallen bei der Systemeinstellung für reduzierte Bewegung; die Rückmeldung bleibt sichtbar.

Das Spiel merkt sich den Spielstand nach Möglichkeit im verwendeten Browser. Wenn Speichern nicht möglich ist, zeigt es einen Hinweis und bleibt spielbar. Für eine neue Lerngruppe das Spiel zurücksetzen. Auf gemeinsam genutzten Geräten am besten neutrale Teamnamen verwenden.

## Optionale Hintergrundmusik

Die Spiele auf GitHub Pages verwenden eine gemeinsame Musikdatei. Unter **Menü → Hintergrundmusik abspielen** kannst du sie ein- und ausschalten. Sie startet nur nach deiner Eingabe, läuft in einer Schleife und stoppt beim Verlassen des Tabs. Nach dem Neuladen ist sie wieder aus. Die Lautstärke regelst du am Gerät.

Für ein selbst erstelltes oder einzeln heruntergeladenes Spiel ist Musik freiwillig: Lege eine MP3 mit dem genauen Namen **Jeopardy-theme-song.mp3** in denselben Ordner wie die HTML-Datei. Die Musik wird nicht in die HTML eingebettet oder vom Spiel-Ersteller mit heruntergeladen. Ohne MP3 funktioniert das ganze Spiel weiterhin; nur beim Einschalten erscheint gegebenenfalls ein Hinweis im Menü. Wenn du dein eigenes Spiel mit Musik online stellst, lade beide Dateien gemeinsam in denselben Ordner hoch.

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

Für neue Spiele bitte die **Framework-Prompt** und den **Spiel-Ersteller** verwenden. Veraltete Originalspiele und die alte allgemeine Prompt wurden entfernt; generierte Testausgaben gehören nicht ins Repository.

## Eigene Kopie auf GitHub Pages bereitstellen

Dieses öffentliche Repository ist bereits [online spielbar](https://fishersteve.github.io/Jeopardy_fuer_den_Unterricht/). Die folgenden Hinweise brauchst du nur, wenn du eine eigene Kopie veröffentlichen möchtest.

Die Startseite ist `index.html` im Hauptordner. Jedes Spiel hat einen eigenen Ordner: `spiele/<spielname>/index.html`. Dadurch funktionieren auch Adressen wie `spiele/mathematik-klasse-5/`.

Verwende für GitHub Pages den Branch mit diesen Dateien und dessen Hauptordner (`/`). `node build.js` aktualisiert alle Spiele, den Spiel-Ersteller und die Startseite. Die Veröffentlichung der bereits erzeugten HTML-Dateien benötigt keinen Build auf GitHub. Die Datei `.nojekyll` kennzeichnet die Website als direkt auslieferbare statische Dateien.

## Neues Quiz: Mathematik Klasse 8 NRW

[Quiz starten](https://fishersteve.github.io/Jeopardy_fuer_den_Unterricht/spiele/mathematik-klasse-8-nrw/) · [Aufgabensatz](content/mathematik-klasse-8-nrw.json)

Fünf Rubriken mit jeweils fünf Kopfrechen- und Verständnisfragen für die Realschule. Standardmäßig ohne Punktabzug.

## Meme-Mix für Jugendliche ab etwa 14

[Direkt spielen](https://fishersteve.github.io/Jeopardy_fuer_den_Unterricht/spiele/meme-mix-ab-14/) · [Aufgabensatz](content/meme-mix-ab-14.json)

25 Fragen in fünf Rubriken: Memes & Netzsprache, Gaming trifft Wissen, Tiere, Weltraum und Kopfrätsel. Zahlenfeld und Antwortauswahl übernehmen die Bewertung. Die Netzbezüge sind in Deutschland belegt; Recherchestand September 2026. Auch ohne Meme-Vorwissen gibt es viele Punkte zu holen.

## Klasse 10: Startklar – Memes & Wissen

[Direkt spielen](https://fishersteve.github.io/Jeopardy_fuer_den_Unterricht/spiele/klasse-10-start-meme-wissen/) · [Aufgabensatz](content/klasse-10-start-meme-wissen.json)

Für den Anfang der zehnten Klasse: 25 neue Fragen zu Netzsprache, Medienkompetenz, Kopfrechnen, Naturwissenschaften und Weltwissen. Grundlagen aus den Vorjahren und Allgemeinwissen; kein neu erarbeiteter Stoff der Klasse 10 nötig. Alle Antworten werden automatisch gewertet.

## Optional: Ein Spiel mit Netlify online stellen

Du möchtest ein eigenes Spiel über einen Link teilen? Öffne [Netlify Drop](https://app.netlify.com/drop), melde dich bei Netlify an und ziehe die fertige Spiel-HTML in das Upload-Feld oder wähle sie dort aus. Falls Netlify fragt, ob die Datei in `index.html` umbenannt werden soll, bestätige das: So öffnet sich das Spiel direkt unter seiner neuen Webadresse. Alternativ kannst du eine Kopie vorher selbst `index.html` nennen und in einem eigenen Ordner hochladen. Nach der Veröffentlichung erhältst du einen Link, den du mit der Klasse teilen oder am Schuldisplay öffnen kannst. Programmieren und eine Verbindung zu GitHub sind dafür nicht nötig. **Das ist freiwillig: Die heruntergeladenen Spiele funktionieren weiterhin lokal in einem geeigneten Browser, auch ohne Netlify und ohne Internet.** Zum Laden der Online-Version ist eine Internetverbindung erforderlich. Weitere Hilfe bietet die [Netlify-Anleitung zum Hochladen](https://docs.netlify.com/deploy/create-deploys/).
