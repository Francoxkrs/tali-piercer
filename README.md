# tali✦piercer

Site estático da **Tali Piercer** (Talita Porto Mendonça), body piercer em Campo Grande/MS.
Feito com HTML, CSS e TypeScript puros, sem framework e sem servidor.

## Rodando localmente

```bash
npm install
npm run build   # gera a pasta dist/
npm run serve   # abre em http://localhost:4173
```

Durante o desenvolvimento, `npm run watch` recompila o TypeScript e copia `public/` a cada alteração.

## Estrutura

```
public/          HTML, CSS, imagens (copiados para dist/)
src/             TypeScript (compilado para dist/js/)
  data/piercings.ts  catálogo de furos e fotos de referência (edite aqui)
  catalog/       mapa interativo, ficha e catálogo (o HTML é gerado no build)
  main.ts        ponto de entrada
  loader.ts      tela "esterilizando…"
  split.ts       quebra títulos em letras e o manifesto em palavras
  fairy.ts       poeirinha de fada que segue o cursor
  nav.ts         menu, menu mobile e seção ativa
  motion.ts      revelações, parallax, manifesto, galeria horizontal, botões magnéticos
  faq.ts         dúvidas
  hours.ts       selo "atendendo agora" no fuso de Campo Grande
scripts/build.mjs
```

## Publicação

Cada push na `main` publica o site no GitHub Pages pelo workflow em `.github/workflows/deploy.yml`.
No repositório, vá em **Settings → Pages** e escolha **GitHub Actions** como fonte.

## Como editar o catálogo

Cada furo é um item em `src/data/piercings.ts`: nome, região, tempo médio de cicatrização,
joia inicial e os pontos onde a joia aparece no desenho (coordenadas num quadro de 200 × 260).
Para ligar uma foto a um furo, adicione o `id` do furo em `furos` dentro de `FOTOS`.
Cada furo tem link direto, por exemplo `/#furo-helix`, bom para colocar nos stories.

## Pendências de conteúdo

- Trocar as fotos provisórias (recortes do Instagram) pelas originais quando existirem.
- Confirmar com a Tali a lista de furos e os tempos de cicatrização.
