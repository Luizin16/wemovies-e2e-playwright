import { test, expect } from './fixtures';
import { FILMES } from '../data/catalogo';
import { Cabecalho } from '../pages/Cabecalho';
import { multiplicar, somar } from '../utils/moeda';

/**
 * Cenários CT02, CT03 e CT04 (docs/cenarios-de-teste.md)
 * Prioridade alta: é a porta de entrada da compra.
 */
test.describe('Adicionar filmes ao carrinho', () => {
  test.beforeEach(async ({ home }) => {
    await home.abrir();
  });

  test('CT02/CT03 - deve atualizar o contador do botão e do cabeçalho ao adicionar filmes', async ({ home }) => {
    await expect(home.cabecalho.quantidadeDeItens).toHaveText(Cabecalho.textoQuantidade(0));

    await home.adicionarAoCarrinho(FILMES.SHANG_CHI.titulo, 2);
    await home.adicionarAoCarrinho(FILMES.BATMAN.titulo);

    expect(await home.quantidadeNoBotao(FILMES.SHANG_CHI.titulo)).toBe(2);
    expect(await home.quantidadeNoBotao(FILMES.BATMAN.titulo)).toBe(1);
    expect(await home.quantidadeNoBotao(FILMES.MORBIUS.titulo)).toBe(0);
    await expect(home.cabecalho.quantidadeDeItens).toHaveText(Cabecalho.textoQuantidade(3));
  });

  test('CT04 - deve exibir no carrinho os filmes adicionados com quantidade, subtotal e total corretos', async ({
    home,
    carrinho,
    page,
  }) => {
    await home.adicionarAoCarrinho(FILMES.SHANG_CHI.titulo, 2);
    await home.adicionarAoCarrinho(FILMES.BATMAN.titulo);
    await home.cabecalho.abrirCarrinho();

    await expect(page).toHaveURL(/\/cart$/);
    await expect(carrinho.campoQuantidade(FILMES.SHANG_CHI.titulo)).toHaveValue('2');
    await expect(carrinho.campoQuantidade(FILMES.BATMAN.titulo)).toHaveValue('1');

    const subtotalShangChi = multiplicar(FILMES.SHANG_CHI.preco, 2);
    const subtotalBatman = multiplicar(FILMES.BATMAN.preco, 1);
    expect(await carrinho.subtotal(FILMES.SHANG_CHI.titulo)).toBe(subtotalShangChi);
    expect(await carrinho.subtotal(FILMES.BATMAN.titulo)).toBe(subtotalBatman);
    expect(await carrinho.valorTotal()).toBe(somar(subtotalShangChi, subtotalBatman));
  });

  test('D1 - botão deve indicar "Item adicionado" após adicionar o filme, como no protótipo', async ({ home }) => {
    test.info().annotations.push({ type: 'divergência', description: 'D1 em docs/bugs.md' });
    test.fail(true, 'Divergência conhecida D1: o botão mantém o texto "Adicionar ao carrinho"');

    await home.adicionarAoCarrinho(FILMES.HOMEM_ARANHA.titulo);

    await expect(home.card(FILMES.HOMEM_ARANHA.titulo).getByRole('button')).toContainText(/item adicionado/i, {
      timeout: 2000,
    });
  });
});
