
"use client";

import type { Project } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useState } from 'react';
import { Lightbox } from '../ui/lightbox';

interface ProjectShowcaseProps {
  project: Project;
}

export function ProjectShowcase({ project }: ProjectShowcaseProps) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const renderMedia = () => {
    const hasFlowchart = !!project.flowchart_url;
    const hasDemoPhoto = !!project.demo_photo_url;
    const hasDemoVideo = !!project.demo_video_url;
    
    if (!hasFlowchart && !hasDemoPhoto && !hasDemoVideo) return null;

    const mediaItems = [
        hasDemoPhoto && (
           <div key="demo-photo">
            <h3 className="text-lg font-semibold mb-2">Demo Screenshot</h3>
             <div className="relative aspect-video rounded-md overflow-hidden border border-border cursor-pointer" onClick={() => setLightboxImage(project.demo_photo_url!)}>
               <Image src={project.demo_photo_url!} alt="Demo" layout="fill" objectFit="cover" data-ai-hint="dashboard analytics" />
            </div>
           </div>
        ),
        hasFlowchart && (
          <div key="flowchart">
            <h3 className="text-lg font-semibold mb-2">Flowchart</h3>
            <div className="relative aspect-video rounded-md overflow-hidden border border-border cursor-pointer" onClick={() => setLightboxImage(project.flowchart_url!)}>
              <Image src={project.flowchart_url!} alt="Flowchart" layout="fill" objectFit="cover" data-ai-hint="flowchart diagram"/>
            </div>
          </div>
        ),
    ].filter(Boolean);

    return (
        <div className='space-y-4'>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mediaItems}
            </div>
            {hasDemoVideo && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Demo Video</h3>
                    <div className="aspect-video bg-black rounded-md overflow-hidden border border-border">
                        <video src={project.demo_video_url} controls className="w-full h-full object-contain" />
                    </div>
                </div>
            )}
        </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      {lightboxImage && <Lightbox imageUrl={lightboxImage} onClose={() => setLightboxImage(null)} />}
      <div>
        <h2 className="text-3xl font-bold text-foreground">{project.title}</h2>
        {project.description && <p className="text-muted-foreground mt-1">{project.description}</p>}
      </div>

      {project.myContribution && (
        <div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">My Contribution</h3>
          <p className="text-foreground/80 leading-relaxed">{project.myContribution}</p>
        </div>
      )}

      {project.techStack && project.techStack.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-3 text-foreground">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map(tech => (
              <Badge key={tech} variant="secondary" className="text-sm bg-primary/10 text-primary-foreground border-primary/20">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {renderMedia()}

    </div>
  );
}
