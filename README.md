# Portfólio de Douglas Floriano Costa

Engenheiro de software e especialista em IA aplicada. Site pessoal com projetos, telas reais e explicação de como cada sistema funciona.

Online: https://douglas-floriano.github.io

## Stack

- React 19, Vite e TypeScript
- Tailwind CSS 3 com tokens próprios (`tailwind.config.js`)
- Framer Motion para as animações ligadas ao scroll
- Lenis para rolagem suave
- Canvas 2D para o campo neural do fundo (`src/components/NeuralField.tsx`)

## Rodar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/
npm run preview
```

## Onde mexer

- Projetos: `src/data/projects.ts` (próprios) e `src/data/projects-ib.ts` (IB System). `featured: true` coloca o projeto nos casos em destaque.
- Telas: `public/projects/<slug>/NN-nome.webp`. Capturas em 1440x900 (desktop) ou 390x844 (celular), convertidas com `cwebp -q 80`.
- Forma do fundo por seção: atributo `data-field` (`sphere`, `helix`, `grid`, `cloud`, `torus`) em cada `<section>`.

## Deploy

Push na `main` dispara `.github/workflows/deploy.yml` e publica no GitHub Pages.
