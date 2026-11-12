import { type Locator, type Page } from '@playwright/test';

/** Cabeçalho presente em todas as telas: logo e acesso ao carrinho. */
export class Cabecalho {
  readonly logo: Locator;
  readonly botaoCarrinho: Locator;
  readonly quantidadeDeItens: Locator;

  constructor(page: Page) {
    const header = page.locator('header');
    this.logo = header.getByRole('link', { name: 'WeMovies' });
    this.botaoCarrinho = header.getByRole('button');
    this.quantidadeDeItens = header.getByText(/^\d+ ite(m|ns)$/);
  }

  async abrirCarrinho(): Promise<void> {
    await this.botaoCarrinho.click();
  }

  /** Texto esperado no cabeçalho: "1 item" ou "N itens". */
  static textoQuantidade(total: number): string {
    return total === 1 ? '1 item' : `${total} itens`;
  }
}
