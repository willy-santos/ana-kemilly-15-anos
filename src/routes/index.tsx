import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Clock, MapPin, MessageCircle, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useIntro } from "@/routes/__root";

import astronauta from "@/assets/astronauta.png";
import { Countdown } from "@/components/space/Countdown";
import { IntroOpening } from "@/components/space/IntroOpening";
import { evento } from "@/data/convite";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "15 anos de Ana Kemilly · Universo Observável" },
      {
        name: "description",
        content:
          "Convite digital dos 15 anos de Ana Kemilly. Domingo, 15 de novembro de 2026, a partir das 10:00, em Ananindeua - PA.",
      },
      {
        property: "og:title",
        content: "15 anos de Ana Kemilly · Universo Observável",
      },
      {
        property: "og:description",
        content:
          "Uma nova órbita começa. Domingo, 15 de novembro de 2026, a partir das 10:00.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Inicio,
});

function Inicio() {
  const { introExibida, marcarIntroExibida } = useIntro();

  /** "intro" = abertura no ar · "transicao" = título viajando · "home" = Home assumiu */
  const [fase, setFase] = useState<"intro" | "transicao" | "home">(
  introExibida ? "home" : "intro",
);

useEffect(() => {
  if (introExibida) {
    setFase("home");
  }
}, [introExibida]);
const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

useEffect(() => {
  if (fase !== "home") {
    setMostrarConfirmacao(false);
    return;
  }

  const timer = window.setTimeout(() => {
    setMostrarConfirmacao(true);
  }, 1500);

  return () => window.clearTimeout(timer);
}, [fase]);
  const tituloRef = useRef<HTMLHeadingElement>(null);
const subtituloRef = useRef<HTMLParagraphElement>(null);
const astronautaRef = useRef<HTMLImageElement>(null);

const [tamanhoTitulo, setTamanhoTitulo] = useState<number | null>(null);

useLayoutEffect(() => {
  const ajustarTitulo = () => {
    const larguraDisponivel = Math.min(
      window.innerWidth - 48,
      720,
    );

    let tamanho = Math.min(
      window.innerWidth * 0.115,
      62,
    );

    const medir = document.createElement("span");

    medir.textContent = evento.aniversariante;
    medir.style.position = "absolute";
    medir.style.visibility = "hidden";
    medir.style.whiteSpace = "nowrap";
    medir.style.fontFamily = '"Cormorant Garamond", serif';
    medir.style.fontWeight = "350";
    medir.style.letterSpacing = "0.035em";
    medir.style.textTransform = "uppercase";
    medir.style.fontSize = `${tamanho}px`;

    document.body.appendChild(medir);

    while (
      medir.getBoundingClientRect().width > larguraDisponivel &&
      tamanho > 18
    ) {
      tamanho -= 0.25;
      medir.style.fontSize = `${tamanho}px`;
    }

    medir.remove();

    setTamanhoTitulo(tamanho);
  };

  ajustarTitulo();

  window.addEventListener("resize", ajustarTitulo);

  return () => {
    window.removeEventListener("resize", ajustarTitulo);
  };
}, []);

const onTransicao = useCallback(() => {
  setFase("transicao");
}, []);

const onFim = useCallback(() => {
  setFase("home");
  marcarIntroExibida();
}, [marcarIntroExibida]);

// Cloudflare automatic deploy test
  /** Elementos ao redor do título: aparecem quando a transição começa. */
  const revelar = fase === "intro" ? "opacity-0" : "animate-rise-in";

  /** O título da Home só assume quando o título da abertura chega ao destino. */
  const tituloVisivel = fase === "home" ? "opacity-100" : "opacity-0";

  return (
  <>
    {mostrarConfirmacao && (
      <div className="fixed inset-x-4 bottom-5 z-40 mx-auto max-w-md animate-rise-in">
        <div
  className={`confirmation-card ${revelar} glow-soft mt-10 w-full rounded-3xl px-6 py-7`}
>
  <button
    type="button"
    onClick={() => setMostrarConfirmacao(false)}
    aria-label="Fechar confirmação de presença"
    className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
  >
    <X className="size-4" />
  </button>

  <div className="flex flex-col items-center text-center">
    <span className="mb-2 text-primary">✦</span>

    <p className="font-display text-xl text-foreground sm:text-2xl">
      Confirmação de presença
    </p>

    <span className="my-4 h-px w-12 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

    <p className="text-sm leading-relaxed text-muted-foreground">
      Sua presença é muito especial para nós.
    </p>

    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
      Confirme com a{" "}
      administração até
    </p>

<p className="mt-1 font-sans text-lg font-semibold tracking-wide text-primary">
  1º de novembro de 2026
</p>

    <Link
  to="/confirmar-presenca"
  className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-white/5 px-6 py-3 text-sm font-medium text-primary transition-transform hover:scale-[1.03] hover:bg-primary/10"
>
  <MessageCircle className="size-4" />
  Confirmar presença
</Link>
  </div>
</div>
</div>
    )}

    <section
   className="mx-auto flex w-full max-w-3xl flex-col items-center px-5 pb-24 pt-28 text-center sm:pt-32">
      {!introExibida && (
        <IntroOpening
  alvoTitulo={tituloRef}
  alvoSubtitulo={subtituloRef}
  alvoAstronauta={astronautaRef}
  tamanhoTitulo={tamanhoTitulo}
  onTransicao={onTransicao}
  onFim={onFim}
/>
      )}

      <p
        className={`${revelar} text-[0.7rem] uppercase tracking-[0.4em] text-muted-foreground`}
      >
        {evento.tema.toUpperCase()}
      </p>

      <p
        className={`${revelar} font-display mt-5 text-lg italic text-lilac sm:text-xl`}
        style={{ animationDelay: "0.1s" }}
      >
        Uma celebração especial está chegando...
      </p>

      {/* Título idêntico ao da abertura */}
  <h1
  ref={tituloRef}
  data-text={evento.aniversariante}
  className={`text-cosmic home-name-shine ${tituloVisivel} mt-6 font-display font-[350] uppercase leading-tight tracking-[0.035em] whitespace-nowrap`}
  style={{
    fontSize: tamanhoTitulo ? `${tamanhoTitulo}px` : undefined,
    width: "fit-content",
    maxWidth: "none",
  }}
>
  {evento.aniversariante}
</h1>
      {/* Mesmo afastamento usado na abertura */}
      <p
        ref={subtituloRef}
        className={`${tituloVisivel} mt-[41px] text-sm uppercase tracking-[0.55em] text-lilac sm:text-base`}
      >
        15 anos
      </p>

      <img
        ref={astronautaRef}
        src={astronauta}
        alt="Ilustração de um pequeno astronauta segurando balões de estrela"
        width={1024}
        height={1024}
        className={`${
          fase === "home" ? "animate-float-slow" : "opacity-0"
        } mt-8 w-44 drop-shadow-[0_10px_40px_rgba(190,150,255,0.25)] sm:w-60`}
      />

      <div
        className={`glass-panel ${revelar} glow-soft mt-10 w-full rounded-3xl px-6 py-7`}
        style={{ animationDelay: "0.4s" }}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <CalendarDays className="size-5 text-primary" aria-hidden />

            <p className="font-display text-2xl text-foreground sm:text-3xl">
              {evento.dataTexto}
            </p>

            <p className="mt-1 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="size-4" aria-hidden /> {evento.horaTexto}
            </p>
          </div>

          <span className="mx-auto block h-px w-20 bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

          <div className="flex flex-col items-center gap-1">
            <MapPin className="size-5 text-accent" aria-hidden />

            <p className="text-base text-foreground">
              {evento.endereco.linha1}
            </p>

            <p className="text-sm text-muted-foreground">
              {evento.endereco.linha2}
            </p>
          </div>
        </div>
      </div>

      <div
        className={`${revelar} mt-10 w-full`}
        style={{ animationDelay: "0.5s" }}
      >
        <p className="mb-4 text-[0.68rem] uppercase tracking-[0.3em] text-muted-foreground">
          Contagem para a decolagem
        </p>

        <Countdown />
      </div>

      <div
        className={`${revelar} mt-10 flex flex-wrap justify-center gap-3`}
        style={{ animationDelay: "0.55s" }}
      >
        <Link
          to="/recadinhos"
          className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          Deixar um recadinho
        </Link>
      </div>
       </section>
  </>
  );
}