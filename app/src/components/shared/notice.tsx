import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

// Card with a message in place of a view: no meals today, products that failed to load
export function Notice({
  icon,
  title,
  description,
  children,
}: {
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Card className="glass py-0 shadow-card">
      <Empty className="gap-3 px-5 py-7">
        <EmptyHeader>
          {icon && <EmptyMedia variant="icon">{icon}</EmptyMedia>}
          <EmptyTitle className="text-[1.1rem] font-semibold">{title}</EmptyTitle>
          {description && <EmptyDescription className="text-[0.9rem]">{description}</EmptyDescription>}
        </EmptyHeader>
        {children && <EmptyContent>{children}</EmptyContent>}
      </Empty>
    </Card>
  );
}
