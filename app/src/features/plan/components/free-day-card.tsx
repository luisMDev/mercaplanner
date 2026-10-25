import { CoffeeIcon, FootprintsIcon, HeartIcon, ShoppingBasketIcon } from "lucide-react";
import { CozyMug } from "@/components/cozy/cozy-mug";
import { DateStub } from "@/components/cozy/date-stub";
import { ScriptHeading, Squiggle } from "@/components/cozy/script-heading";
import { WashiTape } from "@/components/cozy/washi-tape";
import { todayDia } from "@/features/plan/model/days";
import { cn } from "@/lib/utils";

const IDEAS = [
  { icon: CoffeeIcon, text: "Un café sin prisa" },
  { icon: FootprintsIcon, text: "Un paseo largo" },
  { icon: ShoppingBasketIcon, text: "El mercado, sin lista" },
];

// A day of "dias_libres" as a paper card held with tape: the date in a gold
// stub, "Día libre" handwritten, a steaming mug and a few ideas for the day.
// Fits a whole column (Hoy) and the narrow side of Semana
export function FreeDayCard({ date, isToday, className }: { date: Date; isToday: boolean; className?: string }) {
  const dia = todayDia(date);
  return (
    <section
      className={cn(
        "@container relative mt-3 rounded-3xl border border-white/70 glass bg-linear-to-br from-card/50 from-40% to-gold-soft/70 px-4 pt-7 pb-5 shadow-lift sm:px-6 dark:border-white/5",
        className,
      )}
    >
      <WashiTape tone="sage" className="-top-3 left-8 -rotate-3" />
      <WashiTape tone="mint" className="-top-3 right-10 w-20 rotate-2" />

      <div className="flex items-stretch gap-4 @md:gap-6">
        <DateStub date={date} className="bg-gold py-4 shadow-[0_10px_24px_-12px_var(--gold)] @md:py-5" />
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 pr-14 @sm:pr-20 @md:pr-28">
          <p className="caps text-[0.62rem] font-semibold text-gold">
            {isToday ? "Hoy" : dia.label} · Sin plan
          </p>
          <ScriptHeading as="h2" className="text-[2.2rem] whitespace-nowrap @xs:text-[2.5rem] @md:text-[3.4rem]">
            Día libre
          </ScriptHeading>
          <Squiggle className="text-gold/70 dark:text-gold/60" />
        </div>
      </div>

      {/* float animates transform, so the tilt goes on the drawing inside */}
      <div className="animate-float absolute top-3 right-2 w-16 @sm:top-4 @sm:right-4 @sm:w-20 @md:right-6 @md:w-28">
        <CozyMug className="w-full -rotate-6 drop-shadow-sm" />
      </div>

      <p className="mt-4 font-serif text-[1.02rem] leading-snug text-muted-foreground italic @md:text-[1.1rem]">
        {isToday ? "Hoy la cocina descansa." : `El ${dia.label.toLowerCase()} la cocina descansa.`} Come lo que te apetezca,
        sin contar nada.
      </p>

      <ul className="mt-4 flex flex-col gap-2 rounded-2xl border border-dashed border-gold/40 bg-card/50 p-3 @md:flex-row @md:flex-wrap @md:gap-x-5">
        {IDEAS.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-2 font-serif text-[0.98rem]">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-gold-soft text-gold [&_svg]:size-3.5">
              <Icon aria-hidden="true" />
            </span>
            {text}
          </li>
        ))}
      </ul>

      <p className="mt-4 flex items-center gap-1.5 px-1 font-script text-[1.4rem] leading-none text-muted-foreground">
        Pequeños placeres, días más ricos
        <HeartIcon aria-hidden="true" className="size-3 fill-primary text-primary" />
      </p>
    </section>
  );
}
