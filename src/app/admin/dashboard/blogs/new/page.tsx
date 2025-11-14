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

export default function NewBlogPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('aathisivan.dev');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd send this to an API
    console.log({ title, author, content });
    toast({
      title: "Blog Post Created",
      description: `"${title}" has been successfully created.`,
    });
    router.push('/admin/dashboard/blogs');
  };

  return (
    <div className="max-w-4xl mx-auto">
        <Link href="/admin/dashboard/blogs" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Blogs
        </Link>
        <Card>
            <CardHeader>
            <CardTitle>Create New Blog Post</CardTitle>
            <CardDescription>Fill out the form below to publish a new article.</CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter blog title" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Enter author's name" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="content">Content (HTML)</Label>
                    <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="<p>Write your blog content here...</p>" required rows={10} />
                </div>
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit">Create Post</Button>
                </div>
            </form>
            </CardContent>
        </Card>
    </div>
  );
}
