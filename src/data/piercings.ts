// Catálogo de furos da Tali. Para adicionar, remover ou corrigir um furo, edite só este arquivo.
// As coordenadas (pontos) usam o desenho de referência de 200 × 260 de cada base.

export type Regiao = "orelha" | "nariz" | "boca" | "rosto" | "corpo" | "intimo";
export type Base = "orelha" | "rosto" | "corpo";
export type Joia = "stud" | "barra" | "argola";
export type Ponto = readonly [number, number];

export interface Piercing {
  id: string;
  nome: string;
  aka?: string;
  regiao: Regiao;
  /** Tempo médio de cicatrização. */
  cicatrizacao: string;
  /** Joia usada no furo novo. */
  joiaInicial: string;
  /** Como a joia é desenhada na ilustração. */
  joia?: Joia;
  /** Onde a joia aparece no desenho. */
  pontos?: readonly Ponto[];
  /** Onde fica o marcador clicável no mapa (padrão: o primeiro ponto). */
  marcador?: Ponto;
  nota?: string;
}

export interface Foto {
  src: string;
  alt: string;
  legenda: string;
  w: number;
  h: number;
  /** ids dos furos que aparecem na foto */
  furos: readonly string[];
}

export const REGIOES: Record<Regiao, { nome: string; base?: Base }> = {
  orelha: { nome: "orelha", base: "orelha" },
  nariz: { nome: "nariz", base: "rosto" },
  boca: { nome: "boca", base: "rosto" },
  rosto: { nome: "rosto", base: "rosto" },
  corpo: { nome: "corpo", base: "corpo" },
  intimo: { nome: "íntimos" },
};

const STUD = "labret de titânio com rosca interna";
const BARRA = "barbell de titânio";
const ARGOLA = "argola segmentada de titânio";

