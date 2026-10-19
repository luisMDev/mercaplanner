import type { Section } from "../model/routes";
import { navigate } from "../use-route";
import { Brand } from "./brand";
import { BasketPill, KcalPill } from "./header-pills";
import { SettingsMenu, type PlanFile } from "./settings-menu";
import { TopNav } from "./top-nav";

// Logo, the sections (on a wide screen), today's kcal, the basket and
// settings. Pinned to the top while scrolling, over the paper
export function AppHeader({ active, pending, file }: { active: Section; pending: number; file: PlanFile }) {
  return (
    <header className="sticky top-0 z-30 border-b border-transparent bg-background/95 pt-[env(safe-area-inset-top)] backdrop-blur-md [view-transition-name:header]">
      <div className="mx-auto flex h-18 w-full max-w-[1480px] items-center gap-3 px-4 sm:px-6 lg:h-20 lg:gap-6 lg:px-10">
      <Brand onClick={() => navigate({ section: "inicio" })} />
      <TopNav active={active} className="mx-auto hidden lg:flex" />
      <div className="ml-auto flex items-center gap-2 lg:ml-0">
        <KcalPill plan={file.plan} className="hidden md:inline-flex lg:hidden xl:inline-flex" />
        <BasketPill pending={pending} />
        <SettingsMenu {...file} />
      </div>
      </div>
    </header>
  );
}
