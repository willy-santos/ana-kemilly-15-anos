import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { abas, indiceDaRota } from "@/lib/navegacao";

const LIMIAR = 35;

/** Elementos onde o arrasto não deve iniciar a navegação. */
const IGNORAR =
  "input, textarea, select, button, a, [contenteditable], [data-no-swipe]";

export function SwipeNavigator({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const pathname = useRouterState({
  select: (s) => s.location.pathname,
});

  const indice = indiceDaRota(pathname);
  const indiceAnterior = useRef(indice);

  const [direcao, setDirecao] = useState<
    "avancar" | "voltar" | null
  >(null);

  useEffect(() => {
    if (indice < 0) {
      indiceAnterior.current = indice;
      return;
    }

    if (
      indiceAnterior.current >= 0 &&
      indiceAnterior.current !== indice
    ) {
      setDirecao(
        indice > indiceAnterior.current ? "avancar" : "voltar",
      );
    }

    indiceAnterior.current = indice;
  }, [indice]);

  const inicio = useRef<{
    x: number;
    y: number;
    valido: boolean;
    navegou: boolean;
  } | null>(null);

  function irPara(delta: number) {
    if (indice < 0) return;

    const alvo = indice + delta;

    if (alvo < 0 || alvo >= abas.length) return;

    navigate({
      to: abas[alvo]!.to,
    });
  }

  function onPointerDown(e: React.PointerEvent) {
    if (e.pointerType === "mouse" && e.button !== 0) return;

    const alvo = e.target as HTMLElement;

    inicio.current = {
      x: e.clientX,
      y: e.clientY,
      valido: !alvo.closest(IGNORAR),
      navegou: false,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    const partida = inicio.current;

    if (!partida || !partida.valido || partida.navegou) return;

    const dx = e.clientX - partida.x;
    const dy = e.clientY - partida.y;

    // Ignora movimentos predominantemente verticais.
    if (Math.abs(dx) <= Math.abs(dy) * 1.2) return;

    // Ainda não passou do limite.
    if (Math.abs(dx) < LIMIAR) return;

    // direita → esquerda = avançar
    // esquerda → direita = voltar
    const delta = dx < 0 ? 1 : -1;

    const alvo = indice + delta;

    // Não navega se já estiver na primeira/última aba.
    if (alvo < 0 || alvo >= abas.length) {
      partida.navegou = true;
      return;
    }

    // Evita disparar novamente durante o mesmo gesto.
    partida.navegou = true;

    irPara(delta);
  }

  function finalizarGesto() {
    inicio.current = null;
  }

  return (
  <div
    onPointerDown={onPointerDown}
    onPointerMove={onPointerMove}
    onPointerUp={finalizarGesto}
    onPointerCancel={finalizarGesto}
    className="min-h-screen touch-pan-y overflow-x-hidden"
  >
    <div>
      {children}
    </div>
  </div>
);
}