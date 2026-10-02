import { Link, useRouterState } from "@tanstack/react-router";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { abas, indiceDaRota } from "@/lib/navegacao";

export function SiteNav() {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  const listaRef = useRef<HTMLUListElement>(null);
  const itensRef = useRef<(HTMLLIElement | null)[]>([]);

  const [posicaoAviso, setPosicaoAviso] = useState<number | null>(null);
  const [temMaisAbas, setTemMaisAbas] = useState(false);
  const [confirmacaoFeita, setConfirmacaoFeita] = useState(false);

  const arrastandoRef = useRef(false);
  const animacaoRef = useRef<number | null>(null);
  const ultimaRotaRef = useRef(pathname);

  /**
   * Cancela qualquer animação de scroll pendente.
   */
  const cancelarAnimacao = () => {
    if (animacaoRef.current !== null) {
      cancelAnimationFrame(animacaoRef.current);
      animacaoRef.current = null;
    }
  };

  /**
   * Calcula a posição ideal de uma aba.
   *
   * A aba fica centralizada sempre que houver espaço.
   * Nas extremidades, respeita os limites naturais da barra.
   */
  const calcularScrollDaAba = (indice: number) => {
    const lista = listaRef.current;
    const item = itensRef.current[indice];

    if (!lista || !item) return null;

    const maxScroll = Math.max(
      0,
      lista.scrollWidth - lista.clientWidth,
    );

    const centroItem =
      item.offsetLeft + item.offsetWidth / 2;

    const centroLista =
      lista.clientWidth / 2;

    const alvo = centroItem - centroLista;

    return Math.max(
      0,
      Math.min(alvo, maxScroll),
    );
  };

  /**
   * Faz uma transição curta e controlada do scroll.
   *
   * Não utiliza scrollTo({ behavior: "smooth" }),
   * porque esse smooth pode continuar rodando enquanto
   * o usuário troca rapidamente de rota.
   */
  const animarPara = (destino: number) => {
    const lista = listaRef.current;

    if (!lista) return;

    cancelarAnimacao();

    const inicio = lista.scrollLeft;
    const distancia = destino - inicio;

    if (Math.abs(distancia) < 1) {
      lista.scrollLeft = destino;
      return;
    }

    const duracao = 180;
    const inicioTempo = performance.now();

    const executar = (agora: number) => {
      if (!lista) return;

      const progresso = Math.min(
        1,
        (agora - inicioTempo) / duracao,
      );

      /*
       * Ease-out:
       * começa rápido e desacelera suavemente.
       */
      const suavizado =
        1 - Math.pow(1 - progresso, 3);

      lista.scrollLeft =
        inicio + distancia * suavizado;

      if (progresso < 1) {
        animacaoRef.current =
          requestAnimationFrame(executar);
      } else {
        lista.scrollLeft = destino;
        animacaoRef.current = null;
      }
    };

    animacaoRef.current =
      requestAnimationFrame(executar);
  };

  /**
   * Posiciona a aba ativa quando a rota muda.
   *
   * Existe apenas UMA rotina responsável por isso.
   */
  useLayoutEffect(() => {
    const lista = listaRef.current;
    const indice = indiceDaRota(pathname);

    if (!lista || indice < 0) return;

    /*
     * Se ainda for a mesma rota, não faz nada.
     */
    if (ultimaRotaRef.current === pathname) return;

    ultimaRotaRef.current = pathname;

    /*
     * Nunca tenta animar enquanto o usuário está
     * arrastando a barra.
     */
    if (arrastandoRef.current) {
      cancelarAnimacao();
      return;
    }

    /*
     * Espera o DOM terminar de atualizar a classe
     * da aba ativa antes de calcular as dimensões.
     */
    const frame = requestAnimationFrame(() => {
      if (arrastandoRef.current) return;

      const destino = calcularScrollDaAba(indice);

      if (destino === null) return;

      animarPara(destino);
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  /**
   * Limpa animação quando o componente desmontar.
   */
  useEffect(() => {
    return () => {
      cancelarAnimacao();
    };
  }, []);

  /**
   * Arraste horizontal da barra.
   *
   * Durante o arraste:
   * - cancela animação existente;
   * - controla diretamente o scroll;
   * - não usa smooth.
   */
  useEffect(() => {
    const lista = listaRef.current;

    if (!lista) return;

    let inicioX = 0;
    let scrollInicial = 0;
    let houveMovimento = false;
    let pointerIdAtivo: number | null = null;

    const iniciarArraste = (event: PointerEvent) => {
      if (
        event.pointerType === "mouse" &&
        event.button !== 0
      ) {
        return;
      }

      cancelarAnimacao();

      arrastandoRef.current = true;
      pointerIdAtivo = event.pointerId;

      inicioX = event.clientX;
      scrollInicial = lista.scrollLeft;
      houveMovimento = false;

      lista.setPointerCapture?.(
        event.pointerId,
      );
    };

    const acompanharArraste = (event: PointerEvent) => {
      if (
        !arrastandoRef.current ||
        pointerIdAtivo !== event.pointerId
      ) {
        return;
      }

      const deslocamento =
        event.clientX - inicioX;

      if (Math.abs(deslocamento) > 6) {
        houveMovimento = true;
      }

      lista.scrollLeft =
        scrollInicial - deslocamento;
    };

    const finalizarArraste = (event: PointerEvent) => {
      if (
        !arrastandoRef.current ||
        pointerIdAtivo !== event.pointerId
      ) {
        return;
      }

      arrastandoRef.current = false;

      try {
        if (
          lista.hasPointerCapture(event.pointerId)
        ) {
          lista.releasePointerCapture(
            event.pointerId,
          );
        }
      } catch {
        // Ponteiro já liberado pelo navegador.
      }

      pointerIdAtivo = null;

      /*
       * Se foi apenas um clique, não altera o scroll.
       */
      if (!houveMovimento) {
        houveMovimento = false;
        return;
      }

      /*
       * Depois do arraste, encaixa suavemente
       * na aba mais próxima do centro.
       */
      const centroLista =
        lista.scrollLeft +
        lista.clientWidth / 2;

      let melhorIndice = 0;
      let menorDistancia = Infinity;

      itensRef.current.forEach(
        (item, indice) => {
          if (!item) return;

          const centroItem =
            item.offsetLeft +
            item.offsetWidth / 2;

          const distancia = Math.abs(
            centroItem - centroLista,
          );

          if (
            distancia < menorDistancia
          ) {
            menorDistancia = distancia;
            melhorIndice = indice;
          }
        },
      );

      const destino =
        calcularScrollDaAba(melhorIndice);

      if (destino !== null) {
        animarPara(destino);
      }

      houveMovimento = false;
    };

    const cancelarArrasteEvento = () => {
      arrastandoRef.current = false;
      houveMovimento = false;
      pointerIdAtivo = null;
      cancelarAnimacao();
    };

    lista.addEventListener(
      "pointerdown",
      iniciarArraste,
    );

    lista.addEventListener(
      "pointermove",
      acompanharArraste,
    );

    lista.addEventListener(
      "pointerup",
      finalizarArraste,
    );

    lista.addEventListener(
      "pointercancel",
      cancelarArrasteEvento,
    );

    return () => {
      lista.removeEventListener(
        "pointerdown",
        iniciarArraste,
      );

      lista.removeEventListener(
        "pointermove",
        acompanharArraste,
      );

      lista.removeEventListener(
        "pointerup",
        finalizarArraste,
      );

      lista.removeEventListener(
        "pointercancel",
        cancelarArrasteEvento,
      );
    };
  }, []);

  /**
   * Verifica se a confirmação foi concluída.
   */
  useEffect(() => {
    const verificarConfirmacao = () => {
      const confirmada =
        sessionStorage.getItem(
          "confirmacaoWhatsapp",
        ) === "concluida";

      setConfirmacaoFeita(confirmada);
    };

    verificarConfirmacao();

    const aoVoltarParaOSite = () => {
      if (
        document.visibilityState === "visible"
      ) {
        verificarConfirmacao();
      }
    };

    document.addEventListener(
      "visibilitychange",
      aoVoltarParaOSite,
    );

    window.addEventListener(
      "pageshow",
      aoVoltarParaOSite,
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        aoVoltarParaOSite,
      );

      window.removeEventListener(
        "pageshow",
        aoVoltarParaOSite,
      );
    };
  }, []);

  /**
   * Atualiza posição do balão de confirmação.
   */
  useEffect(() => {
    const atualizarAviso = () => {
      const lista = listaRef.current;

      if (!lista) return;

      const indiceConfirmacao =
        abas.findIndex(
          (aba) =>
            aba.to ===
            "/confirmar-presenca",
        );

      if (indiceConfirmacao < 0) return;

      const item =
        itensRef.current[
          indiceConfirmacao
        ];

      if (!item) return;

      const rect =
        item.getBoundingClientRect();

      const listaRect =
        lista.getBoundingClientRect();

      setPosicaoAviso(
        rect.left +
          rect.width / 2 -
          listaRect.left,
      );
    };

    atualizarAviso();

    window.addEventListener(
      "resize",
      atualizarAviso,
    );

    const lista = listaRef.current;

    lista?.addEventListener(
      "scroll",
      atualizarAviso,
      { passive: true },
    );

    return () => {
      window.removeEventListener(
        "resize",
        atualizarAviso,
      );

      lista?.removeEventListener(
        "scroll",
        atualizarAviso,
      );
    };
  }, []);

  /**
   * Detecta se ainda existem abas à direita.
   */
  useEffect(() => {
    const lista = listaRef.current;

    if (!lista) return;

    const atualizarIndicador = () => {
      const temOverflow =
        lista.scrollWidth >
        lista.clientWidth + 2;

      const chegouAoFim =
        lista.scrollLeft +
          lista.clientWidth >=
        lista.scrollWidth - 2;

      setTemMaisAbas(
        temOverflow && !chegouAoFim,
      );
    };

    atualizarIndicador();

    lista.addEventListener(
      "scroll",
      atualizarIndicador,
      { passive: true },
    );

    window.addEventListener(
      "resize",
      atualizarIndicador,
    );

    return () => {
      lista.removeEventListener(
        "scroll",
        atualizarIndicador,
      );

      window.removeEventListener(
        "resize",
        atualizarIndicador,
      );
    };
  }, []);

  return (
    <header className="absolute inset-x-0 top-0 z-50 px-3 pt-3 sm:pt-4">
      <nav className="relative glass-panel mx-auto w-full max-w-[calc(100vw-1.5rem)] rounded-full">
        <ul
          ref={listaRef}
          className="no-scrollbar flex w-full touch-pan-x items-center gap-1 overflow-x-auto overscroll-x-contain px-1.5 py-1.5 sm:justify-center"
        >
          {abas.map((aba, index) => (
            <li
              key={aba.to}
              ref={(element) => {
                itensRef.current[index] =
                  element;
              }}
              className="shrink-0"
            >
              <Link
                to={aba.to}
                activeOptions={{
                  exact: aba.to === "/",
                }}
                activeProps={{
                  className:
                    "bg-primary/20 text-foreground glow-soft border-primary/30",
                }}
                inactiveProps={{
                  className:
                    "border-transparent text-muted-foreground hover:text-foreground hover:bg-primary/10",
                }}
                className="block whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[0.78rem] tracking-[0.08em] transition-colors sm:text-sm"
              >
                {aba.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Indicador de mais abas */}
        {temMaisAbas && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-2 top-1/2 z-20 -translate-y-1/2 sm:hidden"
          >
            <div className="flex size-7 items-center justify-center rounded-full border border-primary/25 bg-background/25 backdrop-blur-sm">
              <span className="animate-nav-hint -translate-x-[1px] text-lg leading-none text-primary">
                ›
              </span>
            </div>
          </div>
        )}

        {/* Balão de confirmação */}
        {posicaoAviso !== null &&
          pathname !==
            "/confirmar-presenca" &&
          !confirmacaoFeita && (
            <div
              className="pointer-events-none absolute top-full z-[70] mt-2 -translate-x-1/2 whitespace-nowrap"
              style={{
                left: `${posicaoAviso}px`,
              }}
            >
              <div className="relative rounded-xl border border-primary/20 bg-background/70 px-4 py-2 text-center shadow-[0_8px_25px_rgba(0,0,0,0.2)] backdrop-blur-xl">
                <span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rotate-45 border-l border-t border-primary/20 bg-background/70" />

                <p className="relative text-[0.68rem] font-medium tracking-[0.04em] text-foreground">
                  Confirme sua presença!
                </p>

                <p className="relative mt-0.5 flex items-center justify-center gap-1 text-[0.58rem] uppercase tracking-[0.1em] text-primary">
                  Até 1º de novembro
                </p>
              </div>
            </div>
          )}
      </nav>
    </header>
  );
}