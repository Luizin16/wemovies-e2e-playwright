import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CarrinhoPage } from '../pages/CarrinhoPage';
import { CompraRealizadaPage } from '../pages/CompraRealizadaPage';

type Paginas = {
  home: HomePage;
  carrinho: CarrinhoPage;
  compraRealizada: CompraRealizadaPage;
};

/**
 * Disponibiliza os Page Objects prontos em cada teste.
 * Cada teste roda num contexto novo do navegador, então o carrinho (localStorage) começa vazio.
 */
export const test = base.extend<Paginas>({
  home: async ({ page }, use) => use(new HomePage(page)),
  carrinho: async ({ page }, use) => use(new CarrinhoPage(page)),
  compraRealizada: async ({ page }, use) => use(new CompraRealizadaPage(page)),
});

export { expect } from '@playwright/test';
