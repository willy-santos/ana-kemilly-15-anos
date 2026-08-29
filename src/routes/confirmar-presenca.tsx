import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/confirmar-presenca")({
  component: ConfirmarPresenca,
});

function ConfirmarPresenca() {
  const [familia, setFamilia] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [nomes, setNomes] = useState("");
  const [observacao, setObservacao] = useState("");

  return (
    <section className="mx-auto flex w-full max-w-2xl touch-pan-y flex-col items-center px-5 pb-24 pt-28 text-center sm:pt-32">
      

      

      

      <h1 className="mt-4 font-display text-4xl text-foreground sm:text-5xl">
        Confirmação de presença
      </h1>

      <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
        Sua presença é muito especial para nós.
      </p>

      <p className="mt-3 text-sm text-muted-foreground">
        Confirme sua presença até{" "}
        <span className="font-semibold text-primary">
          1º de novembro de 2026
        </span>
        .
      </p>

      <div className="glass-panel mt-10 w-full rounded-3xl px-6 py-7 text-left sm:px-8">
        <div className="mb-6 text-center">
          <p className="font-display text-xl text-foreground">
            Confirmação por família
          </p>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            A confirmação deve ser realizada apenas uma vez por família.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="familia"
              className="mb-2 block text-sm text-foreground"
            >
              Nome da família
            </label>

            <input
              id="familia"
              type="text"
              value={familia}
              onChange={(e) => setFamilia(e.target.value)}
              placeholder="Ex.: Família Silva"
              className="w-full rounded-2xl border border-border bg-white/5 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60"
            />
          </div>

          <div>
            <label
              htmlFor="quantidade"
              className="mb-2 block text-sm text-foreground"
            >
              Quantidade de pessoas
            </label>

            <input
              id="quantidade"
              type="number"
              min="1"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              placeholder="Ex.: 4"
              className="w-full rounded-2xl border border-border bg-white/5 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60"
            />
          </div>

          <div>
            <label
              htmlFor="nomes"
              className="mb-2 block text-sm text-foreground"
            >
              Nome das pessoas que irão 
            </label>

            <textarea
              id="nomes"
              value={nomes}
              onChange={(e) => setNomes(e.target.value)}
              placeholder="Ex.: João, Maria, Pedro e Ana"
              rows={3}
              className="w-full resize-none rounded-2xl border border-border bg-white/5 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60"
            />
          </div>

          <div>
            <label
              htmlFor="observacao"
              className="mb-2 block text-sm text-foreground"
            >
              Observação{" "}
              <span className="text-muted-foreground">(opcional)</span>
            </label>

            <textarea
              id="observacao"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Ex.: Chegaremos por volta das 10h30"
              rows={2}
              className="w-full resize-none rounded-2xl border border-border bg-white/5 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60"
            />
          </div>

         <a
  href={`https://wa.me/559182538442?text=${encodeURIComponent(
    `Olá! Gostaria de confirmar a presença da minha família nos 15 anos da Ana Kemilly.

Família: ${familia}
Quantidade de pessoas: ${quantidade}
Nomes dos convidados: ${nomes}${
      observacao ? `\nObservação: ${observacao}` : ""
    }`,
  )}`}
  target="_blank"
  rel="noopener noreferrer"
  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
>
  <MessageCircle className="size-4" />
  Confirmar presença
</a>
        </div>
      </div>
    </section>
  );
}