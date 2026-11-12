# Cenários de teste e critérios de aceitação — WeMovies

**Aplicação:** http://wemovies-qa.s3-website.us-east-2.amazonaws.com
**Referência visual:** protótipo no Figma (Teste Front React WeFit 2022)
**Escopo:** Home (listagem), Carrinho e Compra realizada

## Visão geral e priorização

A prioridade segue o risco para o negócio: o que impede a compra ou afeta o valor cobrado vem primeiro.

| ID | Cenário | Tela | Prioridade | Automatizado |
| --- | --- | --- | --- | --- |
| CT01 | Listagem dos filmes na Home | Home | Média | — |
| CT02 | Adicionar filme ao carrinho | Home | Alta | ✅ `adicionar-ao-carrinho.spec.ts` |
| CT03 | Adicionar o mesmo filme mais de uma vez | Home | Média | ✅ `adicionar-ao-carrinho.spec.ts` |
| CT04 | Exibição dos itens, subtotais e total no carrinho | Carrinho | Alta | ✅ `adicionar-ao-carrinho.spec.ts` |
| CT05 | Alterar a quantidade de um item | Carrinho | Alta | ✅ `alterar-carrinho.spec.ts` |
| CT06 | Diminuir a quantidade até o limite mínimo | Carrinho | Média | — |
| CT07 | Remover item pela lixeira | Carrinho | Alta | ✅ `alterar-carrinho.spec.ts` |
| CT08 | Carrinho vazio | Carrinho | Média | ✅ `alterar-carrinho.spec.ts` |
| CT09 | Finalizar pedido | Carrinho → Compra realizada | Alta | ✅ `finalizar-pedido.spec.ts` |
| CT10 | Persistência do carrinho ao recarregar a página | Carrinho | Média | — |

**Os 3 cenários priorizados para automação E2E** foram os fluxos que, se quebrarem, impedem a venda ou cobram o valor errado:

1. **Adicionar ao carrinho** (CT02, CT03 e CT04): é a porta de entrada da compra.
2. **Alterar o carrinho** (CT05, CT07 e CT08): erros de cálculo afetam diretamente o valor pago pelo cliente.
3. **Finalizar pedido** (CT09): é o objetivo final do e-commerce.

---

## CT01 — Listagem dos filmes na Home

```gherkin
Cenário: Exibir o catálogo de filmes
  Dado que acesso a Home do WeMovies
  Quando a página termina de carregar
  Então devo ver um card para cada filme do catálogo
  E cada card deve exibir a capa, o título, o preço e o botão "Adicionar ao carrinho"
```

**Critérios de aceitação**
- Todos os filmes retornados pela API são exibidos (6 no ambiente atual).
- Cada card exibe capa, título, preço em reais (`R$ 0,00`) e o botão "Adicionar ao carrinho".
- O contador de cada botão começa em 0 e o cabeçalho exibe "0 itens".

## CT02 — Adicionar filme ao carrinho

```gherkin
Cenário: Adicionar um filme ao carrinho
  Dado que estou na Home com o carrinho vazio
  Quando clico em "Adicionar ao carrinho" no filme "Shang-chi"
  Então o contador do botão do filme deve exibir 1
  E o botão deve indicar que o item foi adicionado
  E o cabeçalho deve exibir "1 item"
```

**Critérios de aceitação**
- O contador do botão mostra a quantidade daquele filme no carrinho.
- O cabeçalho mostra o total de unidades no carrinho, no singular ("1 item") ou plural ("N itens").
- Conforme o protótipo, o botão muda de cor e de texto para "Item adicionado" (ver divergência D1).

## CT03 — Adicionar o mesmo filme mais de uma vez

```gherkin
Cenário: Incrementar a quantidade do mesmo filme
  Dado que estou na Home com o carrinho vazio
  Quando clico 2 vezes em "Adicionar ao carrinho" no filme "Shang-chi"
  E clico 1 vez no filme "Batman"
  Então o botão de "Shang-chi" deve exibir 2 e o de "Batman" deve exibir 1
  E o cabeçalho deve exibir "3 itens"
```

**Critérios de aceitação**
- Adicionar o mesmo filme incrementa a quantidade, sem criar uma linha duplicada no carrinho.
- Filmes não adicionados continuam com contador 0.

## CT04 — Itens, subtotais e total no carrinho

