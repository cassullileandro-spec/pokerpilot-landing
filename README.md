# PokerPilot — Landing page

Landing page estática do PokerPilot, com temas Dark e Light, galeria de capturas reais em alta resolução e cards ilustrados interativos.

Site ao vivo: https://cassullileandro-spec.github.io/pokerpilot-landing/

## Atualizar o site publicado

O GitHub Pages publica a raiz da branch `codex/pages`, que contém apenas os arquivos de `landing/dist/`. Após salvar as alterações em um commit na `main`, publique com:

```sh
npm run check
git subtree push --prefix=landing/dist origin codex/pages
```

O GitHub Pages aplica a atualização após concluir a publicação dessa branch.

## Executar localmente

Requisito: Node.js 18 ou superior. O projeto não possui dependências externas de execução nem etapa de build.

```sh
npm run dev
```

Abra http://localhost:4173. Para verificar a sintaxe:

```sh
npm run check
```

## Estrutura

- `landing/dist/`: arquivos estáticos prontos para hospedagem.
- `landing/dist/index.html`: página principal, com preferência de tema persistida.
- `landing/dist/light.html` e `dark.html`: abrem explicitamente cada tema.
- `landing/dist/assets/`: logos, fontes e capturas Retina originais.
- `landing/dist/config.js`: URLs da agenda e dos documentos legais.
- `landing/dist/palette.css`: tokens e cores compartilhados dos temas Light e Dark.
- `landing/server.mjs`: servidor de desenvolvimento local.

As cores seguem os modos “Depois Light” e “Depois Dark” do [design system PokerPilot](https://www.figma.com/design/2p71bskRATG0xahYrqATNb?node-id=42-207), consultados em 25/10/2026. As capturas reais permanecem com a aparência da plataforma na data da captura; não são simulações do redesign.

Para hospedar o site, publique o conteúdo de `landing/dist/` em um serviço de arquivos estáticos. Não é necessário executar o servidor de desenvolvimento em produção.

## Funcionalidades

- Seletor Dark/Light que sincroniza página, logotipo e capturas.
- Calculadora mensal em USD por jogadores ativos, com faixas atualizadas em 30/10/2026. A tarifa da faixa vale para todo o time; 301+ jogadores são sob consulta.
- Campo numérico, slider, destaque da faixa e validação de entradas; testes dos limites das faixas incluídos em `npm run check`.
- Galeria com Desempenho, Dashboard, Bankroll e Lançamentos; abas acessíveis por teclado e diálogo de ampliação.
- Capturas reais atualizadas em 25/10/2026: PNGs desktop de 3360 × 2100, Desempenho completo de 3348 × 3824 e Dashboard mobile de 780 × 1688, em ambos os temas.
- Bento com demonstração interativa de Kanban, navegação mobile, FAQ e respeito à preferência por movimento reduzido.

## Estado da prévia

A página ainda é uma prévia: agenda, privacidade e termos precisam de URLs finais em `config.js`. Enquanto a agenda não estiver configurada, o formulário é demonstrativo, sem envio ou armazenamento dos dados.

Os depoimentos são textos-modelo identificados; os alertas são um conceito em validação. As capturas mostram os dados atualizados da conta de demonstração. Os valores exibidos não representam promessa de resultado. Antes da publicação comercial, confirmar depoimentos, condições de cobrança e alegações do produto. A tag `noindex,nofollow` está mantida durante a revisão.

Pesquisas, notas internas e referências de design não fazem parte deste repositório.
