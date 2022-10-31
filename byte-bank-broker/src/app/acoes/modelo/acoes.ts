export interface Acoes extends Array<Acao> {}

export interface Acao {
  id: number;
  codigo: string;
  descricap: string;
  preco: number;
}

export interface AcoesAPI {
  payload: Acoes;
}
