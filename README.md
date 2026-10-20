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
  main.ts        ponto de entrada
  loader.ts      tela "esterilizando…"
  split.ts       quebra títulos em letras e o manifesto em palavras
  fairy.ts       poeirinha de fada que segue o cursor
  nav.ts         menu, menu mobile e seção ativa
  motion.ts      revelações, parallax, manifesto, galeria horizontal, botões magnéticos
  services.ts    cardápio de furos (filtro + prévia) e dúvidas
scripts/build.mjs
```

## Publicação

Cada push na `main` publica o site no GitHub Pages pelo workflow em `.github/workflows/deploy.yml`.
No repositório, vá em **Settings → Pages** e escolha **GitHub Actions** como fonte.

## Pendências de conteúdo

- Trocar as fotos provisórias (recortes do Instagram) pelas originais em alta resolução.
- Confirmar horários de atendimento e valores, se forem entrar no site.
