"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { FileText, Home, Mail, Star } from "lucide-react"
import Link from 'next/link';
import { useDesktop } from "@/contexts/DesktopContext";

export function StartMenu() {
  const { openWindow } = useDesktop();

  const menuItems = [
    { name: 'Home', icon: Home, href: '/', action: () => {} },
    { name: 'Blogs', icon: FileText, href: '#', action: () => openWindow({id: 'blogs', title: 'Blogs', icon: FileText, type: 'BLOGS' }) },
    { name: 'Contact', icon: Mail, href: '#', action: () => openWindow({id: 'contact', title: 'Contact Me', icon: Mail, type: 'CONTACT' }) },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-10 w-10 p-0 hover:bg-white/20">
            <Star className="w-6 h-6 text-primary fill-primary" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" align="start" className="w-64 glassmorphic border-none p-2 mb-2">
        <div className="flex flex-col gap-1">
            <div className="p-2">
                <h3 className="text-lg font-bold text-foreground">aathisivan.dev</h3>
                <p className="text-sm text-foreground/70">Liquid Crystal OS</p>
            </div>
          {menuItems.map((item) => {
            const content = (
              <div
                onClick={item.action}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-primary/20 cursor-pointer transition-colors"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && item.action()}
                >
                <item.icon className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">{item.name}</span>
              </div>
            );

            return item.href === "/" ? <Link href="/" key={item.name}>{content}</Link> : <div key={item.name}>{content}</div>;
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
