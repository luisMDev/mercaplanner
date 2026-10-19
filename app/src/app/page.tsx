import { DietApp } from "@/features/app-shell/diet-app";
import { TodayLabel } from "@/features/app-shell/today-label";

export default function Page() {
  return (
    <main className="mx-auto max-w-[860px] pt-7 pr-[max(16px,env(safe-area-inset-right))] pb-16 pl-[max(16px,env(safe-area-inset-left))]">
      <header className="flex flex-col gap-2.5 text-center">
        <h1 className="font-heading text-[clamp(1.9rem,1.5rem+1.6vw,2.5rem)] font-semibold tracking-[-0.01em] text-balance">
          Plan de dieta
        </h1>
        <TodayLabel />
      </header>
      <DietApp />
    </main>
  );
}
