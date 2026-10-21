// Depoimentos da seção "feedbacks".
// ATENÇÃO: os três abaixo são textos de EXEMPLO, só para apresentar o layout.
// Troque pelos feedbacks reais da Tali (prints do destaque "feedbacks") e mude `exemplo` para false.

export interface Depoimento {
  texto: string;
  /** Quem escreveu (ex.: "@usuario" ou primeiro nome, com autorização). */
  autor: string;
  /** Furo que a pessoa fez, ligado ao catálogo (id de src/data/piercings.ts). */
  furo?: string;
  exemplo: boolean;
}

export const DEPOIMENTOS: readonly Depoimento[] = [
  {
    texto: "mãozinha de fada é pouco! eu tava morrendo de medo e quando vi já tinha acabado. nem senti direito o furo do helix 🧚",
    autor: "cliente de exemplo",
    furo: "helix",
    exemplo: true,
  },
  {
    texto: "ela explica tudo com muita calma, abriu a agulha e a joia na minha frente e me deixou super tranquila. dá pra ver o cuidado com a biossegurança em cada detalhe.",
    autor: "cliente de exemplo",
    furo: "septo",
    exemplo: true,
  },
  {
    texto: "primeira vez que um piercing meu cicatriza sem drama. a joia de titânio é linda e não deu alergia nenhuma, já tô planejando o próximo 💗",
    autor: "cliente de exemplo",
    furo: "conch",
    exemplo: true,
  },
];
