
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, UploadCloud, File as FileIcon, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Project, Category, ProjectFile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (!projectId) return;
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [projRes, catRes] = await Promise.all([
          fetch(`/api/projects/${projectId}`),
          fetch('/api/categories'),
        ]);

        if (!projRes.ok) throw new Error('Project not found');

        const projectData = await projRes.json();
        const categoriesData = await catRes.json();
        
        setProject(projectData);
        setCategories(categoriesData);

      } catch (error) {
        toast({ title: "Error", description: "Failed to load project data.", variant: "destructive" });
        router.push('/admin/dashboard/projects');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [projectId, router, toast]);

  const handleFileChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (loadEvent.target && typeof loadEvent.target.result === 'string') {
          setter(loadEvent.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOtherFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (loadEvent.target && typeof loadEvent.target.result === 'string') {
          handleInputChange('otherFiles', [...(project?.otherFiles || []), { name: file.name, dataUri: loadEvent.target!.result as string }]);
        }
      };
      reader.readAsDataURL(file);
      e.target.value = ''; // Reset file input
    }
  };

  const removeOtherFile = (index: number) => {
    if (project) {
        const updatedFiles = project.otherFiles?.filter((_, i) => i !== index);
        handleInputChange('otherFiles', updatedFiles || []);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });

      if (!response.ok) throw new Error('Failed to update project.');

      toast({
        title: "Project Updated",
        description: `"${project.title}" has been successfully updated.`,
      });
      router.push('/admin/dashboard/projects');
      router.refresh();
    } catch (error) {
       toast({ title: "Error", description: "Could not update project.", variant: "destructive" });
       setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof Project, value: any) => {
    if (project) {
        setProject({ ...project, [field]: value });
    }
  };

  const renderMediaInput = (id: string, label: string, value: string, setter: (value: string) => void) => (
    <div className="space-y-2">
      <Label htmlFor={`${id}-url`}>{label}</Label>
      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url" disabled={isSubmitting}>URL</TabsTrigger>
          <TabsTrigger value="upload" disabled={isSubmitting}>Upload</TabsTrigger>
        </TabsList>
        <TabsContent value="url">
          <Input id={`${id}-url`} value={value || ''} onChange={(e) => setter(e.target.value)} placeholder="https://example.com/image.jpg" disabled={isSubmitting} />
        </TabsContent>
        <TabsContent value="upload">
          <Input id={`${id}-upload`} type="file" onChange={handleFileChange(setter)} disabled={isSubmitting} />
        </TabsContent>
      </Tabs>
    </div>
  );

  if (isLoading || !project) {
    return (
        <div className="space-y-4 p-4">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
       <Link href="/admin/dashboard/projects" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4 shrink-0">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
        </Link>
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>Edit Project: {project.title}</CardTitle>
          <CardDescription>Update the details for this project.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input id="title" value={project.title} onChange={(e) => handleInputChange('title', e.target.value)} placeholder="e.g., Interactive Data Dashboard" disabled={isSubmitting} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                  <Select onValueChange={(val) => handleInputChange('categoryId', val)} value={project.categoryId} disabled={isSubmitting}>
                      <SelectTrigger id="category">
                          <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                          {categories.map(category => (
                              <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Input id="description" value={project.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder="A brief summary of the project." disabled={isSubmitting} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="myContribution">My Contribution</Label>
                <Textarea id="myContribution" value={project.myContribution} onChange={(e) => handleInputChange('myContribution', e.target.value)} placeholder="Describe your role and contributions..." rows={5} disabled={isSubmitting} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="techStack">Tech Stack (comma-separated)</Label>
                <Input id="techStack" value={project.techStack.join(', ')} onChange={(e) => handleInputChange('techStack', e.target.value.split(',').map(s => s.trim()))} placeholder="e.g., React, Next.js, Tailwind CSS" disabled={isSubmitting} />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="githubUrl">GitHub URL</Label>
                  <Input id="githubUrl" value={project.githubUrl || ''} onChange={(e) => handleInputChange('githubUrl', e.target.value)} placeholder="https://github.com/user/repo" disabled={isSubmitting} />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="socialUrl">Other Link (e.g., Live Demo, LinkedIn)</Label>
                  <Input id="socialUrl" value={project.socialUrl || ''} onChange={(e) => handleInputChange('socialUrl', e.target.value)} placeholder="https://example.com" disabled={isSubmitting} />
              </div>
              
              {renderMediaInput("demoPhoto", "Demo Photo", project.demo_photo_url || '', (val) => handleInputChange('demo_photo_url', val))}
              {renderMediaInput("flowchart", "Flowchart", project.flowchart_url || '', (val) => handleInputChange('flowchart_url', val))}
              {renderMediaInput("demoVideo", "Demo Video", project.demo_video_url || '', (val) => handleInputChange('demo_video_url', val))}

              <div className="space-y-4">
                <Label>Other Project Files</Label>
                <div className="border border-dashed border-input rounded-md p-4 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                    <Label htmlFor="other-files-upload" className="cursor-pointer text-primary font-medium mt-2 block">
                        Click to upload files
                    </Label>
                    <Input id="other-files-upload" type="file" className="hidden" onChange={handleOtherFilesChange} disabled={isSubmitting} />
                </div>
                <div className="space-y-2">
                    {project.otherFiles?.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-md bg-secondary">
                            <div className="flex items-center gap-2">
                                <FileIcon className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm font-medium">{file.name}</span>
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeOtherFile(index)} disabled={isSubmitting}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
              </div>
            </form>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
