"use client";

import { BLOG_POSTS } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

export function BlogList() {
  return (
    <div className="p-2 space-y-4">
       <h2 className="text-2xl font-bold text-foreground">Blog</h2>
       {BLOG_POSTS.map(post => (
         <Card key={post.id} className="bg-background/50 border-border">
           <CardHeader>
             <CardTitle>{post.title}</CardTitle>
             <CardDescription>
               By {post.author} on {format(new Date(post.createdAt), 'MMMM d, yyyy')}
             </CardDescription>
           </CardHeader>
           <CardContent>
             <div className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: post.content }} />
           </CardContent>
         </Card>
       ))}
    </div>
  );
}
