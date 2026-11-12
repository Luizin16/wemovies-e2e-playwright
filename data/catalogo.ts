/**
 * Catálogo exibido pela aplicação (fonte: API /api/movies consumida pela Home).
 * Usado para calcular os valores esperados nos testes, em vez de fixar totais no código.
 */
export const FILMES = {
  VIUVA_NEGRA: { titulo: 'Viúva Negra', preco: 9.99 },
  SHANG_CHI: { titulo: 'Shang-chi', preco: 30.99 },
  HOMEM_ARANHA: { titulo: 'Homem Aranha', preco: 29.9 },
  MORBIUS: { titulo: 'Morbius', preco: 1.5 },
  BATMAN: { titulo: 'Batman', preco: 21.9 },
  ETERNOS: { titulo: 'Eternos', preco: 17.9 },
} as const;

export type Filme = (typeof FILMES)[keyof typeof FILMES];
