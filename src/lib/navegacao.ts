export const abas = [
  { to: "/", label: "Início" },
  { to: "/confirmar-presenca", label: "Confirmar presença" },
  { to: "/mensagem", label: "Mensagem" },
  { to: "/recadinhos", label: "Recadinhos" },
  { to: "/presentes", label: "Presentes" },
  { to: "/localizacao", label: "Localização" },
] as const;

export type AbaPath = (typeof abas)[number]["to"];

export function indiceDaRota(pathname: string): number {
  const limpo = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  return abas.findIndex((a) => a.to === limpo);
}
