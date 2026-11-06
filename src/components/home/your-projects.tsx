import Link from "next/link";
import { connection } from "next/server";
import { ArrowRight } from "lucide-react";
import { AutoRefresh } from "@/components/dashboard/auto-refresh";
import { ProjectCard } from "@/components/dashboard/project-card";
import { getProjects } from "@/lib/data";

async function loadProjects() {
  try {
    return await getProjects();
  } catch (error) {
    // The public page must keep working when projects cannot be loaded.
    console.error("Could not load projects:", error);
    return [];
  }
}

export async function YourProjects() {
  // Outside the try block: Next.js uses this rejection to stop prerendering, it must not be caught.
  await connection();
  const projects = await loadProjects();
  if (projects.length === 0) return null;

  return (
    <section className="mt-10">
      <AutoRefresh />
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Your projects</h2>
        <Link href="/home/projects" className="flex items-center gap-1 text-xs text-lime hover:underline">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.slice(0, 3).map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
