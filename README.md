# Portfólio de Douglas Floriano Costa

Dev full-stack sênior na IB System. Site pessoal com os principais projetos contados como case (problema, o que eu fiz, decisões técnicas, stack, resultado e prints).

Online: https://douglas-floriano.github.io

## Stack

- React 19, Vite e TypeScript
- Tailwind CSS 3 com tokens próprios (`tailwind.config.js`)
- Sem bibliotecas de animação: rolagem nativa, imagens com `loading="lazy"`

## Rodar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/
npm run lint
npm run preview
```

## Onde mexer

- Projetos: `src/data/projects.ts` (`CASES` são os destaques, `OTHERS` a lista compacta). Contatos em `src/data/contact.ts`.
- Telas: `public/projects/<slug>/NN-nome.webp`, capturas em 1440x900 ou 390x844, convertidas com `cwebp -q 80`.
- Prints de sistema da empresa só de ambiente de demonstração ou com nomes e dados de cliente pixelizados na própria imagem.
- SEO: `index.html` (og, canonical, JSON-LD), `public/og.png` (1200x630), `public/robots.txt`, `public/sitemap.xml`.

## Deploy

Push na `main` dispara `.github/workflows/deploy.yml` e publica no GitHub Pages.
