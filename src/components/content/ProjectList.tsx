"use client";

import { PROJECTS } from "@/lib/data";
import { useDesktop } from "@/contexts/DesktopContext";
import { ProjectShowcase } from "./ProjectShowcase";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/types";

interface ProjectListProps {
  categoryId: string;
  categoryName: string;
}

export function ProjectList({ categoryId, categoryName }: ProjectListProps) {
  const { openWindow } = useDesktop();
  const projects = PROJECTS.filter(p => p.categoryId === categoryId);

  const handleProjectClick = (project: Project) => {
    openWindow({
      id: `project-${project.id}`,
      title: project.title,
      content: <ProjectShowcase project={project} />,
      type: 'PROJECT',
      size: { width: 800, height: 600 }
    });
  };

  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold mb-4 text-foreground">{categoryName} Projects</h2>
      <div className="space-y-4">
        {projects.map(project => (
          <div
            key={project.id}
            className="p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors cursor-pointer border border-border"
            onClick={() => handleProjectClick(project)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg text-foreground">{project.title}</h3>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </div>
              <Button variant="ghost" size="icon">
                <ArrowRight className="text-primary"/>
              </Button>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-muted-foreground">No projects in this category yet.</p>
        )}
      </div>
    </div>
  );
}
