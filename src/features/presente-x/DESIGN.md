# 🎁 Presente X - Design & Assets

## Paleta de Cores (Moderno-Rústico)

```
Primárias:
--px-warm-tan: #D4A574           (Bege quente, principal)
--px-light-cream: #F5E6D3        (Creme claro, background)
--px-soft-rose: #E8B4A0          (Rosa suave, acentos)
--px-dusty-green: #A8B8A0        (Verde fosco, profundidade)

Secundárias:
--px-warm-brown: #9B8968         (Marrom aquecido, texto)
--px-dark-slate: #6B5D52         (Ardósia escura, destaques)
--px-accent-peach: #E8D4C4       (Pêssego, highlights)
```

## Assets Inclusos

### Icons (SVG)

- `icons/present-icon.svg` - Ícone de presente customizado com tons terrosos
- `icons/lock-icon.svg` - Ícone de cadeado para gate de senha

### Estrutura de Pastas

```
src/features/presente-x/
├── assets/
│   ├── icons/           # SVG icons
│   ├── images/          # Background images, thumbnails
│   └── README.md
├── components/
│   └── PasswordGate.tsx # Gate com novo design
├── services/
│   └── supabase.ts
├── styles/
│   └── theme.css        # Estilos completamente redesenhados
└── contexts/
```

## Design Highlights

### PasswordGate

- Fundo com gradient suave (tons terrosos)
- Decorações flutuantes com blur (leveza)
- Input centrado com focus elegante
- Animações subtis (bounce, pulse)
- Responsivo mobile-first

### PresenteX (Main Page)

- Header sticky com glassmorphism
- Grid de fases com layout em zigue-zague (Candy Crush style)
- Blobs animados ao fundo (leveza moderno-contemporânea)
- Indicadores de pontos em cada dia
- Animações de entrada em cascata
- Status visual (locked/unlocked/active)

### Animações & Transições

- `float` - Blobs de fundo flutuando
- `pulse` - Dia ativo pulsando suavemente
- `bounce` - Lock icon e elementos flutuantes
- `fadeInScale` - Entrada dos níveis em cascata
- Cubic-bezier(0.34, 1.56, 0.64, 1) - Bounce elegante

## Como Usar

### Importar Estilos

```tsx
import "@/features/presente-x/styles/theme.css";
```

### Importar Ícones

```tsx
import presentIcon from "@/features/presente-x/assets/icons/present-icon.svg";
import lockIcon from "@/features/presente-x/assets/icons/lock-icon.svg";
```

### Aplicar Classes CSS

- `.presente-x-container` - Wrapper principal
- `.presente-x-level-button` - Botão de fase
- `.presente-x-level-button.active` - Fase ativa
- `.presente-x-level-button.locked` - Fase bloqueada
- `.presente-x-level-button.unlocked` - Fase desbloqueada
- `.presente-x-btn` - Button padrão
- `.presente-x-input` - Input padrão
- `.presente-x-card` - Card/glassmorphism

## Próximas Etapas

1. ✅ Assets criados (SVG icons)
2. ✅ Estilos completamente redesenhados
3. ✅ PasswordGate redesenhado
4. ✅ PresenteX page redesenhada
5. ⬜ Modal de conteúdo do dia (vídeo/quiz/texto)
6. ⬜ Sistema de pontos e recompensas
7. ⬜ Painel admin refinado com modal de edição
8. ⬜ Imagens específicas por dia (se desejado)

## Notas Técnicas

- Gradients são usados em botões e headers para profundidade
- Backdrop-filter (blur) cria efeito de vidro contemporâneo
- Animações usam cubic-bezier personalizado para movimento orgânico
- Design mobile-first com breakpoints em md
- Cores acessíveis com contraste adequado
- Sem dependências externas além de lucide-react (ícones)