export const PIERCINGS: readonly Piercing[] = [
  // ---------- orelha ----------
  { id: "lobulo", nome: "lóbulo", aka: "o clássico", regiao: "orelha", cicatrizacao: "6 a 8 semanas", joiaInicial: STUD, pontos: [[104, 236]] },
  { id: "lobulo-alto", nome: "lóbulo alto", aka: "segundo e terceiro furo", regiao: "orelha", cicatrizacao: "2 a 3 meses", joiaInicial: STUD, pontos: [[118, 222]] },
  { id: "helix", nome: "helix", aka: "cartilagem da borda", regiao: "orelha", cicatrizacao: "6 a 12 meses", joiaInicial: STUD, pontos: [[170, 46]] },
  { id: "helix-frontal", nome: "helix frontal", aka: "forward helix", regiao: "orelha", cicatrizacao: "6 a 12 meses", joiaInicial: STUD, pontos: [[78, 54]] },
  { id: "flat", nome: "flat", regiao: "orelha", cicatrizacao: "6 a 12 meses", joiaInicial: STUD, pontos: [[140, 50]] },
  { id: "rook", nome: "rook", regiao: "orelha", cicatrizacao: "6 a 12 meses", joiaInicial: BARRA, joia: "barra", pontos: [[122, 62], [128, 76]] },
  { id: "daith", nome: "daith", regiao: "orelha", cicatrizacao: "6 a 12 meses", joiaInicial: ARGOLA, joia: "argola", pontos: [[100, 104]] },
  { id: "tragus", nome: "tragus", regiao: "orelha", cicatrizacao: "6 a 12 meses", joiaInicial: STUD, pontos: [[80, 145]] },
  { id: "antitragus", nome: "antitragus", regiao: "orelha", cicatrizacao: "6 a 12 meses", joiaInicial: STUD, pontos: [[128, 184]] },
  { id: "conch", nome: "conch", aka: "concha", regiao: "orelha", cicatrizacao: "6 a 12 meses", joiaInicial: STUD, pontos: [[122, 140]] },
  { id: "snug", nome: "snug", regiao: "orelha", cicatrizacao: "6 a 12 meses", joiaInicial: BARRA, joia: "barra", pontos: [[154, 122], [148, 140]] },
  { id: "industrial", nome: "industrial", aka: "dois furos, uma barra", regiao: "orelha", cicatrizacao: "9 a 12 meses", joiaInicial: BARRA, joia: "barra", pontos: [[170, 46], [80, 56]], marcador: [124, 51] },

  // ---------- nariz ----------
  { id: "nostril", nome: "nostril", aka: "furo na asa do nariz", regiao: "nariz", cicatrizacao: "4 a 6 meses", joiaInicial: STUD, pontos: [[84, 152]] },
  { id: "high-nostril", nome: "high nostril", regiao: "nariz", cicatrizacao: "4 a 6 meses", joiaInicial: STUD, pontos: [[89, 136]] },
  { id: "septo", nome: "septo", regiao: "nariz", cicatrizacao: "2 a 3 meses", joiaInicial: ARGOLA, joia: "argola", pontos: [[100, 164]] },
  { id: "bridge", nome: "bridge", aka: "entre os olhos", regiao: "nariz", cicatrizacao: "2 a 3 meses", joiaInicial: BARRA, joia: "barra", pontos: [[92, 106], [108, 106]] },

  // ---------- boca ----------
  { id: "medusa", nome: "medusa", aka: "philtrum", regiao: "boca", cicatrizacao: "2 a 3 meses", joiaInicial: STUD, pontos: [[100, 172]] },
  { id: "monroe", nome: "monroe / madonna", aka: "pintinha acima do lábio", regiao: "boca", cicatrizacao: "2 a 3 meses", joiaInicial: STUD, pontos: [[78, 172]] },
  { id: "angel-bites", nome: "angel bites", aka: "monroe + madonna", regiao: "boca", cicatrizacao: "2 a 3 meses", joiaInicial: STUD, pontos: [[112, 176], [88, 176]] },
  { id: "smiley", nome: "smiley", aka: "freio do lábio superior", regiao: "boca", cicatrizacao: "1 a 3 meses", joiaInicial: ARGOLA, joia: "argola", pontos: [[100, 186]], nota: "depende da anatomia: precisa de um freio bem formado." },
  { id: "lingua", nome: "língua", regiao: "boca", cicatrizacao: "1 a 2 meses", joiaInicial: BARRA, pontos: [[100, 196]] },
  { id: "labret-vertical", nome: "labret vertical", regiao: "boca", cicatrizacao: "2 a 3 meses", joiaInicial: "barra curva de titânio", joia: "barra", pontos: [[100, 206], [100, 196]] },
  { id: "labret", nome: "labret", aka: "abaixo do lábio", regiao: "boca", cicatrizacao: "2 a 3 meses", joiaInicial: STUD, pontos: [[100, 220]] },
  { id: "snake-bites", nome: "snake bites", regiao: "boca", cicatrizacao: "2 a 3 meses", joiaInicial: STUD, pontos: [[115, 213], [85, 213]] },
  { id: "spider-bites", nome: "spider bites", regiao: "boca", cicatrizacao: "2 a 3 meses", joiaInicial: STUD, pontos: [[79, 214], [87, 214]] },

  // ---------- rosto ----------
  { id: "sobrancelha", nome: "sobrancelha", regiao: "rosto", cicatrizacao: "2 a 3 meses", joiaInicial: "barra curva de titânio", joia: "barra", pontos: [[143, 83], [145, 99]] },
  { id: "anti-sobrancelha", nome: "anti-sobrancelha", aka: "acima da maçã do rosto", regiao: "rosto", cicatrizacao: "2 a 3 meses", joiaInicial: "barra curva de titânio", joia: "barra", pontos: [[141, 124], [131, 130]] },
  { id: "dimple", nome: "bochecha", aka: "dimple", regiao: "rosto", cicatrizacao: "3 a 6 meses", joiaInicial: STUD, pontos: [[138, 168], [62, 168]] },

  // ---------- corpo ----------
  { id: "umbigo", nome: "umbigo", regiao: "corpo", cicatrizacao: "6 a 12 meses", joiaInicial: "barra curva de titânio", joia: "barra", pontos: [[100, 178], [100, 196]] },
  { id: "mamilo", nome: "mamilo", regiao: "corpo", cicatrizacao: "6 a 12 meses", joiaInicial: BARRA, joia: "barra", pontos: [[66, 117], [86, 117]] },
  { id: "microdermal", nome: "microdermal", aka: "ponto único em qualquer lugar", regiao: "corpo", cicatrizacao: "2 a 3 meses", joiaInicial: "base de titânio + topo rosqueado", pontos: [[100, 72]] },

  // ---------- íntimos ----------
  { id: "intimos", nome: "íntimos", aka: "com hora marcada e total discrição", regiao: "intimo", cicatrizacao: "varia conforme o furo", joiaInicial: "definida na conversa", nota: "me chama no whatsapp pra gente conversar sobre anatomia e qual furo faz sentido pra você." },
];

