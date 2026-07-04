import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RequirementGroupCardProps {
  title: string;
  dotClassName: string;
  showMoreLabel?: string;
  onShowMore?: () => void;
  children: React.ReactNode;
}

/** Wrapper card for a labelled group of requirements with an optional "show more" footer link. */
function RequirementGroupCard({
  title,
  dotClassName,
  showMoreLabel,
  onShowMore,
  children,
}: RequirementGroupCardProps) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b px-5 py-4">
        <CardTitle className="flex items-center gap-2 text-sm text-slate-800">
          <span
            className={cn("size-2 rounded-full", dotClassName)}
            aria-hidden="true"
          />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 py-1">
        <div className="max-h-[calc(50vh-8rem)] overflow-y-auto">
          {children}
        </div>
        {showMoreLabel ? (
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 py-3 text-sm text-indigo-600"
            onClick={onShowMore}
          >
            {showMoreLabel}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export { RequirementGroupCard };
