import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageSection } from "@/components/space/PageSection";
import { supabase } from "@/integrations/supabase/client";

type Recadinho = {
  id: string;
  nome: string;
  mensagem: string;
  created_at: string;
};

export const Route = createFileRoute("/recadinhos")({
  head: () => ({
    meta: [
      { title: "Recadinhos · Ana Kemilly 15 anos" },
      {
        name: "description",
        content: "Deixe um recadinho carinhoso para a Ana Kemilly nos 15 anos dela.",
      },
      { property: "og:title", content: "Recadinhos · Ana Kemilly 15 anos" },
      {
        property: "og:description",
        content: "Mensagens dos convidados flutuando pelo universo da Ana Kemilly.",
      },
    ],
  }),
  component: Recadinhos,
});

async function fetchRecadinhos(): Promise<Recadinho[]> {
  const { data, error } = await supabase
    .from("recadinhos")
    .select("id, nome, mensagem, created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  return data ?? [];
}

function Recadinhos() {
  const [nome, setNome] = useState("");
  const [mensagem, setMensagem] = useState("");
  const queryClient = useQueryClient();

  const { data: recados = [], isLoading } = useQuery({
    queryKey: ["recadinhos"],
    queryFn: fetchRecadinhos,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("recadinhos")
        .insert({ nome: nome.trim(), mensagem: mensagem.trim() });
      if (error) throw error;
    },
    onSuccess: () => {
      setNome("");
      setMensagem("");
      toast.success("Recadinho enviado! Obrigada 💜");
      queryClient.invalidateQueries({ queryKey: ["recadinhos"] });
    },
    onError: () => toast.error("Não foi possível enviar agora. Tente novamente."),
  });

  const podeEnviar = nome.trim().length > 0 && mensagem.trim().length > 0 && !isPending;

  return (
    <PageSection eyebrow="Opcional, mas especial" title="Recadinhos">
      <p className="relative top-2 -mt-4 mb-8 text-center text-sm text-muted-foreground">
  Sua mensagem vai brilhar por aqui!
</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (podeEnviar) mutate();
        }}
        className="glass-panel space-y-4 rounded-3xl px-5 py-6 sm:px-7"
      >
        <div>
          <label htmlFor="nome" className="mb-2 block text-sm text-foreground/90">
            Seu nome
          </label>
          <input
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            maxLength={60}
            required
            placeholder="Como você quer aparecer"
            className="w-full rounded-2xl border border-input bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-ring/40"
          />
        </div>

        <div>
          <label htmlFor="mensagem" className="mb-2 block text-sm text-foreground/90">
            Seu recado
          </label>
          <textarea
            id="mensagem"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            maxLength={500}
            required
            rows={4}
            placeholder="Escreva seu recadinho..."
            className="w-full resize-none rounded-2xl border border-input bg-background/40 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-ring/40"
          />
          <p className="mt-1 text-right text-xs text-muted-foreground">{mensagem.length}/500</p>
        </div>

        <button
          type="submit"
          disabled={!podeEnviar}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="size-4" aria-hidden />
          {isPending ? "Enviando..." : "Enviar recadinho"}
        </button>
      </form>

      <div className="mt-10">
        {isLoading ? (
          <p className="text-center text-sm text-muted-foreground">Carregando recadinhos...</p>
        ) : recados.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            Nenhum recadinho ainda — seja a primeira estrela.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {recados.map((r, i) => (
              <li
                key={r.id}
                className="glass-panel animate-float-slow rounded-3xl px-5 py-5"
                style={{ animationDelay: `${(i % 4) * 1.4}s`, animationDuration: "14s" }}
              >
                <Sparkles className="size-4 text-primary/80" aria-hidden />
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground">
                  {r.mensagem}
                </p>
                <p className="font-display mt-4 text-base text-lilac">— {r.nome}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageSection>
  );
}
