import { expect, type Locator, type Page } from '@playwright/test';
import { Cabecalho } from './Cabecalho';
import { paraNumero } from '../utils/moeda';

/** Tela do carrinho: itens, quantidades, subtotais, total e finalização. */
export class CarrinhoPage {
  readonly cabecalho: Cabecalho;
  readonly total: Locator;
  readonly botaoFinalizarPedido: Locator;
  readonly mensagemCarrinhoVazio: Locator;
  readonly botaoCarrinhoVazio: Locator;

  constructor(private readonly page: Page) {
    this.cabecalho = new Cabecalho(page);
    this.total = page
      .locator('main div')
      .filter({ has: page.getByText('Total', { exact: true }) })
      .last()
      .locator('p')
      .last();
    this.botaoFinalizarPedido = page.getByRole('button', { name: /finalizar pedido/i });
    this.mensagemCarrinhoVazio = page.getByRole('heading', { name: 'Parece que não há nada por aqui :(' });
    this.botaoCarrinhoVazio = page.locator('main').getByRole('button');
  }

  /** Linha do item no carrinho: o menor bloco com o título e o campo de quantidade. */
  item(titulo: string): Locator {
    return this.page
      .locator('main div')
      .filter({ has: this.page.getByText(titulo, { exact: true }) })
      .filter({ has: this.page.locator('input[type="number"]') })
      .last();
  }

  campoQuantidade(titulo: string): Locator {
    return this.item(titulo).locator('input[type="number"]');
  }

  async aumentarQuantidade(titulo: string, vezes = 1): Promise<void> {
    for (let i = 0; i < vezes; i++) {
      await this.item(titulo).locator('.counter button').last().click();
    }
  }

  async diminuirQuantidade(titulo: string, vezes = 1): Promise<void> {
    for (let i = 0; i < vezes; i++) {
      await this.item(titulo).locator('.counter button').first().click();
    }
  }

  async remover(titulo: string): Promise<void> {
    await this.item(titulo).locator('button.trash-btn').click();
  }

  async subtotal(titulo: string): Promise<number> {
    return paraNumero(await this.item(titulo).locator('.subtotal-column').innerText());
  }

  async valorTotal(): Promise<number> {
    return paraNumero(await this.total.innerText());
  }

  async finalizarPedido(): Promise<void> {
    await this.botaoFinalizarPedido.click();
  }

  async deveEstarVazio(): Promise<void> {
    await expect(this.mensagemCarrinhoVazio).toBeVisible();
    await expect(this.botaoFinalizarPedido).toHaveCount(0);
  }
}
