/**
 * Dados do convite — edite APENAS este arquivo para atualizar textos,
 * informações do evento, mensagem da aniversariante e lista de presentes.
 */

export const evento = {
  aniversariante: "Ana Kemilly",
  titulo: "15 anos de Ana Kemilly",
  frase: "Uma nova órbita começa...",
  tema: "CONTAGEM REGRESSIVA INICIADA",
  diaSemana: "Domingo",
  dataTexto: "15 de Novembro de 2026",
  horaTexto: "A partir das 10:00",
  /** Data/hora oficial do evento (horário de Belém/PA, UTC-3) */
  dataISO: "2026-11-15T10:00:00-03:00",
  endereco: {
    linha1: "Passagem Jardim Brasil, 54",
    linha2: "Levilândia, Ananindeua - PA",
    cep: "66650-204",
    completo: "Passagem Jardim Brasil, 54 - Levilândia, Ananindeua - PA, 66650-204",
  },
} as const;

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  evento.endereco.completo,
)}`;

export const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
  evento.endereco.completo,
)}&output=embed`;

/**
 * Mensagem da aniversariante.
 * texto: null => o site mostra um espaço reservado.
 * Para publicar, substitua por: texto: "sua mensagem aqui".
 */
export const mensagemAniversariante: { texto: string | null } = {
  texto: `O Deus de infinitas estrelas, que conta cada uma delas e lhes dá nome... também conhece o meu coração e sabe quem eu sou.

Cheguei aos meus 15 anos! E assim como uma galáxia reúne estrelas brilhantes, eu quero reunir vocês — as pessoas mais brilhantes da minha vida — para celebrar essa nova etapa.

Que o sol brilhe, que as cores ganhem vida e que a alegria seja imensa, porque o meu dia já está completo com a presença de cada um de vocês!

Venham brilhar comigo! ✨`,
};

export type Presente = {
  nome: string;
  descricao?: string;
  imagem?: string;
  link?: string;
  status?: "disponivel" | "escolhido";
};

/** Informações para presentes. */
export const presentes: Presente[] = [
  {
    nome: "Vestuário",
    descricao: "Tamanho 36",
  },
  {
    nome: "Calçados",
    descricao: "Tamanho 37",
  },
  {
    nome: "Pix",
    descricao: "Ana Kemilly Souza da Silva · Banco PicPay · Chave Pix: 91980197356",
  },
];
