import { test, expect } from './fixtures';
import { FILMES } from '../data/catalogo';
import { Cabecalho } from '../pages/Cabecalho';

/**
 * Cenário CT09 (docs/cenarios-de-teste.md)
 * Prioridade alta: é o objetivo final do e-commerce.
 */
test.describe('Finalizar pedido', () => {
  test.beforeEach(async ({ home }) => {
    await home.abrir();
    await home.adicionarAoCarrinho(FILMES.VIUVA_NEGRA.titulo, 2);
    await home.adicionarAoCarrinho(FILMES.MORBIUS.titulo);
    await home.cabecalho.abrirCarrinho();
  });

  test('CT09 - deve confirmar a compra e esvaziar o carrinho', async ({ carrinho, compraRealizada, page }) => {
    await carrinho.finalizarPedido();

    await expect(page).toHaveURL(/\/purchase-made$/);
    await expect(compraRealizada.mensagemSucesso).toBeVisible();
    await expect(compraRealizada.cabecalho.quantidadeDeItens).toHaveText(Cabecalho.textoQuantidade(0));

    await compraRealizada.cabecalho.abrirCarrinho();
    await carrinho.deveEstarVazio();
  });

  test('CT09 - "Voltar" deve levar à Home com os botões zerados', async ({ carrinho, compraRealizada, home, page }) => {
    await carrinho.finalizarPedido();
    await compraRealizada.botaoVoltar.click();

    await expect(page).toHaveURL(/\/$/);
    await expect(home.titulosDosFilmes).toHaveCount(Object.keys(FILMES).length);
    expect(await home.quantidadeNoBotao(FILMES.VIUVA_NEGRA.titulo)).toBe(0);
    expect(await home.quantidadeNoBotao(FILMES.MORBIUS.titulo)).toBe(0);
  });
});
