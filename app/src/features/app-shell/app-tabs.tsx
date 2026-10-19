import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StickyBar } from "./sticky-bar";
import { VIEWS } from "./views";

// Segmented control with the four tabs, pinned while scrolling
export function AppTabs() {
  return (
    <StickyBar>
      <TabsList className="max-w-full gap-0.5 overflow-x-auto rounded-full border bg-secondary p-[3px] shadow-card [scrollbar-width:none] group-data-horizontal/tabs:h-auto">
        {VIEWS.map(({ id, label, icon: Icon }) => (
          <TabsTrigger
            key={id}
            value={id}
            title={label}
            aria-label={label}
            className="group/tab h-[34px] flex-none gap-[7px] rounded-full px-3.5 text-[0.88rem] font-semibold text-muted-foreground max-[480px]:px-[11px] max-[480px]:text-[0.84rem] data-active:bg-primary-soft data-active:text-primary-strong group-data-[variant=default]/tabs-list:data-active:shadow-none dark:data-active:border-transparent dark:data-active:bg-primary-soft dark:data-active:text-primary-strong"
          >
            <Icon className="size-[18px]" />
            {/* Four tabs with names do not fit a phone: only the active one keeps its name */}
            <span className="max-[440px]:group-data-[state=inactive]/tab:hidden">{label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </StickyBar>
  );
}
