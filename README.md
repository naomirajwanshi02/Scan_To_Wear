# Scan to Wear: one link, many wearables

One web link for one NFC tag. It opens the camera and asks you to scan a picture:

- **Noh Masks picture** → opens [Noh Masks](https://github.com/naomirajwanshi02/Noh_Masks)
- **Samurai Armour picture** → opens [Samurai Wear](https://github.com/naomirajwanshi02/Samurai_Wear)

This hub holds **no masks or armour**. It only recognises the picture and redirects to that wearable's
own live page, so each wearable stays independently editable: change and push it in its own repo and the
hub serves the new version (GitHub Pages refreshes in about a minute).

| File | What it is |
|---|---|
| `index.html`, `js/app.js`, `js/scan.js` | Camera permission, scanner, redirect |
| `js/wearables.js` | The list of wearables (name, page URL, picture, index in `targets.mind`) |
| `targets.mind` | Both pictures compiled together (index 0 Noh, 1 Samurai) |
| `tools/make-target.html`, `tools/serve.ps1` | Rebuild `targets.mind` from the live pictures |

**Only if a wearable's picture (`target.png`) changes, or a wearable is added:** edit `js/wearables.js`,
run `tools/serve.ps1`, open `http://localhost:8136/tools/make-target.html?build=1`, then commit `targets.mind`.
Changes to a wearable's masks, armour or look need nothing here.

Phones need HTTPS for the camera (GitHub Pages provides it).
