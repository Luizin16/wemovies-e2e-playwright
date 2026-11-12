import { type Locator, type Page } from '@playwright/test';
import { Cabecalho } from './Cabecalho';
export class CompraRealizadaPage {
  readonly cabecalho: Cabecalho;
  readonly mensagemSucesso: Locator;
  readonly botaoVoltar: Locator;

  constructor(page: Page) {
    this.cabecalho = new Cabecalho(page);
    this.mensagemSucesso = page.getByRole('heading', { name: 'Compra realizada com sucesso!' });
    this.botaoVoltar = page.getByRole('button', { name: /voltar/i });
  }
}
