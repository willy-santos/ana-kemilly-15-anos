import lua from "@/assets/lua.png";
import planeta from "@/assets/planeta.png";

/** Gerador determinístico: mesmo resultado no servidor e no cliente. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const rand = seeded(1511);
const estrelas = Array.from({ length: 70 }, () => ({
  left: rand() * 100,
  top: rand() * 100,
  size: 1 + rand() * 2.1,
  delay: rand() * 5,
  duration: 3 + rand() * 4,
}));

export function SpaceBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Nebulosas suaves */}
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-accent/20 blur-[90px]" />
      <div className="absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-primary/15 blur-[110px]" />
      <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-secondary/30 blur-[100px]" />

      {/* Estrelas */}
      {estrelas.map((e, i) => (
        <span
          key={i}
          className="animate-twinkle absolute rounded-full bg-glow"
          style={{
            left: `${e.left}%`,
            top: `${e.top}%`,
            width: `${e.size}px`,
            height: `${e.size}px`,
            animationDelay: `${e.delay}s`,
            animationDuration: `${e.duration}s`,
          }}
        />
      ))}
 
      {/* Lua e planeta flutuando */}
      <img
        src={lua}
        alt=""
        loading="lazy"
        width={768}
        height={768}
        className="animate-float-slow absolute -right-10 top-16 w-40 opacity-45 sm:w-56"
      />
      <img
        src={planeta}
        alt=""
        loading="lazy"
        width={768}
        height={768}
        className="animate-float-slow absolute -left-12 bottom-24 w-36 opacity-35 sm:w-48"
        style={{ animationDelay: "2.5s" }}
      />

     {/* Pequena estrela em movimento */}
<span
  className="animate-shooting-star absolute rounded-full bg-glow"
  style={{
    width: "2px",
    height: "2px",
    boxShadow: "0 0 5px 1px var(--glow)",
  }}
/>
{/* Segunda estrela em movimento — trajetória mais baixa */}
<span
  className="animate-shooting-star animate-shooting-star-lower absolute rounded-full bg-glow"
  style={{
    width: "2px",
    height: "2px",
    boxShadow: "0 0 5px 1px var(--glow)",
  }}
/>
    </div>
  );
}
