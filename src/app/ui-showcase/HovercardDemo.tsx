import { Button } from "#src/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "#src/components/ui/hover-card";
import { cn } from "#src/utils/cn";

type Props = {
  className?: string;
};

export function HovercardDemo({ className }: Props) {
  return (
    <div className={cn("", className)}>
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </HoverCardTrigger>
        <HoverCardContent>The React Framework created and maintained by @vercel.</HoverCardContent>
      </HoverCard>
    </div>
  );
}
