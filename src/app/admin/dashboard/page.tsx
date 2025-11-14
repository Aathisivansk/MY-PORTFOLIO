"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORIES, PROJECTS, BLOG_POSTS } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    { title: "Categories", count: CATEGORIES.length, href: "/admin/dashboard/categories" },
    { title: "Projects", count: PROJECTS.length, href: "/admin/dashboard/projects" },
    { title: "Blog Posts", count: BLOG_POSTS.length, href: "/admin/dashboard/blogs" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.count}</div>
              <Link href={stat.href} className="text-xs text-muted-foreground flex items-center gap-1 hover:text-primary">
                View All <ArrowUpRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
            <Button asChild><Link href="/admin/dashboard/projects/new">New Project</Link></Button>
            <Button asChild variant="secondary"><Link href="/admin/dashboard/blogs/new">New Blog Post</Link></Button>
        </div>
      </div>
    </div>
  );
}
