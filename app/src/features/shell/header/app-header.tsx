import type { Section } from "../model/routes";
import { navigate } from "../use-route";
import { Brand } from "./brand";
import { BasketPill, KcalPill } from "./header-pills";
import { SettingsMenu, type PlanFile } from "./settings-menu";
import { TopNav } from "./top-nav";

// Logo, the sections (on a wide screen), today's kcal, the basket and settings
export function AppHeader({ active, pending, file }: { active: Section; pending: number; file: PlanFile }) {
  return (
    <header className="mx-auto flex w-full max-w-[1480px] items-center gap-3 px-4 pt-4 pb-2 sm:px-6 lg:gap-6 lg:px-10 lg:pt-6">
      <Brand onClick={() => navigate({ section: "inicio" })} />
      <TopNav active={active} className="mx-auto hidden lg:flex" />
      <div className="ml-auto flex items-center gap-2 lg:ml-0">
        <KcalPill plan={file.plan} className="hidden md:inline-flex lg:hidden xl:inline-flex" />
        <BasketPill pending={pending} />
        <SettingsMenu {...file} />
      </div>
    </header>
  );
}
