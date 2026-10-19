import { HeartIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Brand } from "../header/brand";
import type { Section } from "../model/routes";
import { SECTIONS } from "../sections";
import { navigate } from "../use-route";

// Bar at the end of the page on a wide screen: logo, motto and the sections
export function FooterBar({ active, recipes }: { active: Section; recipes: number }) {
  return (
    <footer className="mx-auto mt-12 hidden w-full max-w-[1480px] px-10 pb-6 lg:block">
      <div className="flex items-center gap-6 rounded-3xl border border-white/70 bg-card/85 px-6 py-3 shadow-card dark:border-white/5">
        <Brand small onClick={() => navigate({ section: "inicio" })} />
        <p className="flex-1 text-center font-script text-[1.9rem] leading-none">
          Comida rica, compra fácil y un día más amable
          <HeartIcon aria-hidden="true" className="ml-1 inline size-3 -translate-y-3 fill-primary text-primary" />
        </p>
        <p className="caps rounded-2xl border px-4 py-2 text-[0.6rem] leading-relaxed text-muted-foreground">
          Datos de
          <br />
          <span className="font-semibold text-foreground">
            recetas.json · {recipes} {recipes === 1 ? "receta" : "recetas"}
          </span>
        </p>
        <nav aria-label="Secciones" className="flex items-center gap-1 border-l pl-4">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              title={label}
              aria-label={label}
              onClick={() => navigate({ section: id })}
              className={cn(
                "grid size-10 cursor-pointer place-items-center rounded-full text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground",
                id === active && "text-primary",
              )}
            >
              <Icon className="size-5" strokeWidth={1.7} />
            </button>
          ))}
        </nav>
      </div>
    </footer>
  );
}
