# Presente X Assets

Pasta de assets específica para a feature `presente-x`.

Estrutura:
- `icons/` — ícones pequenos (SVG, PNG) usados na UI do mapa e botões.
- `images/` — imagens maiores (backgrounds, fases, thumbnails).

Uso recomendado:
- Importar imagens a partir de `src/features/presente-x/assets` quando precisar bundle (ex.: `import img from '@/features/presente-x/assets/images/bg.jpg'`).
- Se preferir servir assets publicamente sem bundling, coloque-os em `public/presente-x/` e acesse via `/presente-x/<file>`.

Boas práticas:
- Preferir SVG para ícones quando possível.
- Otimizar imagens (WebP/AVIF para backgrounds, PNG/WEBP para thumbnails).
- Use nomes legíveis: `day-01-thumb.webp`, `map-icon-star.svg`.

Se quiser, eu posso adicionar placeholders (ex.: um ícone de presente e um background) para começar.