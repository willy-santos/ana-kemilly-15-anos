import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Navigation, Shirt, Waves, Volleyball, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { PageSection } from "@/components/space/PageSection";
import { evento, mapsEmbedUrl, mapsUrl } from "@/data/convite";
export const Route = createFileRoute("/localizacao")({
  head: () => ({
    meta: [
      { title: "Localização · Ana Kemilly 15 anos" },
      {
        name: "description",
        content:
          "Passagem Jardim Brasil, 54 - Levilândia, Ananindeua - PA, 66650-204. Como chegar à festa de 15 anos da Ana Kemilly.",
      },
      { property: "og:title", content: "Localização · Ana Kemilly 15 anos" },
      {
        property: "og:description",
        content: "Passagem Jardim Brasil, 54 - Levilândia, Ananindeua - PA.",
      },
    ],
  }),
  component: Localizacao,
});

function Localizacao() {
  const [mostrarIndicador, setMostrarIndicador] = useState(true);
const informacoesRef = useRef<HTMLDivElement>(null);
const tituloRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const elemento = informacoesRef.current;

    if (!elemento) return;

    const observer = new IntersectionObserver(
    (entries) => {
  const entrada = entries[0];

  if (!entrada) return;

  setMostrarIndicador(!entrada.isIntersecting);
},
      {
        threshold: 0.05,
      },
    );

    observer.observe(elemento);

    return () => {
      observer.disconnect();
    };
  }, []);


  
  return (
    <div className="relative">
     {mostrarIndicador && (
  <button
  type="button"
  aria-label="Ver informações sobre piscina e lazer"
  onClick={() => {
    informacoesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }}
  className="fixed left-4 top-[170px] z-[9999] flex cursor-pointer flex-col items-center text-primary sm:left-8 sm:top-[190px]"
>
  <Shirt className="size-5 animate-clothes-hint" />
  <ChevronDown className="size-6 animate-scroll-hint" />
</button>
)}

      <PageSection eyebrow="Onde a órbita se encontra" title="Localização">
      
      <div className="glass-panel rounded-3xl px-6 py-8 text-center">
        <MapPin className="mx-auto size-6 text-accent" aria-hidden />

        <p className="font-display mt-4 text-2xl text-foreground">
          {evento.endereco.linha1}
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          {evento.endereco.linha2}
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          CEP {evento.endereco.cep}
        </p>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          <Navigation className="size-4" aria-hidden />
          Ver localização
        </a>
      </div>

      <div className="glass-panel mt-5 overflow-hidden rounded-3xl">
        <iframe
          title="Mapa do local da festa"
          src={mapsEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-64 w-full border-0 sm:h-80"
        />
      </div>
       
      {/* Informações para aproveitar a festa */}

<div
  id="informacoes"
  ref={informacoesRef}
  className="glass-panel mt-5 rounded-3xl px-6 py-7 sm:px-8"
>
        <div className="text-center">
          <p className="font-display text-2xl text-foreground">
            Para aproveitar a festa
          </p>

          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Teremos espaço para lazer e diversão. Venha preparado para
            aproveitar tudo com a gente!
          </p>
        </div>

        <div className="mt-7 space-y-5">
            <div className="flex gap-4">
  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
    <Shirt className="size-5 text-primary" aria-hidden />
  </div>

  <div>
    <p className="font-medium text-foreground">
      Roupa para lazer
    </p>

    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
      Teremos espaço para atividades e brincadeiras. Para aproveitar,
      recomendamos ir com roupa esporte e confortável.
    </p>
  </div>
</div>
          <div className="flex gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Waves className="size-5 text-primary" aria-hidden />
            </div>

            <div>
              <p className="font-medium text-foreground">
                Piscina
              </p>

              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Para quem quiser aproveitar a piscina, lembre-se de levar
                roupa de banho adequada e decente para o ambiente da festa.
              </p>
            </div>
          </div>

        

          <div className="flex gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Volleyball className="size-5 text-primary" aria-hidden />
            </div>

            <div>
              <p className="font-medium text-foreground">
                Futebol e vôlei
              </p>

              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Para quem quiser jogar futebol, vôlei ou participar de outras
                atividades, vale a pena trazer uma roupa confortável e
                apropriada para praticar esportes.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-7 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-4 text-center">
          <p className="text-sm font-medium text-foreground">
               Venha confortável e preparado para aproveitar!
          </p>

          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            A roupa de lazer e a roupa de banho são opcionais, apenas para
            quem quiser participar dessas atividades.
          </p>
        </div>
      </div>
          </PageSection>
    </div>
  );
}
