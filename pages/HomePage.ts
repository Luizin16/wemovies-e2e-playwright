import { expect, type Locator, type Page } from '@playwright/test';
import { Cabecalho } from './Cabecalho';

/** Tela de listagem dos filmes. */
export class HomePage {
  readonly cabecalho: Cabecalho;
  readonly titulosDosFilmes: Locator;

  constructor(private readonly page: Page) {
    this.cabecalho = new Cabecalho(page);
    this.titulosDosFilmes = page.locator('main').getByRole('heading', { level: 3 });
  }

  async abrir(): Promise<void> {
    await this.page.goto('/');
    await expect(this.titulosDosFilmes.first()).toBeVisible();
  }

  card(titulo: string): Locator {
    return this.page
      .locator('main div')
      .filter({ has: this.page.getByRole('heading', { name: titulo, exact: true }) })
      .last();
  }

  botaoAdicionar(titulo: string): Locator {
    return this.card(titulo).getByRole('button', { name: /adicionar ao carrinho/i });
  }

  async adicionarAoCarrinho(titulo: string, vezes = 1): Promise<void> {
    for (let i = 0; i < vezes; i++) {
      await this.botaoAdicionar(titulo).click();
    }
  }

  async quantidadeNoBotao(titulo: string): Promise<number> {
    const texto = await this.botaoAdicionar(titulo).innerText();
    return Number(texto.match(/\d+/)?.[0]);
  }
}
