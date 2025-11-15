
"use client";

import type { WindowInstance, Category } from '@/lib/types';
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ProjectList } from '@/components/content/ProjectList';
import { BlogList } from '@/components/content/BlogList';
import { ContactForm } from '@/components/content/ContactForm';
import { Code, FileText, Mail, Folder } from 'lucide-react';
import { ThemeProvider } from './ThemeContext';
import { useToast } from '@/hooks/use-toast';

interface DesktopContextType {
  windows: WindowInstance[];
  categories: Category[];
  openWindow: (args: OpenWindowArgs) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  toggleMinimize: (id: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;
  toggleMaximize: (id: string) => void;
  getInitialPosition: () => { x: number; y: number };
}

const DesktopContext = createContext<DesktopContextType | undefined>(undefined);

type OpenWindowArgs = {
  id: string;
  title: string;
  icon?: React.ElementType;
  content?: React.ReactNode;
  type: 'CATEGORY' | 'BLOGS' | 'CONTACT' | 'PROJECT';
  size?: { width: number; height: number };
};

let windowCount = 0;
let highestZIndex = 0;

const DesktopProviderInternal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { toast } = useToast();

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      toast({ title: "Error", description: "Could not load desktop icons.", variant: "destructive" });
    }
  }, [toast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);


  const getInitialPosition = useCallback(() => {
    const openWindows = windows.filter(w => !w.isMinimized);
    const offset = (openWindows.length % 10) * 20;
    const desktop = document.getElementById('desktop');
    const desktopWidth = desktop?.clientWidth || window.innerWidth;
    const desktopHeight = desktop?.clientHeight || window.innerHeight;

    return {
      x: Math.max(0, (desktopWidth / 10) + offset),
      y: Math.max(0, (desktopHeight / 10) + offset),
    };
  }, [windows]);

  const openWindow = useCallback(({ id, title, icon, type, content, size: initialSize }: OpenWindowArgs) => {
    // Re-fetch categories when a window is opened to catch any updates.
    if (type === 'CATEGORY') {
      fetchCategories();
    }
    
    setWindows(prevWindows => {
      const existingWindow = prevWindows.find(w => w.id === id);
      if (existingWindow) {
        return prevWindows.map(w =>
          w.id === id
            ? { ...w, isMinimized: false, isFocused: true, zIndex: ++highestZIndex }
            : { ...w, isFocused: false }
        );
      }

      let newContent: React.ReactNode;
      let newIcon: React.ElementType | undefined = icon;

      switch (type) {
        case 'CATEGORY':
            const category = categories.find(c => c.id === id);
            newContent = <ProjectList categoryId={id} categoryName={category?.name || ''} />;
            newIcon = Folder;
            break;
        case 'BLOGS':
            newContent = <BlogList />;
            newIcon = FileText;
            break;
        case 'CONTACT':
            newContent = <ContactForm />;
            newIcon = Mail;
            break;
        case 'PROJECT':
            newContent = content;
            newIcon = Code;
            break;
        default:
            newContent = content || <div>Content for {title}</div>;
      }
      
      const newWindow: WindowInstance = {
        id,
        title,
        icon: newIcon,
        position: getInitialPosition(),
        size: initialSize || { width: 700, height: 500 },
        minSize: { width: 350, height: 250 },
        zIndex: ++highestZIndex,
        isMinimized: false,
        isMaximized: false,
        isFocused: true,
        content: newContent,
      };

      windowCount++;
      return [...prevWindows.map(w => ({ ...w, isFocused: false })), newWindow];
    });
  }, [getInitialPosition, categories, fetchCategories]);


  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows(prev =>
      prev.map(w =>
        w.id === id
          ? { ...w, isFocused: true, zIndex: ++highestZIndex, isMinimized: false }
          : { ...w, isFocused: false }
      )
    );
  }, []);

  const toggleMinimize = useCallback((id: string) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, isMinimized: !w.isMinimized } : w))
    );
  }, []);

  const toggleMaximize = useCallback((id: string) => {
    setWindows(prev => prev.map(w => {
      if (w.id === id) {
        return { ...w, isMaximized: !w.isMaximized, isMinimized: false }
      }
      return w;
    }));
  }, []);

  const updateWindowPosition = useCallback((id: string, position: { x: number; y: number }) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, position } : w))
    );
  }, []);

  const updateWindowSize = useCallback((id: string, size: { width: number; height: number }) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, size } : w))
    );
  }, []);
  
  const value = {
    windows,
    categories,
    openWindow,
    closeWindow,
    focusWindow,
    toggleMinimize,
    updateWindowPosition,
    updateWindowSize,
    toggleMaximize,
    getInitialPosition,
  };

  return <DesktopContext.Provider value={value}>{children}</DesktopContext.Provider>;
};

export const DesktopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
        <DesktopProviderInternal>
            {children}
        </DesktopProviderInternal>
    </ThemeProvider>
  );
};

export const useDesktop = (): DesktopContextType => {
  const context = useContext(DesktopContext);
  if (!context) {
    throw new Error('useDesktop must be used within a DesktopProvider');
  }
  return context;
};
