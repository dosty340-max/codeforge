import Link from "next/link";
import { Globe } from "lucide-react";
import { ShareLink } from "@/components/dashboard/share-link";
import { Card } from "@/components/ui/card";
import { getProjects } from "@/lib/data";

export default async function SharedPage() {
  const shared = (await getProjects()).filter((project) => project.shareToken);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Shared Results</h1>
        <p className="text-sm text-muted-foreground">Public links to your projects</p>
      </div>

      {shared.length === 0 ? (
        <Card className="border-border bg-card p-8 text-center gap-0">
          <Globe className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            No shared projects yet. Open a{" "}
            <Link href="/home/projects" className="text-lime hover:underline">project</Link>{" "}
            and press Share to create a public link.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {shared.map((project) => (
            <Card key={project.id} className="gap-0 border-border bg-card p-4">
              <Link href={`/home/projects/${project.id}`} className="mb-3 block text-sm font-semibold hover:text-lime">
                {project.name}
              </Link>
              <ShareLink projectId={project.id} token={project.shareToken!} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
