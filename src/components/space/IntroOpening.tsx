import { useEffect, useRef, useState, type RefObject } from "react";
import { useRouter } from "@tanstack/react-router";

import astronauta from "@/assets/astronauta.png";
import { evento } from "@/data/convite";

/** Mesmo gerador determinístico do SpaceBackground, com outra semente. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const rand = seeded(1511);
const estrelas = Array.from({ length: 42 }, () => ({
  left: rand() * 100,
  top: rand() * 100,
  size: 1 + rand() * 2.1,
  delay: 0.2 + rand() * 1.4,
  duration: 3 + rand() * 4,
}));

/** A entrada do nome termina aos ~4,35s; a transição começa após uma pausa curta. */
const INICIO_MORPH = 7250;
const DURACAO_MORPH = 1250;
const SUAVE = "cubic-bezier(0.22, 1, 0.36, 1)";

type Props = {
  /** Título "ANA KEMILLY" já renderizado na Home (destino da transição). */
  alvoTitulo: RefObject<HTMLElement | null>;
  /** Linha "15 ANOS" da Home (destino da transição). */
  alvoSubtitulo: RefObject<HTMLElement | null>;
  /** Astronauta já renderizado na Home (destino da transição). */
  alvoAstronauta: RefObject<HTMLElement | null>;
  /** Chamado quando o título começa a se mover para a Home. */
  onTransicao: () => void;
  /** Chamado quando a Home assume o título definitivamente. */
  onFim: () => void;
};

/**
 * Abertura suave do convite, exibida uma vez antes da Home.
 * Reutiliza o fundo espacial do projeto (renderizado no layout raiz) —
 * esta camada apenas o escurece no início e o revela ao final, enquanto o
 * próprio título "ANA KEMILLY · 15 ANOS" desliza até a posição da Home.
 */
