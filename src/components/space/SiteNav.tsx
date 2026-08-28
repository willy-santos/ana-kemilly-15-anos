import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import { abas } from "@/lib/navegacao";

export function SiteNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const listaRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const ativo = listaRef.current?.querySelector<HTMLElement>('[data-status="active"]');
    ativo?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:pt-4">
      <nav className="glass-panel mx-auto max-w-3xl rounded-full">
        <ul
          ref={listaRef}
          className="no-scrollbar flex items-center gap-1 overflow-x-auto scroll-smooth px-1.5 py-1.5 sm:justify-center"
        >
          {abas.map((aba) => (
            <li key={aba.to} className="shrink-0">
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
