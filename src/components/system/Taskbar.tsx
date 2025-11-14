
"use client";

import { Github, Linkedin } from 'lucide-react';
import { StartMenu } from './StartMenu';
import { useDesktop } from '@/contexts/DesktopContext';
import { Button } from '@/components/ui/button';
import { LiveClock } from './LiveClock';

export function Taskbar() {
  const { windows, focusWindow, toggleMinimize } = useDesktop();

  const handleTaskbarButtonClick = (id: string) => {
    const win = windows.find(w => w.id === id);
    if (win?.isFocused && !win.isMinimized) {
      toggleMinimize(id);
    } else {
      focusWindow(id);
    }
  };
  
  return (
    <footer className="fixed bottom-2 left-1/2 -translate-x-1/2 w-[98%] max-w-7xl h-14 bg-black/30 backdrop-blur-xl border border-white/20 rounded-lg flex items-center justify-between px-3 z-50 shadow-lg">
      <div className="flex items-center gap-2">
        <StartMenu />
        <div className="h-8 w-px bg-white/20" />
        <div className="flex items-center gap-1">
          {windows.map(win => {
            const Icon = win.icon;
            return (
              <Button
                key={win.id}
                variant="ghost"
                className={`h-10 px-3 flex items-center gap-2 transition-colors duration-200 text-white ${
                  win.isFocused && !win.isMinimized
                    ? 'bg-primary/30'
                    : 'hover:bg-white/20'
                }`}
                onClick={() => handleTaskbarButtonClick(win.id)}
              >
                {Icon && <Icon className="w-5 h-5" />}
                <span className="hidden sm:inline text-sm truncate max-w-[100px]">{win.title}</span>
                {win.isMinimized && <div className="w-1.5 h-1.5 bg-primary rounded-full" />}
              </Button>
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <LiveClock />
        <div className="h-8 w-px bg-white/20" />
        <a href="https://github.com/aathisivan" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-primary transition-colors">
          <Github className="w-6 h-6" />
        </a>
        <a href="https://www.linkedin.com/in/aathisivan" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-primary transition-colors">
          <Linkedin className="w-6 h-6" />
        </a>
      </div>
    </footer>
  );
}
