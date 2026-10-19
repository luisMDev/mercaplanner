import { ScriptHeading, Squiggle } from "@/components/cozy/script-heading";

// "Cosas ricas pasan aquí", handwritten
export function HomeIntro() {
  return (
    <div className="relative flex flex-col gap-4 pt-2 lg:pt-6">
      <ScriptHeading className="pl-6 text-[clamp(3.2rem,2.4rem+3vw,4.4rem)] lg:text-[clamp(3.6rem,1.6rem+3.2vw,5.4rem)]">
        Cosas <br className="max-lg:hidden" />
        <span className="lg:pl-[0.6em]">ricas</span>
        <br />
        pasan aquí
      </ScriptHeading>
      <Squiggle className="ml-6" />
    </div>
  );
}
