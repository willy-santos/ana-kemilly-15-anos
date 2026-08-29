
import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import { abas, indiceDaRota } from "@/lib/navegacao";

export function SiteNav() {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  const listaRef = useRef<HTMLUListElement>(null);
  const itensRef = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
  const lista = listaRef.current;
  const indice = indiceDaRota(pathname);

  if (!lista || indice < 0) return;

  const item = itensRef.current[indice];

  if (!item) return;

  const atualizar = () => {
    // Home sempre começa no início.
    if (indice === 0) {
      lista.scrollTo({
        left: 0,
        behavior: "smooth",
      });
      return;
    }

    const itemLeft = item.offsetLeft;
    const itemRight = itemLeft + item.offsetWidth;

    const visibleLeft = lista.scrollLeft;
    const visibleRight = visibleLeft + lista.clientWidth;

    const margem = 16;

    // Se já está totalmente visível, não mexe.
    if (
      itemLeft >= visibleLeft + margem &&
      itemRight <= visibleRight - margem
    ) {
      return;
    }

    // Se está fora da área visível, posiciona a aba no centro.
    const centroDoItem = itemLeft + item.offsetWidth / 2;
    const novoScroll =
      centroDoItem - lista.clientWidth / 2;

    const maxScroll =
      lista.scrollWidth - lista.clientWidth;

    lista.scrollTo({
      left: Math.max(0, Math.min(novoScroll, maxScroll)),
      behavior: "smooth",
    });
  };

  // Espera o layout terminar antes de calcular as posições.
  requestAnimationFrame(() => {
    requestAnimationFrame(atualizar);
  });
}, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:pt-4">
      <nav className="glass-panel mx-auto w-full max-w-[calc(100vw-1.5rem)] rounded-full">
       <ul
  ref={listaRef}
  className="no-scrollbar flex w-full touch-pan-x items-center gap-1 overflow-x-auto overscroll-x-contain scroll-smooth px-1.5 py-1.5 sm:justify-center"
>
          {abas.map((aba, index) => (
            <li
              key={aba.to}
              ref={(element) => {
                itensRef.current[index] = element;
              }}
              className="shrink-0"
            >
              <Link
                to={aba.to}
                activeOptions={{ exact: aba.to === "/" }}
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
      </nav>
    </header>
  );
}
