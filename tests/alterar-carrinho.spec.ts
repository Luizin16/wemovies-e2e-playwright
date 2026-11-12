import { test, expect } from './fixtures';
import { FILMES } from '../data/catalogo';
import { Cabecalho } from '../pages/Cabecalho';
import { multiplicar, somar } from '../utils/moeda';

/**
 * Cenários CT05, CT07 e CT08 (docs/cenarios-de-teste.md)
 * Prioridade alta: erro de cálculo no carrinho afeta diretamente o valor cobrado do cliente.
 */
test.describe('Alterar itens do carrinho', () => {
  test.beforeEach(async ({ home }) => {
    await home.abrir();
    await home.adicionarAoCarrinho(FILMES.SHANG_CHI.titulo);
    await home.adicionarAoCarrinho(FILMES.ETERNOS.titulo);
    await home.cabecalho.abrirCarrinho();
  });

  test('CT05 - aumentar a quantidade deve recalcular subtotal, total e cabeçalho', async ({ carrinho }) => {
    await carrinho.aumentarQuantidade(FILMES.SHANG_CHI.titulo, 2);

    await expect(carrinho.campoQuantidade(FILMES.SHANG_CHI.titulo)).toHaveValue('3');
    const subtotalShangChi = multiplicar(FILMES.SHANG_CHI.preco, 3);
    expect(await carrinho.subtotal(FILMES.SHANG_CHI.titulo)).toBe(subtotalShangChi);
    expect(await carrinho.valorTotal()).toBe(somar(subtotalShangChi, FILMES.ETERNOS.preco));
    await expect(carrinho.cabecalho.quantidadeDeItens).toHaveText(Cabecalho.textoQuantidade(4));
  });

  test('CT05 - diminuir a quantidade deve recalcular subtotal e total', async ({ carrinho }) => {
    await carrinho.aumentarQuantidade(FILMES.SHANG_CHI.titulo, 2);
    await carrinho.diminuirQuantidade(FILMES.SHANG_CHI.titulo);

    await expect(carrinho.campoQuantidade(FILMES.SHANG_CHI.titulo)).toHaveValue('2');
    const subtotalShangChi = multiplicar(FILMES.SHANG_CHI.preco, 2);
    expect(await carrinho.subtotal(FILMES.SHANG_CHI.titulo)).toBe(subtotalShangChi);
    expect(await carrinho.valorTotal()).toBe(somar(subtotalShangChi, FILMES.ETERNOS.preco));
  });

  test('CT07 - remover um item pela lixeira deve atualizar o total e o cabeçalho', async ({ carrinho }) => {
    await carrinho.remover(FILMES.SHANG_CHI.titulo);

    await expect(carrinho.item(FILMES.SHANG_CHI.titulo)).toHaveCount(0);
    expect(await carrinho.valorTotal()).toBe(FILMES.ETERNOS.preco);
    await expect(carrinho.cabecalho.quantidadeDeItens).toHaveText(Cabecalho.textoQuantidade(1));
  });

  test('CT08 - remover todos os itens deve exibir o carrinho vazio', async ({ carrinho }) => {
    await carrinho.remover(FILMES.SHANG_CHI.titulo);
    await carrinho.remover(FILMES.ETERNOS.titulo);

    await carrinho.deveEstarVazio();
    await expect(carrinho.cabecalho.quantidadeDeItens).toHaveText(Cabecalho.textoQuantidade(0));
  });

  test('D3 - carrinho vazio deve oferecer o botão "Voltar" para a Home, como no protótipo', async ({
    carrinho,
    page,
  }) => {
    test.info().annotations.push({ type: 'divergência', description: 'D3 em docs/bugs.md' });
    test.fail(true, 'Divergência conhecida D3: o botão é "Recarregar página" e mantém o usuário no carrinho');

    await carrinho.remover(FILMES.SHANG_CHI.titulo);
    await carrinho.remover(FILMES.ETERNOS.titulo);
    await expect(carrinho.botaoCarrinhoVazio).toHaveText(/voltar/i, { timeout: 2000 });
    await carrinho.botaoCarrinhoVazio.click();
    await expect(page).toHaveURL(/\/$/, { timeout: 2000 });
  });
});
