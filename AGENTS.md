# Arbeit an diesem Jeopardy-Framework

- Zuerst README.md und Framework-Prompt.md lesen.
- Neue Unterrichtsthemen ausschließlich als content/*.json anlegen und mit node build.js bauen. Engine und Oberfläche nicht pro Klasse duplizieren oder neu erzeugen.
- Verbindliche Nutzerentscheidungen: standardmäßig kein Punktabzug, optionaler Punktabzug mit wählbarer Untergrenze 0 oder negativen Punkteständen; automatische zyklische Teamreihenfolge; klar sichtbares aktives Team mit kurzer optionaler Animation; Lehrkräftehinweise standardmäßig verborgen; Touch zuerst, Tastatur weiter unterstützen.
- Keine Übernahme: richtig und falsch schließen die Karte sofort. Danach ist das nächste Team dran.
- Ein bis fünf Themen mit je fünf Punktekarten; mehr als fünf Themen werden abgelehnt. Brett und Spielende richten sich nach der tatsächlichen Themenzahl.
- Pro Aufgabe sind manuelle Bewertung, Zahleneingabe mit Touch-Ziffernfeld oder Auswahl möglich. Auswahl nur nach Wunsch oder didaktischer Eignung. Zahl/Auswahl werden bei Abgabe automatisch geprüft; Lösungen und Prüfkriterien müssen übereinstimmen.
- Hinweisebutton nur nach Freigabe im Menü; automatische Aufgaben verbergen standardmäßig auch das manuelle Aufdecken. Kürzel dürfen die Freigabe nicht umgehen.
- Nach jeder Wertung großes Ergebnis-Popup mit Punkten und nächstem Team; bei falsch richtige Antwort und explanation immer sichtbar bis zur Bestätigung. explanation ist für Lernende, teacherNote bleibt verborgen. Visueller Jubel bei richtig, reduzierte Bewegung beachten. Kein zweiter Bestätigungsschritt nur für den Teamwechsel.
- README.md ist die Anleitung ohne Programmierkenntnisse. Spiel-Erstellen.html muss denselben Stand der Engine und Spielvorlage enthalten; node build.js baut ihn mit. Technische Details stehen in TECHNIK.md.
- Bei Framework-Änderungen alle Spiele neu bauen, npm test und die verfügbaren Browserprüfungen ausführen. Nicht ausgeführte Geräte-/Browserprüfungen offen dokumentieren.
- Inhalte als Text behandeln. Keine externen Abhängigkeiten in fertigen Spielen. Browserzoom, Fokusführung und reduzierte Bewegung erhalten.
- Historische Original-HTML-Dateien und allgemeine_prompt.txt wurden entfernt. Die verbindliche Prompt ist Framework-Prompt.md; die aktuelle Beispielbefüllung bleibt als Inhaltsauftrag erhalten.
- Fertige Spiele liegen unter spiele/<kennung>/index.html. node build.js aktualisiert auch die Root-Startseite aus allen Spielordnern. Links relativ halten, damit GitHub Pages unter dem Repository-Unterpfad und lokale Dateien funktionieren.

- Keine separaten Quellen-, Lehrplan- oder Recherchedateien für einzelne Spiele ins Repository aufnehmen. Quellen bei Bedarf in der Chat-Antwort nennen; die Recherche weiterhin durchführen.

- Keine direkten oder indirekten Lösungsverräter in Fragen oder anderen vor der Abgabe sichtbaren Inhalten. Sortierlisten mischen; Antwortoptionen ohne verräterische Formulierung, Hervorhebung oder feste Lösungsposition. Notwendige Angaben zum selbstständigen Lösen bleiben erlaubt.
