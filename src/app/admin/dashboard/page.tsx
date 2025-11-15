
"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const [stats, setStats] = useState([
    { title: "Categories", count: 0, href: "/admin/dashboard/categories" },
    { title: "Projects", count: 0, href: "/admin/dashboard/projects" },
    { title: "Blog Posts", count: 0, href: "/admin/dashboard/blogs" },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      setIsLoading(true);
      try {
        const [catRes, projRes, blogRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/projects'),
          fetch('/api/blogs'),
        ]);

        const catData = await catRes.json();
        const projData = await projRes.json();
        const blogData = await blogRes.json();

        setStats([
          { title: "Categories", count: catData.length, href: "/admin/dashboard/categories" },
          { title: "Projects", count: projData.length, href: "/admin/dashboard/projects" },
          { title: "Blog Posts", count: blogData.length, href: "/admin/dashboard/blogs" },
        ]);

      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCounts();
  }, []);

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
              {isLoading ? (
                <Skeleton className="h-8 w-12 mt-1" />
              ) : (
                <div className="text-2xl font-bold">{stat.count}</div>
              )}
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
