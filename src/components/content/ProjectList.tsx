
"use client";

import { useEffect, useState } from 'react';
import { useDesktop } from "@/contexts/DesktopContext";
import { ProjectShowcase } from "./ProjectShowcase";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/types";
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

interface ProjectListProps {
  categoryId: string;
  categoryName: string;
}

export function ProjectList({ categoryId, categoryName }: ProjectListProps) {
  const { openWindow } = useDesktop();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/projects?category=${categoryId}`);
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        toast({ title: "Error", description: "Could not load projects for this category.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [categoryId, toast]);

  const handleProjectClick = (project: Project) => {
    openWindow({
      id: `project-${project.id}`,
      title: project.title,
      content: <ProjectShowcase project={project} />,
      type: 'PROJECT',
      size: { width: 800, height: 600 }
    });
  };

  if (isLoading) {
    return (
      <div className="p-2">
        <h2 className="text-2xl font-bold mb-4 text-foreground">{categoryName} Projects</h2>
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="p-4 rounded-lg bg-background/50 border border-border">
              <div className="flex justify-between items-center">
                <div>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
          <p className="text-muted-foreground text-center py-4">No projects in this category yet.</p>
        )}
      </div>
    </div>
  );
}
