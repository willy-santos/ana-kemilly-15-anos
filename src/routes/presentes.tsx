import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Gift, ExternalLink, Copy, Check, Shirt, Footprints } from "lucide-react";

import { PageSection } from "@/components/space/PageSection";
import { presentes } from "@/data/convite";

export const Route = createFileRoute("/presentes")({
  head: () => ({
    meta: [
      { title: "Opções de presente · Ana Kemilly 15 anos" },
      {
        name: "description",
        content: "As opções de presente para os 15 anos da Ana Kemilly serão publicadas aqui.",
      },
      { property: "og:title", content: "Opções de presente · Ana Kemilly 15 anos" },
      {
        property: "og:description",
        content: "Espaço reservado para as opções de presente do aniversário.",
      },
    ],
  }),
  component: Presentes,
});

function Presentes() {
  const [pixCopiado, setPixCopiado] = useState(false);

const copiarPix = async () => {
  try {
    await navigator.clipboard.writeText("91980197356");
    setPixCopiado(true);

    window.setTimeout(() => {
      setPixCopiado(false);
    }, 2000);
  } catch {
    setPixCopiado(false);
  }
};
  return (
    <PageSection eyebrow="Com carinho" title="Opções de presente">
      {presentes.length === 0 ? (
        <div className="glass-panel rounded-3xl px-6 py-12 text-center">
          <Gift className="mx-auto size-7 text-primary" aria-hidden />
          <p className="font-display mt-4 text-xl text-foreground sm:text-2xl">
            As opções de presente ainda serão definidas.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Esta seção já está pronta para receber a lista em breve.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {presentes.map((p) => {
  const isPix = p.nome === "Pix";

  return (
    <li
      key={p.nome}
      className={`glass-panel overflow-hidden rounded-3xl ${
        isPix ? "sm:col-span-2" : ""
      }`}
    >
      <div className="px-6 py-7 sm:px-8">
        <div className="flex items-center gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            {p.nome === "Vestuário" ? (
              <Shirt className="size-5" aria-hidden />
            ) : p.nome === "Calçados" ? (
              <Footprints className="size-5" aria-hidden />
            ) : (
              <Gift className="size-5" aria-hidden />
            )}
          </div>

          <div>
            <h2 className="font-display text-xl text-foreground sm:text-2xl">
              {p.nome}
            </h2>

           {p.nome !== "Pix" && p.descricao ? (
  <p className="mt-1 text-sm text-muted-foreground">
    {p.nome === "Vestuário" ? (
      <>
        Tamanho{" "}
        <span className="font-semibold text-primary">36</span>
      </>
    ) : p.nome === "Calçados" ? (
      <>
        Tamanho{" "}
        <span className="font-semibold text-primary">37</span>
      </>
    ) : (
      p.descricao
    )}
  </p>
) : null}
          </div>
        </div>

        {isPix ? (
          <div className="mt-6 rounded-2xl border border-primary/10 bg-primary/5 p-5">
            <p className="font-display text-lg text-foreground sm:text-xl">
  Ana Kemilly 
</p>

            <p className="mt-1 text-sm text-muted-foreground">
  Banco <span className="font-medium text-emerald-400">PicPay</span>
</p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1 rounded-xl bg-background/40 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Chave Pix
                </p>

                <p className="mt-1 break-all font-mono text-sm text-foreground">
                  Número demonstrativo
                </p>
              </div>

              <button
                type="button"
                onClick={copiarPix}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 active:scale-[0.98]"
              >
                {pixCopiado ? (
                  <>
                    <Check className="size-4" aria-hidden />
                    Chave copiada!
                  </>
                ) : (
                  <>
                    <Copy className="size-4" aria-hidden />
                    Copiar chave
                  </>
                )}
              </button>
            </div>
          </div>
        ) : null}

        {p.link ? (
          <a
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            Ver presente
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        ) : null}
      </div>
    </li>
  );
})}
        </ul>
      )}
    </PageSection>
  );
}