export const FOTOS: readonly Foto[] = [
  { src: "img/trabalho-curadoria.webp", alt: "Orelha com curadoria completa: industrial com spikes, helix, flat de coração vermelho, daith com argola cravejada, dois microdermais e lóbulos com caveira, argolas e corrente", legenda: "curadoria completa", w: 900, h: 1125, furos: ["industrial", "daith", "flat", "helix", "microdermal", "lobulo", "lobulo-alto"] },
  { src: "img/trabalho-labret-septo.webp", alt: "Labret vertical lateral com bolinhas de titânio no lábio inferior e septo com argola preta de spikes", legenda: "labret vertical + septo", w: 900, h: 1125, furos: ["labret-vertical", "septo"] },
  { src: "img/trabalho-flat-helix.webp", alt: "Flat com joia de coração azul e helix com zircônia", legenda: "flat de coração + helix", w: 900, h: 1125, furos: ["flat", "helix"] },
  { src: "img/trabalho-umbigo.webp", alt: "Piercing de umbigo com pingente de pedras", legenda: "umbigo com pingente", w: 900, h: 1125, furos: ["umbigo"] },
  { src: "img/trabalho-helix-argolas.webp", alt: "Dois furos de helix com argolas douradas", legenda: "helix duplo com argolas", w: 900, h: 1126, furos: ["helix"] },
  { src: "img/trabalho-microdermal.webp", alt: "Microdermal no colo, com topo de pedra", legenda: "microdermal no colo", w: 900, h: 1125, furos: ["microdermal"] },
  { src: "img/trabalho-helix-corrente.webp", alt: "Helix com corrente ligando dois furos e dois microdermais na frente da orelha", legenda: "helix com corrente + microdermais", w: 900, h: 1125, furos: ["helix", "microdermal"] },
  { src: "img/labret-vertical.webp", alt: "Labret vertical com bolinhas de titânio e nostril com argola preta", legenda: "labret vertical + nostril", w: 645, h: 691, furos: ["labret-vertical", "nostril"] },
  { src: "img/nostril-septum.webp", alt: "Nostril com spike, septo com joia de folhas, angel bites e snake bites com spikes", legenda: "spikes por todo lado", w: 582, h: 802, furos: ["nostril", "septo", "angel-bites", "snake-bites"] },
  { src: "img/ear-curation.webp", alt: "Curadoria de orelha com industrial, joias com zircônias, luas e estrelas", legenda: "curadoria de orelha", w: 582, h: 705, furos: ["industrial", "conch", "lobulo", "lobulo-alto"] },
  { src: "img/oii-tali.webp", alt: "Post de apresentação: Oii, eu sou a Tali Piercer, body piercer desde 2021, mãozinha de fada", legenda: "oii, eu sou a tali", w: 700, h: 875, furos: [] },
];

export const WHATSAPP = "5567998209137";

export const whatsLink = (texto: string): string =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
