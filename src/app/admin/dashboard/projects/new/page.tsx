
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Category, ProjectFile } from '@/lib/types';
import { ArrowLeft, UploadCloud, X, File as FileIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';

export default function NewProjectPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [myContribution, setMyContribution] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [techStack, setTechStack] = useState('');
  const [demoPhotoUrl, setDemoPhotoUrl] = useState('');
  const [demoVideoUrl, setDemoVideoUrl] = useState('');
  const [flowchartUrl, setFlowchartUrl] = useState('');
  const [otherFiles, setOtherFiles] = useState<ProjectFile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        toast({ title: "Error", description: "Failed to load categories.", variant: "destructive" });
      }
    };
    fetchCategories();
  }, [toast]);

  const handleFileChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
          setOtherFiles(prev => [...prev, { name: file.name, dataUri: loadEvent.target!.result as string }]);
        }
      };
      reader.readAsDataURL(file);
      e.target.value = ''; // Reset file input
    }
  };

  const removeOtherFile = (index: number) => {
    setOtherFiles(files => files.filter((_, i) => i !== index));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const projectData = {
      title,
      description,
      myContribution,
      categoryId,
      techStack: techStack.split(',').map(s => s.trim()),
      demo_photo_url: demoPhotoUrl,
      demo_video_url: demoVideoUrl,
      flowchart_url: flowchartUrl,
      otherFiles: otherFiles
    };

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) throw new Error('Failed to create project.');
      
      toast({
        title: "Project Created",
        description: `"${title}" has been successfully created.`,
      });
      router.push('/admin/dashboard/projects');
      router.refresh();
    } catch (error) {
      toast({ title: "Error", description: "Could not create project.", variant: "destructive" });
      setIsSubmitting(false);
    }
  };

  const renderMediaInput = (id: string, label: string, value: string, setter: React.Dispatch<React.SetStateAction<string>>) => (
    <div className="space-y-2">
      <Label htmlFor={`${id}-url`}>{label}</Label>
      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url" disabled={isSubmitting}>URL</TabsTrigger>
          <TabsTrigger value="upload" disabled={isSubmitting}>Upload</TabsTrigger>
        </TabsList>
        <TabsContent value="url">
          <Input id={`${id}-url`} value={value} onChange={(e) => setter(e.target.value)} placeholder="https://example.com/image.jpg" disabled={isSubmitting} />
        </TabsContent>
        <TabsContent value="upload">
          <Input id={`${id}-upload`} type="file" onChange={handleFileChange(setter)} disabled={isSubmitting} />
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
       <Link href="/admin/dashboard/projects" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4 shrink-0">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
        </Link>
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
          <CardDescription>Fill out the form below to add a new project to your portfolio.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Interactive Data Dashboard" disabled={isSubmitting} required />
              </div>
               <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                  <Select onValueChange={setCategoryId} value={categoryId} disabled={isSubmitting} required>
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
                <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A brief summary of the project." disabled={isSubmitting} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="myContribution">My Contribution</Label>
                <Textarea id="myContribution" value={myContribution} onChange={(e) => setMyContribution(e.target.value)} placeholder="Describe your role and contributions..." rows={5} disabled={isSubmitting} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="techStack">Tech Stack (comma-separated)</Label>
                <Input id="techStack" value={techStack} onChange={(e) => setTechStack(e.target.value)} placeholder="e.g., React, Next.js, Tailwind CSS" disabled={isSubmitting} />
              </div>
              
              {renderMediaInput("demoPhoto", "Demo Photo", demoPhotoUrl, setDemoPhotoUrl)}
              {renderMediaInput("flowchart", "Flowchart", flowchartUrl, setFlowchartUrl)}
              {renderMediaInput("demoVideo", "Demo Video", demoVideoUrl, setDemoVideoUrl)}

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
                    {otherFiles.map((file, index) => (
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
                  <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create Project'}</Button>
              </div>
            </form>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
