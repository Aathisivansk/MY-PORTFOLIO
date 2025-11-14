
"use client";

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import useLocalStorage from "@/hooks/use-local-storage"
import { LayoutDashboard, Newspaper, Folder, LogOut, Code, Home } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [, setIsAuthenticated] = useLocalStorage('is-authenticated', false);

  const handleLogout = () => {
    setIsAuthenticated(false);
    router.push('/admin');
  };

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/dashboard/categories", label: "Categories", icon: Folder },
    { href: "/admin/dashboard/projects", label: "Projects", icon: Code },
    { href: "/admin/dashboard/blogs", label: "Blogs", icon: Newspaper },
  ];

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <aside className="hidden w-64 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col gap-2 p-4">
            <h2 className="text-lg font-semibold mb-2">Admin Panel</h2>
          {navItems.map((item) => (
            <Link key={item.label} href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
        <div className="mt-auto p-4 flex flex-col gap-2">
             <Link href="/">
              <Button variant="outline" className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                View Site
              </Button>
            </Link>
            <Button variant="outline" onClick={handleLogout} className="w-full justify-start">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </Button>
        </div>
      </aside>
      <div className="flex flex-1 flex-col sm:py-6 sm:px-6 h-screen">
        <main className="flex-1 overflow-auto p-4 sm:p-0">
          {children}
        </main>
      </div>
    </div>
  )
}
