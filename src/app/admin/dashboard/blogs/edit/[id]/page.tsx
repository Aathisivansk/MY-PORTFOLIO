
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BLOG_POSTS } from '@/lib/data';
import type { BlogPost } from '@/lib/types';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const blogId = params.id as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const postToEdit = BLOG_POSTS.find(p => p.id === blogId);
    if (postToEdit) {
      setPost(postToEdit);
    } else {
      toast({ title: "Error", description: "Blog post not found.", variant: "destructive" });
      router.push('/admin/dashboard/blogs');
    }
  }, [blogId, router, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;
    
    // In a real app, you'd send this to an API
    const postIndex = BLOG_POSTS.findIndex(p => p.id === blogId);
    if (postIndex !== -1) {
      BLOG_POSTS[postIndex] = post;
    }

    console.log("Updating post:", post);
    toast({
      title: "Blog Post Updated",
      description: `"${post.title}" has been successfully updated.`,
    });
    router.push('/admin/dashboard/blogs');
  };

  const handleInputChange = (field: keyof BlogPost, value: string) => {
    if (post) {
        setPost({ ...post, [field]: value });
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full">
        <Link href="/admin/dashboard/blogs" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4 shrink-0">
            <ArrowLeft className="w-4 h-4" />
            Back to Blogs
        </Link>
        <Card className="flex-1 flex flex-col">
            <CardHeader>
            <CardTitle>Edit Blog Post</CardTitle>
            <CardDescription>Update the details for this article.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <ScrollArea className="h-full pr-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={post.title} onChange={(e) => handleInputChange('title', e.target.value)} placeholder="Enter blog title" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="author">Author</Label>
                        <Input id="author" value={post.author} onChange={(e) => handleInputChange('author', e.target.value)} placeholder="Enter author's name" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">Content (HTML)</Label>
                        <Textarea id="content" value={post.content} onChange={(e) => handleInputChange('content', e.target.value)} placeholder="<p>Write your blog content here...</p>" rows={15} />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>
              </ScrollArea>
            </CardContent>
        </Card>
    </div>
  );
}
