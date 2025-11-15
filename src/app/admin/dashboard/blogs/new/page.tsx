
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function NewBlogPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('aathisivan.dev');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author, content }),
      });

      if (!response.ok) {
        throw new Error('Failed to create blog post');
      }

      toast({
        title: "Blog Post Created",
        description: `"${title}" has been successfully created.`,
      });
      router.push('/admin/dashboard/blogs');
      router.refresh(); // To reflect changes on the blogs page
    } catch (error) {
      toast({ title: "Error", description: "Could not create blog post.", variant: "destructive" });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
        <Link href="/admin/dashboard/blogs" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4 shrink-0">
            <ArrowLeft className="w-4 h-4" />
            Back to Blogs
        </Link>
        <Card className="flex-1 flex flex-col">
            <CardHeader>
            <CardTitle>Create New Blog Post</CardTitle>
            <CardDescription>Fill out the form below to publish a new article.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <ScrollArea className="h-full pr-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter blog title" required disabled={isSubmitting} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="author">Author</Label>
                        <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Enter author's name" required disabled={isSubmitting} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">Content (HTML)</Label>
                        <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="<p>Write your blog content here...</p>" required rows={15} disabled={isSubmitting} />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create Post'}</Button>
                    </div>
                </form>
              </ScrollArea>
            </CardContent>
        </Card>
    </div>
  );
}