```gherkin
Cenário: Conferir os valores do carrinho
  Dado que adicionei 2 unidades de "Shang-chi" (R$ 30,99) e 1 de "Batman" (R$ 21,90)
  Quando acesso o carrinho pelo cabeçalho
  Então devo ver "Shang-chi" com quantidade 2 e subtotal "R$ 61,98"
  E devo ver "Batman" com quantidade 1 e subtotal "R$ 21,90"
  E o total deve ser "R$ 83,88"
```

**Critérios de aceitação**
- Cada item exibe capa, título, preço unitário, quantidade e subtotal.
- Subtotal = preço unitário × quantidade.
- Total = soma dos subtotais, com duas casas decimais.

## CT05 — Alterar a quantidade de um item

```gherkin
Cenário: Aumentar e diminuir a quantidade
  Dado que tenho "Shang-chi" e "Eternos" no carrinho, 1 unidade de cada
  Quando clico 2 vezes no botão "+" de "Shang-chi"
  Então a quantidade de "Shang-chi" deve ser 3
  E o subtotal e o total devem ser recalculados
  E o cabeçalho deve exibir "4 itens"
  Quando clico 1 vez no botão "–" de "Shang-chi"
  Então a quantidade deve ser 2 e os valores recalculados novamente
```

**Critérios de aceitação**
- Os botões "+" e "–" alteram a quantidade em 1 unidade.
- Subtotal, total e cabeçalho são atualizados imediatamente, sem recarregar a página.
- O campo de quantidade não aceita digitação direta (somente leitura).

## CT06 — Diminuir a quantidade até o limite mínimo

```gherkin
Cenário: Diminuir a quantidade de um item com 1 unidade
  Dado que tenho 1 unidade de "Morbius" no carrinho
  Quando clico no botão "–" de "Morbius"
  Então o comportamento deve seguir a regra definida pelo produto
```

**Critérios de aceitação**
- A quantidade nunca fica zerada ou negativa com o item ainda listado.
- Comportamento atual: o item é removido do carrinho. Ver observação O1 sobre validar essa regra com o PO.

## CT07 — Remover item pela lixeira

```gherkin
Cenário: Remover um item do carrinho
  Dado que tenho "Shang-chi" e "Eternos" no carrinho
  Quando clico na lixeira de "Shang-chi"
  Então "Shang-chi" não deve mais aparecer no carrinho
  E o total deve ser igual ao subtotal de "Eternos"
  E o cabeçalho deve exibir "1 item"
```

**Critérios de aceitação**
- A lixeira remove o item inteiro, independentemente da quantidade.
- Total e cabeçalho são atualizados após a remoção.

## CT08 — Carrinho vazio

```gherkin
Cenário: Exibir o estado de carrinho vazio
  Dado que removi todos os itens do carrinho
  Então devo ver a mensagem "Parece que não há nada por aqui :("
  E não devo ver o botão "Finalizar pedido"
  E devo ter um botão para voltar à Home
```

**Critérios de aceitação**
- A mensagem e a ilustração de carrinho vazio são exibidas.
- O botão "Finalizar pedido" não é exibido.
- Conforme o protótipo, o botão "Voltar" leva à Home (ver divergência D3).

## CT09 — Finalizar pedido

```gherkin
Cenário: Concluir a compra
  Dado que tenho itens no carrinho
  Quando clico em "Finalizar pedido"
  Então devo ser direcionado para a tela de pedido confirmado
  E devo ver a mensagem "Compra realizada com sucesso!"
  E o carrinho deve ficar vazio, com o cabeçalho exibindo "0 itens"
  Quando clico em "Voltar"
  Então devo voltar para a Home com todos os contadores zerados
```

**Critérios de aceitação**
- A tela de confirmação é exibida na rota `/purchase-made`.
- Após a compra, o carrinho é esvaziado, inclusive o que está salvo no navegador.
- O botão "Voltar" leva à Home com o estado inicial dos botões.

## CT10 — Persistência do carrinho

```gherkin
Cenário: Manter o carrinho após recarregar a página
  Dado que adicionei filmes ao carrinho
  Quando recarrego a página (F5)
  Então os itens, as quantidades e o total devem continuar no carrinho
```

**Critérios de aceitação**
- O carrinho é mantido após recarregar ou fechar e abrir a aba (salvo no `localStorage`).
- O cabeçalho exibe a mesma quantidade de antes da recarga.
