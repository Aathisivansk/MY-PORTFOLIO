"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CATEGORIES } from '@/lib/data';
import { ArrowLeft } from 'lucide-react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd send this to an API
    console.log({
      title,
      description,
      myContribution,
      categoryId,
      techStack: techStack.split(',').map(s => s.trim()),
      demo_photo_url: demoPhotoUrl,
      demo_video_url: demoVideoUrl,
      flowchart_url: flowchartUrl,
    });
    toast({
      title: "Project Created",
      description: `"${title}" has been successfully created.`,
    });
    router.push('/admin/dashboard/projects');
  };

  return (
    <div className="max-w-4xl mx-auto">
       <Link href="/admin/dashboard/projects" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
        </Link>
      <Card>
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
          <CardDescription>Fill out the form below to add a new project to your portfolio.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Interactive Data Dashboard" required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
                <Select onValueChange={setCategoryId} value={categoryId} required>
                    <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        {CATEGORIES.map(category => (
                            <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A brief summary of the project." required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="myContribution">My Contribution</Label>
              <Textarea id="myContribution" value={myContribution} onChange={(e) => setMyContribution(e.target.value)} placeholder="Describe your role and contributions..." required rows={5} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="techStack">Tech Stack (comma-separated)</Label>
              <Input id="techStack" value={techStack} onChange={(e) => setTechStack(e.target.value)} placeholder="e.g., React, Next.js, Tailwind CSS" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="demoPhotoUrl">Demo Photo URL</Label>
                    <Input id="demoPhotoUrl" value={demoPhotoUrl} onChange={(e) => setDemoPhotoUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="flowchartUrl">Flowchart URL</Label>
                    <Input id="flowchartUrl" value={flowchartUrl} onChange={(e) => setFlowchartUrl(e.target.value)} placeholder="https://example.com/flowchart.png" />
                </div>
            </div>
             <div className="space-y-2">
              <Label htmlFor="demoVideoUrl">Demo Video URL</Label>
              <Input id="demoVideoUrl" value={demoVideoUrl} onChange={(e) => setDemoVideoUrl(e.target.value)} placeholder="https://example.com/video.mp4" />
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit">Create Project</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
