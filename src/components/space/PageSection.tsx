import { useLayoutEffect, useState, type ReactNode } from "react";

export function PageSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  const [tamanhoTitulo, setTamanhoTitulo] = useState<number | null>(null);

  useLayoutEffect(() => {
    const ajustarTitulo = () => {
      const larguraDisponivel = Math.min(
        window.innerWidth - 40,
        720,
      );

      let tamanho = Math.min(
        window.innerWidth * 0.075,
        48,
      );

      const medir = document.createElement("span");

      medir.textContent = title;
      medir.style.position = "absolute";
      medir.style.visibility = "hidden";
      medir.style.whiteSpace = "nowrap";
      medir.style.fontFamily = '"Cormorant Garamond", serif';
      medir.style.fontWeight = "400";
      medir.style.letterSpacing = "normal";
      medir.style.fontSize = `${tamanho}px`;

      document.body.appendChild(medir);

      while (
        medir.getBoundingClientRect().width > larguraDisponivel &&
        tamanho > 22
      ) {
        tamanho -= 0.5;
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
  }, [title]);

  return (
    <section className="animate-rise-in mx-auto w-full max-w-3xl px-5 pb-24 pt-28 sm:pt-32">
      <header className="text-center">
        {eyebrow ? (
          <p
            className="
              text-[0.7rem]
              uppercase
              tracking-[0.35em]
              text-muted-foreground
            "
          >
            {eyebrow}
          </p>
        ) : null}

        <h1
          className="
            text-cosmic
            mx-auto
            mt-3
            whitespace-nowrap
            leading-tight
          "
          style={{
            fontSize: tamanhoTitulo
              ? `${tamanhoTitulo}px`
              : undefined,
          }}
        >
          {title}
        </h1>

        <span className="mx-auto mt-3 block h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />
      </header>

      <div className="mt-4">
        {children}
      </div>
    </section>
  );
}