# WeMovies · Testes E2E com Playwright

[![Testes E2E](https://github.com/Luizin16/wemovies-e2e-playwright/actions/workflows/playwright.yml/badge.svg)](https://github.com/Luizin16/wemovies-e2e-playwright/actions/workflows/playwright.yml)
![Playwright](https://img.shields.io/badge/Playwright-1.65-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)

Especificação e automação de testes do [WeMovies](http://wemovies-qa.s3-website.us-east-2.amazonaws.com), um e-commerce simplificado de filmes com três telas: **Home**, **Carrinho** e **Compra realizada**.

## Entregas

| Entrega | Onde está |
| --- | --- |
| 1. 10 cenários de teste e critérios de aceitação | [`docs/cenarios-de-teste.md`](docs/cenarios-de-teste.md) |
| 2. Testes E2E dos 3 cenários prioritários | [`tests/`](tests) |
| Extra: bugs e divergências com o protótipo | [`docs/bugs.md`](docs/bugs.md) |

## Cenários automatizados

Os três cenários escolhidos são os fluxos que, se quebrarem, impedem a venda ou cobram o valor errado:

| Cenário | Arquivo | O que valida |
| --- | --- | --- |
| Adicionar ao carrinho (CT02, CT03, CT04) | `adicionar-ao-carrinho.spec.ts` | Contadores do botão e do cabeçalho; quantidades, subtotais e total no carrinho |
| Alterar o carrinho (CT05, CT07, CT08) | `alterar-carrinho.spec.ts` | Recálculo ao aumentar e diminuir, remoção pela lixeira, estado de carrinho vazio |
| Finalizar pedido (CT09) | `finalizar-pedido.spec.ts` | Tela de confirmação, carrinho esvaziado e retorno à Home zerada |

As divergências **D1** e **D3** também têm testes marcados com `test.fail()`. Eles validam o comportamento do protótipo e falham de propósito enquanto a aplicação não for corrigida. A suíte continua verde, a divergência fica documentada no relatório e, quando for corrigida, o Playwright avisa que o teste passou a passar.

## Principais achados

- **B1 (Alta):** a página declara `lang="en"`, então o Chrome oferece a tradução automática. Com a tradução ativa, o React para de atualizar a tela: o cabeçalho fica em "0 itens" e o subtotal ignora a quantidade.
- **D3 (Média):** o carrinho vazio exibe "Recarregar página" no lugar de "Voltar", e o usuário fica sem caminho de volta para a Home.
- Detalhes, passos para reproduzir e evidências em [`docs/bugs.md`](docs/bugs.md).

## Como rodar

Pré-requisito: Node.js 18 ou superior.

```bash
npm install
npx playwright install chromium

# Executar os testes E2E
npm run test:e2e

# Ver o navegador executando
npm run test:e2e:headed

# Modo interativo (UI do Playwright)
npm run test:e2e:ui

# Abrir o relatório HTML da última execução
npm run report
```

## Estrutura

```
├── data/catalogo.ts          # filmes e preços usados para calcular os valores esperados
├── pages/                    # Page Objects
│   ├── Cabecalho.ts
│   ├── HomePage.ts
│   ├── CarrinhoPage.ts
│   └── CompraRealizadaPage.ts
├── tests/
│   ├── fixtures.ts           # injeta os Page Objects em cada teste
│   ├── adicionar-ao-carrinho.spec.ts
│   ├── alterar-carrinho.spec.ts
│   └── finalizar-pedido.spec.ts
├── utils/moeda.ts            # conversão e cálculo de valores em reais
└── docs/                     # cenários, bugs e evidências
```

## Decisões técnicas

- **Page Object Model + fixtures:** os testes descrevem o comportamento (`adicionarAoCarrinho`, `finalizarPedido`) e os seletores ficam centralizados nos Page Objects. As fixtures entregam as páginas prontas para cada teste.
- **Seletores resilientes:** prioridade para seletores acessíveis (`getByRole`, `getByText`), como recomenda o Playwright. As classes geradas pelo styled-components (`sc-xxxx`) mudam a cada build e não são usadas. Onde não há alternativa, uso classes semânticas da própria aplicação (`counter`, `trash-btn`, `subtotal-column`). Recomendação para o time: adicionar `data-testid` nos elementos de ação.
- **Valores esperados calculados, não fixos:** subtotais e totais são calculados a partir do catálogo em `data/catalogo.ts`, em centavos, para evitar erro de ponto flutuante (por exemplo, `0.1 + 0.2`).
- **Comparação numérica de dinheiro:** os valores da tela (`R$ 61,98`) são convertidos para número antes da comparação, o que evita falhas por espaço não separável ou formatação.
- **Testes independentes:** cada teste roda num contexto novo do navegador, com o carrinho (`localStorage`) vazio, e pode rodar em paralelo.
- **Diagnóstico de falhas:** screenshot, vídeo e trace são guardados apenas quando um teste falha.
- **CI:** o GitHub Actions roda a suíte a cada push e publica o relatório HTML como artefato.

## Autor

**Luiz Alves** · QA Automation
[LinkedIn](https://www.linkedin.com/in/luiz-alves-candido-da-silva/) · [GitHub](https://github.com/Luizin16) · [Portfólio](https://luizin16.github.io)
