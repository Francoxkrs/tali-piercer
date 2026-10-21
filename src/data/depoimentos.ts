// Feedbacks reais de clientes, respostas ao story da Tali (destaque "feedbacks", set/2025).
// Os textos estão do jeitinho que chegaram. Por privacidade, sem @ nem nome de quem escreveu.
// Para assinar um feedback, preencha `autor` (só com autorização da pessoa).

export interface Depoimento {
  texto: string;
  /** Trecho do texto que ganha marca-texto (precisa aparecer igualzinho no texto). */
  destaque?: string;
  /** Quem escreveu (ex.: "@usuario" ou primeiro nome, só com autorização). Vazio não aparece. */
  autor?: string;
  /** Furo que a pessoa fez, ligado ao catálogo (id de src/data/piercings.ts). */
  furo?: string;
}

export const DEPOIMENTOS: readonly Depoimento[] = [
  {
    texto: "Você sem dúvidas foi parte essencial na construção da minha autoestima, cada projeto montado com tanto carinho visando sempre o conforto e anatomia. Perfuro contigo há um bom tempo e é muito legal ver você sempre buscando melhorar cada vez mais tanto em técnica como no material, isso mostra como você se preocupa com o bem estar de cada cliente 🥹❤️",
    destaque: "parte essencial na construção da minha autoestima",
  },
  {
    texto: "simplesmente maravilhosa, amo seu trabalho, a tranquilidade que vc passa na hora da perfuração, não vejo a hora de colocar varios piercing com vc!!! você manda muito!!",
    destaque: "a tranquilidade que vc passa na hora da perfuração",
  },
  {
    texto: "Eu furei o medusa com você já faz alguns anos, antes de colocar eu tava bem ansiosa e com medo de não gostar depois mas hoje eu simplesmente não me reconheço mais sem ele, sem contar que vc foi uma maravilhosa o atendimento todo",
    destaque: "hoje eu simplesmente não me reconheço mais sem ele",
    furo: "medusa",
  },
  {
    texto: "as perfurações que eu fiz com vc simplesmente deram o brilho que faltava pro meu visual e eu sinto como estivesse completo mesmo, não me vejo mais sem os piercings, sempre foi meu sonho e vc realizou 🫶",
    destaque: "deram o brilho que faltava pro meu visual",
  },
  {
    texto: "Tali vc eh incrível demaaaais, amei vc, minha perfuração tá bem cuidada por causa das sua dicas, a perfuração me deixou muito feliz, era algo que eu queria a muito tempo e vc realizou minha vontade, vc merece um reconhecimento enorme, muito obrigada por me proporcionar uma perfuração tranquila ❤️❤️",
    destaque: "minha perfuração tá bem cuidada por causa das sua dicas",
  },
  {
    texto: "Eu AMO seu trabalho Thali, me sinto tão a vontade nas suas mãos. Obrigado por fazer o que faz com tanto carinho 💗",
    destaque: "me sinto tão a vontade nas suas mãos",
  },
];
