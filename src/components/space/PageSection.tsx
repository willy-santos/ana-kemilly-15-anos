import type { ReactNode } from "react";

export function PageSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="animate-rise-in mx-auto w-full max-w-3xl px-5 pb-24 pt-28 sm:pt-32">
      <header className="text-center">
        {eyebrow ? (
          <p className="text-[0.7rem] uppercase tracking-[0.35em] text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-cosmic mt-3 text-4xl leading-tight sm:text-5xl">{title}</h1>
        <span className="mx-auto mt-5 block h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />
      </header>
      <div className="mt-10">{children}</div>
    </section>
  );
}
