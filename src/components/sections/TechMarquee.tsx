import { marqueeItems } from "@/content/product";

function Item({ name, cat }: { name: string; cat: string }) {
  return (
    <li className="flex shrink-0 items-center gap-3 px-7 sm:px-10">
      <span className="font-display text-[1.35rem] font-bold tracking-[-0.02em] text-steel/80 transition-colors duration-300 hover:text-white sm:text-[1.6rem]">{name}</span>
      <span className="rounded-xs border border-line-dark px-1.5 py-0.5 font-mono text-[9px] tracking-[0.16em] text-steel/60 uppercase">{cat}</span>
      <span aria-hidden className="ml-7 h-1.5 w-1.5 rotate-45 bg-electric/50 sm:ml-10" />
    </li>
  );
}

/** Infinite typographic strip of supported models, platforms and tools. Wordmarks only — no third-party logos. */
export function TechMarquee() {
  return (
    <section aria-labelledby="tech-strip-title" className="relative overflow-hidden border-y border-line-dark bg-abyss py-12">
      <div className="container-x">
        <h2 id="tech-strip-title" className="eyebrow text-center text-steel">
          Model-agnostic. Cloud-agnostic. Built around the ecosystem you already use.
        </h2>
      </div>

      <div className="group mt-8 mask-fade-x motion-reduce:[mask-image:none]">
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none">
          <ul className="flex items-center motion-reduce:container-x motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-4">
            {marqueeItems.map((m) => (
              <Item key={m.name} {...m} />
            ))}
          </ul>
          <ul aria-hidden className="flex items-center motion-reduce:hidden">
            {marqueeItems.map((m) => (
              <Item key={m.name} {...m} />
            ))}
          </ul>
        </div>
      </div>

      <p className="container-x mt-8 text-center text-[0.72rem] text-steel/60">
        Names refer to supported models, platforms and tools. No partnership or endorsement implied.
      </p>
    </section>
  );
}
