/** Converte um texto em reais ("R$ 1.234,56") para número (1234.56). */
export function paraNumero(texto: string): number {
  const limpo = texto
    .replace(/[^\d,.-]/g, '') // remove "R$", espaços e espaços não separáveis
    .replace(/\./g, '') // remove separador de milhar
    .replace(',', '.'); // vírgula decimal vira ponto
  return Number(limpo);
}

/** Soma valores monetários evitando erro de ponto flutuante (ex.: 0.1 + 0.2). */
export function somar(...valores: number[]): number {
  const centavos = valores.reduce((total, valor) => total + Math.round(valor * 100), 0);
  return centavos / 100;
}

/** Calcula preço × quantidade em centavos para não acumular erro de arredondamento. */
export function multiplicar(preco: number, quantidade: number): number {
  return (Math.round(preco * 100) * quantidade) / 100;
}
