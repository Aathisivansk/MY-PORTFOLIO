
"use client";

import type { Project, ProjectFile } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useState } from 'react';
import { Lightbox } from '../ui/lightbox';
import { Button } from '../ui/button';
import { Download, File as FileIcon, Github, Link as LinkIcon } from 'lucide-react';

interface ProjectShowcaseProps {
  project: Project;
}

export function ProjectShowcase({ project }: ProjectShowcaseProps) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const handleFileDownload = (file: ProjectFile) => {
    const link = document.createElement('a');
    link.href = file.dataUri;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
  
  const renderOtherFiles = () => {
    if (!project.otherFiles || project.otherFiles.length === 0) return null;

    return (
      <div>
        <h3 className="text-xl font-semibold mb-3 text-foreground">Project Files</h3>
        <div className="space-y-2">
            {project.otherFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border">
                    <div className="flex items-center gap-3">
                        <FileIcon className="h-6 w-6 text-primary" />
                        <span className="font-medium text-foreground">{file.name}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleFileDownload(file)}>
                        <Download className="text-primary"/>
                    </Button>
                </div>
            ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      {lightboxImage && <Lightbox imageUrl={lightboxImage} onClose={() => setLightboxImage(null)} />}
      <div>
        <h2 className="text-3xl font-bold text-foreground">{project.title}</h2>
        <div className="flex items-center gap-4 mt-2">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
                <span>GitHub Repository</span>
              </a>
            )}
            {project.socialUrl && (
              <a href={project.socialUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <LinkIcon className="h-5 w-5" />
                <span>Live Demo / More Info</span>
              </a>
            )}
        </div>
        {project.description && <p className="text-muted-foreground mt-2">{project.description}</p>}
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
      
      {renderOtherFiles()}

    </div>
  );
}
