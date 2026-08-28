import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Navigation } from "lucide-react";

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
  return (
    <PageSection eyebrow="Onde a órbita se encontra" title="Localização">
      <div className="glass-panel rounded-3xl px-6 py-8 text-center">
        <MapPin className="mx-auto size-6 text-accent" aria-hidden />
        <p className="font-display mt-4 text-2xl text-foreground">{evento.endereco.linha1}</p>
        <p className="mt-1 text-sm text-muted-foreground">{evento.endereco.linha2}</p>
        <p className="mt-1 text-sm text-muted-foreground">CEP {evento.endereco.cep}</p>

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
    </PageSection>
  );
}
