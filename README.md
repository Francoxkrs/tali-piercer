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
  data/depoimentos.ts  feedbacks de clientes (edite aqui)
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

O site fica na Netlify, em https://tali-piercer.netlify.app. A configuração está em `netlify.toml`
(roda `npm run build` e publica a pasta `dist/`), então cada push na `main` gera um deploy novo.
Se o endereço mudar, troque também `canonical`, `og:url` e `og:image` em `public/index.html`.

## Como editar o catálogo

Cada furo é um item em `src/data/piercings.ts`: nome, região, tempo médio de cicatrização,
joia inicial e os pontos onde a joia aparece no desenho (coordenadas num quadro de 200 × 260).
Para ligar uma foto a um furo, adicione o `id` do furo em `furos` dentro de `FOTOS`.
Cada furo tem link direto, por exemplo `/#furo-helix`, bom para colocar nos stories.

## Como editar os feedbacks

Cada feedback é um item em `src/data/depoimentos.ts`. `destaque` é o trecho que ganha marca-texto
e `furo` liga o cartão a um furo do catálogo. Só coloque nome ou @ de quem escreveu com autorização.

## Pendências de conteúdo

- Trocar as fotos provisórias (recortes do Instagram) pelas originais quando existirem.
- Confirmar com a Tali a lista de furos e os tempos de cicatrização.
