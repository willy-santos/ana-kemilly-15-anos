import { useEffect, useState } from "react";
import { evento } from "@/data/convite";

const target = new Date(evento.dataISO).getTime();

function diff() {
  const ms = Math.max(0, target - Date.now());
  return {
    dias: Math.floor(ms / 86400000),
    horas: Math.floor((ms / 3600000) % 24),
    minutos: Math.floor((ms / 60000) % 60),
    segundos: Math.floor((ms / 1000) % 60),
  };
}

export function Countdown() {
  const [t, setT] = useState<ReturnType<typeof diff> | null>(null);

  useEffect(() => {
    setT(diff());
    const id = setInterval(() => setT(diff()), 1000);
    return () => clearInterval(id);
  }, []);

  const items = [
    { label: "dias", value: t?.dias },
    { label: "horas", value: t?.horas },
    { label: "min", value: t?.minutos },
    { label: "seg", value: t?.segundos },
  ];

  return (
    <div className="flex items-stretch justify-center gap-2 sm:gap-3">
      {items.map((i) => (
        <div
          key={i.label}
          className="glass-panel flex min-w-[4.25rem] flex-col items-center rounded-2xl px-3 py-3 sm:min-w-[5.25rem]"
        >
          <span className="font-display text-3xl leading-none text-foreground sm:text-4xl">
            {i.value === undefined ? "--" : String(i.value).padStart(2, "0")}
          </span>
          <span className="mt-1.5 text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground">
            {i.label}
          </span>
        </div>
      ))}
    </div>
  );
}
