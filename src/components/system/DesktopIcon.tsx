
"use client";

import type { Category } from "@/lib/types";
import { useDesktop } from "@/contexts/DesktopContext";
import { Folder } from "lucide-react";

interface DesktopIconProps {
  category: Category;
}

export function DesktopIcon({ category }: DesktopIconProps) {
  const { openWindow } = useDesktop();
  
  const handleDoubleClick = () => {
    openWindow({
      id: category.id,
      title: category.name,
      icon: Folder,
      type: 'CATEGORY'
    });
  };

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className="flex flex-col items-center gap-1 w-24 h-24 p-2 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer select-none"
      title={category.name}
    >
      <Folder className="w-14 h-14 text-primary" strokeWidth={1} />
      <p className="text-sm text-center text-white font-medium truncate w-full" style={{ textShadow: '0 0 5px hsl(var(--primary))' }}>
        {category.name}
      </p>
    </div>
  );
}
