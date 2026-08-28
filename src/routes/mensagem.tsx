import { createFileRoute } from "@tanstack/react-router";
import { Quote } from "lucide-react";

import { PageSection } from "@/components/space/PageSection";
import { evento, mensagemAniversariante } from "@/data/convite";

export const Route = createFileRoute("/mensagem")({
  head: () => ({
    meta: [
      { title: "Mensagem da aniversariante · Ana Kemilly 15 anos" },
      {
        name: "description",
        content: "Um espaço reservado para a mensagem pessoal da Ana Kemilly aos convidados.",
      },
      { property: "og:title", content: "Mensagem da aniversariante · Ana Kemilly 15 anos" },
      {
        property: "og:description",
        content: "A mensagem pessoal da Ana Kemilly para quem vai celebrar com ela.",
      },
    ],
  }),
  component: Mensagem,
});

function Mensagem() {
  const { texto } = mensagemAniversariante;

  return (
    <PageSection eyebrow="Palavras especiais" title="Mensagem da aniversariante">
      <article className="glass-panel rounded-3xl px-6 py-9 sm:px-10">
        <Quote className="mx-auto size-6 text-primary/80" aria-hidden />
        {texto ? (
          <p className="font-display mt-5 whitespace-pre-line text-center text-xl leading-relaxed text-foreground sm:text-2xl">
            {texto}
          </p>
        ) : (
          <div className="mt-5 space-y-4 text-center">
            <p className="font-display text-xl italic text-lilac sm:text-2xl">
              Espaço reservado para a mensagem da Ana Kemilly.
            </p>
            <p className="text-sm text-muted-foreground">
              Texto provisório — o conteúdo definitivo será escrito pela aniversariante.
            </p>
          </div>
        )}
        <p className="mt-8 text-center text-[0.68rem] uppercase tracking-[0.3em] text-primary">
  {evento.aniversariante}
</p>
      </article>
    </PageSection>
  );
}
