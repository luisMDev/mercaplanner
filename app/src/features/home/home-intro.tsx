import { ScriptHeading, Squiggle, Tagline } from "@/components/cozy/script-heading";
import { Sprig } from "@/components/cozy/sprig";

// "Cosas ricas pasan aquí", handwritten, with the motto under it
export function HomeIntro() {
  return (
    <div className="relative flex flex-col gap-4 pt-2 lg:pt-6">
      <Sprig className="absolute -top-1 -left-1 h-5 w-9 -rotate-12 lg:top-3" />
      <ScriptHeading className="pl-6 text-[clamp(3.2rem,2.4rem+3vw,4.4rem)] lg:text-[clamp(3.6rem,1.6rem+3.2vw,5.4rem)]">
        Cosas <br className="max-lg:hidden" />
        <span className="lg:pl-[0.6em]">ricas</span>
        <br />
        pasan aquí
      </ScriptHeading>
      <Tagline className="pl-6">Recetas · Mercadona · Un día mejor</Tagline>
      <Squiggle className="ml-6" />
    </div>
  );
}
