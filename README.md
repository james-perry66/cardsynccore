# cardsynccore.com

The public website for CardSync Core, served by DigitalOcean App Platform as
a free static site (`cardsynccore-site`, region `nyc`). Every push to `main`
redeploys it; the app is defined in [`.do/app.yaml`](.do/app.yaml). Plain
HTML and one stylesheet; no build step.

It is a static copy of the landing pages in the (private) app repository,
rebranded and trimmed for a product in private development: no sign-up,
log-in or pricing yet. When the app moves to its own server, the site moves
with it and this repository can be archived.

DNS for `cardsynccore.com` is at GoDaddy: `A` and `AAAA` records for the
apex point at App Platform's static ingress addresses, and `www` is a
`CNAME` to the app's `ondigitalocean.app` host. The `MX` and `TXT` records
are for Google Workspace email; leave them alone.
