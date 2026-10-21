# betterVIDEOS Website

Statische, responsive Website aus HTML, CSS und JavaScript. Kein Framework, keine Build-Tools nötig.

## Seiten

| Datei | Inhalt |
|---|---|
| `index.html` | Startseite nach eurem Konzept: Ziele, Video-Slider, Google-Bewertungen, Workflow, Team, FAQ |
| `eventvideo.html` | Eventvideos mit Vergleich, Produkten, Paketen und FAQ |
| `recruiting.html` | Recruiting-Seite |
| `referenzen.html` | Alle Projekte mit Filter |
| `case-study-conrad-clemens.html` | Case Study mit den Zahlen aus der Excel-Tabelle |
| `ueber-uns.html` | Über uns |
| `kontakt.html` | Kontakt mit Formular (öffnet das Mailprogramm) |
| `impressum.html`, `datenschutz.html` | Vorlagen, müssen vervollständigt werden |

Styles: `assets/css/style.css`. Interaktionen: `assets/js/main.js`.

## Hochladen

Den kompletten Ordner per FTP/SFTP ins Webroot kopieren. Lokal testen: `python3 -m http.server` im Ordner, dann `http://localhost:8000` öffnen. Per Doppelklick lädt die Schrift nicht.

## Termin-Link

Alle Buttons „Termin sichern“ und „Konzeptgespräch“ führen aktuell auf `kontakt.html`. Sobald ihr einen Online-Kalender habt (z. B. Calendly), in allen HTML-Dateien `href="kontakt.html"` bei diesen Buttons ersetzen.

## Datenschutz

- Schrift lokal, kein Google Fonts, kein Tracking, keine Cookies.
- Vimeo lädt erst nach Klick auf „Video abspielen“ (2-Klick-Lösung, `dnt=1`).
- Das Kontaktformular speichert nichts, es öffnet das Mailprogramm.
- Ausnahme: Die Vorschaubilder der Videokarten kommen direkt von Vimeo (oEmbed, erst wenn die Karte ins Bild scrollt). Dabei sieht Vimeo die IP-Adresse der Besucher. Das gehört in die Datenschutzerklärung.

## Noch offen (Suche im HTML nach `[`)

- Preise und Inhalte der Event-Pakete und der Fotobox
- Preisrahmen in den FAQ (Imagevideo, Veranstaltungsvideo, Recruitingvideo)
- Maurices Rolle, Kurzvorstellungen von Till und Maurice
- Zitat von Gerd Weise (Altstadtfest)
- Einleitungstext der Case Study
- Social-Media-Links im Footer (stehen auf `#`)
- Vimeo-Links der ODEG-Azubi-Videos und JU-Reels
- Impressum und Datenschutz
