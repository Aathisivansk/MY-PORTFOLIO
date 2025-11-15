
"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import type { BlogPost } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/blogs');
        if (!res.ok) throw new Error("Failed to fetch blog posts");
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        toast({ title: "Error", description: "Could not load blog posts.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="p-2 space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Blog</h2>
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="bg-background/50 border-border">
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="p-2 space-y-4">
       <h2 className="text-2xl font-bold text-foreground">Blog</h2>
       {posts.map(post => (
         <Card key={post.id} className="bg-background/50 border-border">
           <CardHeader>
             <CardTitle>{post.title}</CardTitle>
             <CardDescription>
               By {post.author} on {format(new Date(post.createdAt), 'MMMM d, yyyy')}
             </CardDescription>
           </CardHeader>
           <CardContent>
             <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
           </CardContent>
         </Card>
       ))}
       {posts.length === 0 && (
          <p className="text-muted-foreground text-center py-4">No blog posts found.</p>
       )}
    </div>
  );
}