export function IntroOpening({
  alvoTitulo,
  alvoSubtitulo,
  alvoAstronauta,
  onTransicao,
  onFim,
}: Props) {
  const router = useRouter();
const [progresso, setProgresso] = useState(5);
const [paginasCarregadas, setPaginasCarregadas] = useState(false);
  const [encerrada, setEncerrada] = useState(false);
  const [morphing, setMorphing] = useState(false);
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const subtituloRef = useRef<HTMLParagraphElement>(null);
  const astronautaRef = useRef<HTMLImageElement>(null);

useEffect(() => {
  let cancelado = false;

  const rotas = [
    "/localizacao",
    "/mensagem",
    "/presentes",
    "/recadinhos",
  ] as const;

  async function carregarPaginas() {
    setProgresso(5);

    let concluidas = 0;

    await Promise.all(
      rotas.map(async (rota) => {
        try {
          await router.preloadRoute({ to: rota });
        } finally {
          concluidas += 1;

          if (!cancelado) {
            setProgresso(
  5 + Math.round((concluidas / rotas.length) * 45),
);
          }
        }
      }),
    );

   if (!cancelado) {
  setPaginasCarregadas(true);
  setProgresso(50);
}
  }

  carregarPaginas();

  return () => {
    cancelado = true;
  };
}, [router]);

  useEffect(() => {
    const semMovimento =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (semMovimento) {
      onTransicao();
      const t = window.setTimeout(() => {
        setEncerrada(true);
        onFim();
      }, 2200);
      return () => window.clearTimeout(t);
    }

    const morph = (origem: HTMLElement | null, destino: HTMLElement | null) => {
      if (!origem || !destino) return;
      const a = origem.getBoundingClientRect();
      const b = destino.getBoundingClientRect();
      if (!a.width || !b.width) return;
      const escala = b.width / a.width;
      const dx = b.left + b.width / 2 - (a.left + a.width / 2);
      const dy = b.top + b.height / 2 - (a.top + a.height / 2);
      origem.style.transition = `transform ${DURACAO_MORPH}ms ${SUAVE}`;
      origem.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${escala})`;
    };
let tMorph: number | undefined;
 const tInicio = window.setTimeout(() => {
  setProgresso(100);

  window.setTimeout(() => {
    setMorphing(true);
    onTransicao();

    requestAnimationFrame(() => {
      morph(tituloRef.current, alvoTitulo.current);
      morph(subtituloRef.current, alvoSubtitulo.current);

      // O astronauta sobe de baixo e termina exatamente sobre o da Home.
      const astro = astronautaRef.current;
      const alvo = alvoAstronauta.current;

      let destino: {
        left: number;
        top: number;
        width: number;
        height: number;
      } | null = null;

      if (alvo) {
        let no: HTMLElement | null = alvo;
        let top = 0;
        let left = 0;

        while (no) {
          top += no.offsetTop;
          left += no.offsetLeft;
          no = no.offsetParent as HTMLElement | null;
        }

        destino = {
          left: left - window.scrollX,
          top: top - window.scrollY,
          width: alvo.offsetWidth,
          height: alvo.offsetHeight,
        };
      }

      if (astro && destino && destino.width) {
        const distancia = Math.max(
          destino.height * 1.2,
          window.innerHeight - destino.top,
        );

        astro.style.left = `${destino.left}px`;
        astro.style.top = `${destino.top}px`;
        astro.style.width = `${destino.width}px`;
        astro.style.height = `${destino.height}px`;

        astro.style.transform =
          `translate3d(0, ${distancia}px, 0)`;

        astro.style.opacity = "0";

        requestAnimationFrame(() => {
          astro.style.willChange = "transform, opacity";

          astro.style.transition = `
            transform ${DURACAO_MORPH}ms ${SUAVE},
            opacity 500ms ease-out
          `;

          requestAnimationFrame(() => {
            astro.style.transform =
              "translate3d(0, 0, 0)";

            astro.style.opacity = "1";
          });
        });
      }
    });
  }, 800);
}, INICIO_MORPH);

return () => {
  window.clearTimeout(tInicio);

  if (tMorph !== undefined) {
    window.clearTimeout(tMorph);
  }
};
  }, [alvoTitulo, alvoSubtitulo, alvoAstronauta, onTransicao, onFim]);
useEffect(() => {
  if (!paginasCarregadas || !morphing) return;

  const t = window.setTimeout(() => {
    setEncerrada(true);
    onFim();
  }, DURACAO_MORPH);

  return () => window.clearTimeout(t);
}, [paginasCarregadas, morphing, onFim]);
  if (encerrada) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-6"
    >
      {/* Véu escuro: some suavemente enquanto o título viaja para a Home */}
      <div
        className="absolute inset-0 bg-deep transition-opacity ease-in-out"
        style={{
          opacity: morphing ? 0 : 1,
          transitionDuration: `${DURACAO_MORPH}ms`,
        }}
      >
        {/* Estrelas surgindo suavemente, no mesmo estilo do fundo do projeto */}
        {estrelas.map((e, i) => (
          <span
            key={i}
            className="animate-twinkle absolute rounded-full bg-glow"
            style={{
              left: `${e.left}%`,
              top: `${e.top}%`,
              width: `${e.size}px`,
              height: `${e.size}px`,
              animationDelay: `${e.delay}s`,
              animationDuration: `${e.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Astronauta viajando da parte de baixo até a posição exata da Home */}
      <img
        ref={astronautaRef}
        src={astronauta}
        alt=""
        aria-hidden
        width={1024}
        height={1024}
        className="pointer-events-none fixed left-0 top-0 opacity-0 transform-gpu drop-shadow-[0_10px_40px_rgba(190,150,255,0.25)]"
      />
<div
  className="absolute bottom-10 w-[min(70vw,280px)]"
  style={{
    opacity: morphing ? 0 : 1,
    transition: morphing ? "opacity 120ms ease-out" : undefined,
    animation: morphing
      ? "none"
      : "intro-loading-in 700ms ease-out 4.4s both",
  }}
>
  <div className="h-[2px] overflow-hidden rounded-full bg-white/10">
    <div
      className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
      style={{ width: `${progresso}%` }}
    />
  </div>

  <p className="mt-3 text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
    {progresso >= 100
      ? "Universo carregado"
      : `Preparando universo · ${progresso}%`}
  </p>
</div>
      <div className="relative flex flex-col items-center text-center">
        {/* Frase 1 */}
        <p className="animate-intro-phrase absolute w-[min(90vw,32rem)] font-display text-xl italic text-muted-foreground sm:text-2xl">
          Em algum lugar do universo...
        </p>

        {/* Frase 2 */}
        <p
          className="animate-intro-phrase absolute w-[min(90vw,32rem)] font-display text-xl italic text-muted-foreground sm:text-2xl"
          style={{ animationDelay: "1.55s" }}
        >
          Uma nova órbita está começando...
        </p>

        {/* Momento principal */}
       <div
  className="animate-intro-name relative flex flex-col items-center"
  style={{
    opacity: morphing ? 0 : 1,
    transition: "opacity 90ms ease-out",
  }}
>
  <span
  aria-hidden
  className="pointer-events-none absolute inset-0"
  style={{
    opacity: morphing ? 0 : 1,
    transition: "opacity 80ms ease-out",
  }}
>
  <span
    className="absolute -left-8 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-glow shadow-[0_0_10px_rgba(220,200,255,0.9)] animate-twinkle sm:-left-12"
  />

  <span
    className="absolute -right-8 top-1/3 size-1 rounded-full bg-glow shadow-[0_0_8px_rgba(220,200,255,0.8)] animate-twinkle sm:-right-12"
    style={{
      animationDelay: "0.7s",
    }}
  />

  <span
    className="absolute -left-4 -top-4 size-1 rounded-full bg-lilac shadow-[0_0_9px_rgba(190,150,255,0.9)] animate-twinkle sm:-left-7 sm:-top-5"
    style={{
      animationDelay: "1.1s",
    }}
  />

  <span
    className="absolute -bottom-1 -right-4 size-1.5 rounded-full bg-glow shadow-[0_0_10px_rgba(220,200,255,0.9)] animate-twinkle sm:-right-7"
    style={{
      animationDelay: "1.8s",
    }}
  />
</span>

  <h1
  ref={tituloRef}
  className="relative z-10 font-display text-5xl uppercase leading-tight tracking-[0.14em] sm:text-7xl"
>
  <span className="name-shine" data-text={evento.aniversariante}>
    {evento.aniversariante}
  </span>
</h1>

  <span
  aria-hidden
  className="relative mt-2 block h-px w-72 overflow-hidden bg-primary/20 sm:w-96"
  style={{
    opacity: morphing ? 0 : 1,
    transition: `opacity 90ms ease-out`,
  }}
>
  <span
    className="absolute inset-y-0 left-0 w-full origin-left bg-gradient-to-r from-transparent via-primary to-transparent"
    style={{
      animation: "intro-line 0.3s ease-out 4.65s both",
    }}
  />
</span>

 <p
  ref={subtituloRef}
  className="mt-[41px] text-sm uppercase tracking-[0.55em] text-lilac sm:text-base"
>
  <span>1</span>
<span className="relative inline-block h-[1em] translate-y-[2px] overflow-hidden align-baseline leading-none [perspective:180px] [transform-style:preserve-3d]">
 <span className="inline-block leading-none font-normal animate-intro-four">
  4
</span>

<span className="absolute left-0 top-0 leading-none font-normal animate-intro-five">
  5
</span>
</span>
<span> anos</span>
</p>
</div>
      </div>
    </div>
  );
}
