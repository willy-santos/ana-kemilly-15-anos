import { createFileRoute } from "@tanstack/react-router";
import { Shirt, Waves, Volleyball, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { PageSection } from "@/components/space/PageSection";

export const Route = createFileRoute("/localizacao")({
  head: () => ({
    meta: [
      { title: "Localização · Ana Kemilly 15 anos" },
      {
        name: "description",
        content:
          "Informações sobre lazer e atividades disponíveis durante a celebração.",
      },
      { property: "og:title", content: "Ana Kemilly · 15 anos" },
      {
        property: "og:description",
        content:
          "Informações sobre lazer e atividades disponíveis durante a celebração.",
      },
    ],
  }),
  component: Localizacao,
});

function Localizacao() {
  const [mostrarIndicador, setMostrarIndicador] = useState(true);
  const informacoesRef = useRef<HTMLDivElement>(null);

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
          aria-label="Ver informações sobre lazer e atividades"
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

      <PageSection
        eyebrow="Informações da celebração"
        title="Lazer e diversão"
      >
        <div className="glass-panel rounded-3xl px-6 py-8 text-center">
          <p className="font-display text-2xl text-foreground">
            Um espaço para aproveitar
          </p>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            A celebração contará com diferentes opções de lazer e atividades
            para tornar esse momento ainda mais especial.
          </p>
        </div>

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
              Venha preparado para aproveitar tudo com a gente!
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
                  Teremos espaço para atividades e brincadeiras. Para
                  aproveitar, recomendamos ir com roupa esporte e confortável.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Waves className="size-5 text-primary" aria-hidden />
              </div>

              <div>
                <p className="font-medium text-foreground">Piscina</p>

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
                  Para quem quiser jogar futebol, vôlei ou participar de
                  outras atividades, vale a pena trazer uma roupa confortável
                  e apropriada para praticar esportes.
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