# Arbeit an diesem Jeopardy-Framework

- Zuerst README.md und Framework-Prompt.md lesen.
- Neue Unterrichtsthemen ausschließlich als content/*.json anlegen und mit node build.js bauen. Engine und Oberfläche nicht pro Klasse duplizieren oder neu erzeugen.
- Verbindliche Nutzerentscheidungen: keine Minuspunkte; automatische zyklische Teamreihenfolge; klar sichtbares aktives Team mit kurzer optionaler Animation; Lehrkräftehinweise standardmäßig verborgen; Touch zuerst, Tastatur weiter unterstützen.
- Keine Übernahme: richtig und falsch schließen die Karte sofort. Danach ist das nächste Team dran.
- Ein bis fünf Themen mit je fünf Punktekarten; mehr als fünf Themen werden abgelehnt. Brett und Spielende richten sich nach der tatsächlichen Themenzahl.
- Pro Aufgabe sind manuelle Bewertung, Zahleneingabe mit Touch-Ziffernfeld oder Auswahl möglich. Auswahl nur nach Wunsch oder didaktischer Eignung. Zahl/Auswahl werden bei Abgabe automatisch geprüft; Lösungen und Prüfkriterien müssen übereinstimmen.
- Hinweisebutton nur nach Freigabe im Menü; automatische Aufgaben verbergen standardmäßig auch das manuelle Aufdecken. Kürzel dürfen die Freigabe nicht umgehen.
- README.md ist die Anleitung ohne Programmierkenntnisse. Spiel-Erstellen.html muss denselben Stand der Engine und Spielvorlage enthalten; node build.js baut ihn mit. Technische Details stehen in TECHNIK.md.
- Bei Framework-Änderungen alle Spiele neu bauen, npm test und die verfügbaren Browserprüfungen ausführen. Nicht ausgeführte Geräte-/Browserprüfungen offen dokumentieren.
- Inhalte als Text behandeln. Keine externen Abhängigkeiten in fertigen Spielen. Browserzoom, Fokusführung und reduzierte Bewegung erhalten.
- Die ursprünglichen HTML-Dateien und allgemeine_prompt.txt sind historische Eingaben. Die verbindliche neue Prompt ist Framework-Prompt.md; die fertigen neuen Spiele liegen in spiele/.
