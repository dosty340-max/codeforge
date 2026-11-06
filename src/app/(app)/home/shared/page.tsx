import { Card } from "@/components/ui/card";
import { Globe } from "lucide-react";

export default function SharedPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Shared Results</h1>
        <p className="text-sm text-muted-foreground">Public links to your completed projects</p>
      </div>

      <Card className="border-border bg-card p-8 text-center gap-0">
        <Globe className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">
          No shared projects yet. Complete a project and share it with a public link.
        </p>
      </Card>
    </div>
  );
}
