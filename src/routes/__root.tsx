import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";

import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteNav } from "@/components/space/SiteNav";
import { SwipeNavigator } from "@/components/space/SwipeNavigator";
import { SpaceBackground } from "@/components/space/SpaceBackground";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-cosmic text-6xl">404</h1>
        <h2 className="mt-4 text-xl text-foreground">Essa órbita não existe</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura se perdeu no espaço.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voltar ao convite
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl text-foreground">Essa página não carregou</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Algo deu errado. Tente novamente ou volte ao início.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Tentar de novo
          </button>

          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/60"
          >
            Início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
  title: "15 anos de Ana Kemilly · Universo Observável",

  meta: [
    { charSet: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "author", content: "Ana Kemilly" },

    {
      name: "description",
      content: "Um convite especial para celebrar os 15 anos de Ana Kemilly.",
    },

    { property: "og:type", content: "website" },
    {
      property: "og:title",
      content: "15 anos de Ana Kemilly · Universo Observável",
    },
    {
      property: "og:description",
      content: "Um convite especial para celebrar os 15 anos de Ana Kemilly.",
    },
    {
      property: "og:image",
      content:
        "https://ana-kemilly.universoconvite.workers.dev/astronauta.png",
    },
    {
      property: "og:image:alt",
      content: "Astronauta · 15 anos de Ana Kemilly",
    },
    {
      property: "og:url",
      content: "https://ana-kemilly.universoconvite.workers.dev/",
    },

    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:title",
      content: "15 anos de Ana Kemilly · Universo Observável",
    },
    {
      name: "twitter:description",
      content: "Um convite especial para celebrar os 15 anos de Ana Kemilly.",
    },
    {
      name: "twitter:image",
      content:
        "https://ana-kemilly.universoconvite.workers.dev/astronauta.png",
    },

    { name: "theme-color", content: "#150f28" },
  ],

  links: [
    { rel: "stylesheet", href: appCss },
    { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Manrope:wght@300;400;500;600&display=swap",
    },
  ],
}),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

/**
 * Controla se a Intro já foi exibida durante o carregamento atual
 * da aplicação.
 *
 * Ao dar F5/recarregar a página, esse estado volta para false.
 * Ao navegar entre as abas, o RootComponent continua montado,
 * então o estado permanece true.
 */
const IntroContext = createContext<{
  introExibida: boolean;
  marcarIntroExibida: () => void;
}>({
  introExibida: false,
  marcarIntroExibida: () => {},
});

export function useIntro() {
  return useContext(IntroContext);
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [introExibida, setIntroExibida] = useState(false);

const marcarIntroExibida = () => {
  setIntroExibida(true);
};

  return (
    <QueryClientProvider client={queryClient}>
      <IntroContext.Provider
  value={{
    introExibida,
    marcarIntroExibida,
  }}
>
  <SpaceBackground />

  <SiteNav />

  <main className="min-h-screen">
    <SwipeNavigator>
      <Outlet />
    </SwipeNavigator>
  </main>

  <footer className="pb-8 text-center text-xs text-muted-foreground">
    Feito por{" "}
    <span className="text-primary">Willy Santos</span> · 15 anos de Ana Kemilly
  </footer>

  <Toaster position="top-center" />
</IntroContext.Provider>
    </QueryClientProvider>
  );
}