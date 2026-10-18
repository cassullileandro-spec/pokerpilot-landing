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
- `landing/server.mjs`: servidor de desenvolvimento local.

Para hospedar o site, publique o conteúdo de `landing/dist/` em um serviço de arquivos estáticos. Não é necessário executar o servidor de desenvolvimento em produção.

## Funcionalidades

- Seletor Dark/Light que sincroniza página, logotipo e capturas.
- Galeria com Dashboard, Tarefas, Deals e Lançamentos; abas acessíveis por teclado e diálogo de ampliação.
- PNGs desktop de 2880 × 1800 e dashboard mobile de 780 × 1688.
- Bento com demonstração interativa de Kanban, navegação mobile, FAQ e respeito à preferência por movimento reduzido.

## Estado da prévia

A página ainda é uma prévia: agenda, privacidade e termos precisam de URLs finais em `config.js`. Enquanto a agenda não estiver configurada, o formulário é demonstrativo, sem envio ou armazenamento dos dados.

Os depoimentos são textos-modelo identificados; os alertas são um conceito em validação. As capturas mostram uma conta de teste sem histórico financeiro. Antes da publicação comercial, confirmar depoimentos, condições de cobrança e alegações do produto. A tag `noindex,nofollow` está mantida durante a revisão.

Pesquisas, notas internas, referências de design e imagens antigas não fazem parte deste repositório.
