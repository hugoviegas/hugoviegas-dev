Put your Formula D game files here.

- Replace index.html with your game's main HTML file.
- Keep asset paths relative so the iframe can load scripts and resources.
- If your game uses a different entry point, update the iframe src in src/pages/FormulaD.tsx.

Notes:

- The app serves files from the `public/` folder at the root URL.
  For example: `public/games/formula-d/index.html` -> `/games/formula-d/index.html`.
- If scripts are blocked due to `sandbox` restrictions, edit `src/pages/FormulaD.tsx` to adjust the iframe sandbox attributes or open the game in a new tab.
