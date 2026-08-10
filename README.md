# Saurav Rijal — Code / Edit / Experiment

## Structure

- `index.html` — semantic page structure
- `css/main.css` — complete styling and responsive rules
- `js/main.js` — application entry point, GSAP and animation loop
- `js/scene.js` — Three.js scene, lighting and 3D workspace
- `js/interactions.js` — pointer, cursor, scroll velocity and controls
- `js/config.js` — editable portfolio/site data
- `assets/` — place images/videos/icons here

## Run locally

For best results use a local HTTP server because ES modules and import maps should not be opened through `file://`.

### Python

```bash
python -m http.server 5500
```

Then open:

`http://localhost:5500`

### VS Code

Use Live Server or another local static server.

## GitHub Pages

Push the folder contents to the repository root and configure GitHub Pages to deploy from the branch/folder containing `index.html`.

## Before launch

1. Change `hello@example.com` in `index.html` and `js/config.js`.
2. Add the real printing-business URL.
3. Add real video thumbnails/videos under `assets/`.
4. Replace project descriptions with final case-study copy.
5. Add CV/social links.
6. Test mobile, keyboard navigation and reduced-motion mode.
