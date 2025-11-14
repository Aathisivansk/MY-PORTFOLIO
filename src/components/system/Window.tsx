
"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { WindowInstance } from '@/lib/types';
import { useDesktop } from '@/contexts/DesktopContext';
import { X, Minus, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

export const Window: React.FC<WindowInstance> = (props) => {
  const { id, title, content, isFocused, isMaximized, position, size, minSize, zIndex } = props;
  const { closeWindow, focusWindow, toggleMinimize, updateWindowPosition, updateWindowSize, toggleMaximize } = useDesktop();
  const windowRef = useRef<HTMLDivElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const handleFocus = useCallback(() => {
    if (!isFocused) {
      focusWindow(id);
    }
  }, [id, isFocused, focusWindow]);

  const onDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMaximized) return;
    handleFocus();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const onResizeStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isMaximized) return;
    handleFocus();
    setIsResizing(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
    });
  };

  useEffect(() => {
    const onDragging = (e: MouseEvent) => {
      if (!isDragging) return;
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      updateWindowPosition(id, { x: newX, y: newY });
    };

    const onResizing = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = Math.max(minSize.width, size.width + (e.clientX - dragStart.x));
      const newHeight = Math.max(minSize.height, size.height + (e.clientY - dragStart.y));
      updateWindowSize(id, { width: newWidth, height: newHeight });
      setDragStart({ x: e.clientX, y: e.clientY });
    };
    
    const onInteractionEnd = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', onDragging);
      document.addEventListener('mouseup', onInteractionEnd);
    }
    if (isResizing) {
      document.addEventListener('mousemove', onResizing);
      document.addEventListener('mouseup', onInteractionEnd);
    }

    return () => {
      document.removeEventListener('mousemove', onDragging);
      document.removeEventListener('mousemove', onResizing);
      document.removeEventListener('mouseup', onInteractionEnd);
    };
  }, [isDragging, isResizing, dragStart, id, size, minSize, updateWindowPosition, updateWindowSize]);
  
  const windowStyle: React.CSSProperties = isMaximized ? {
    top: 0,
    left: 0,
    width: '100%',
    height: 'calc(100% - 64px)', // Account for taskbar
    transform: 'none',
  } : {
    top: position.y,
    left: position.x,
    width: size.width,
    height: size.height,
    zIndex: zIndex,
  };

  return (
    <div
      ref={windowRef}
      className={cn(
        'fixed flex flex-col glassmorphic rounded-lg window-shadow transition-all duration-200 ease-in-out',
        isFocused ? 'shadow-2xl' : 'shadow-lg',
        isMaximized && 'rounded-none'
      )}
      style={windowStyle}
      onMouseDown={handleFocus}
    >
      <div
        className="h-10 flex items-center justify-between px-3 cursor-grab active:cursor-grabbing rounded-t-lg bg-white/20"
        onMouseDown={onDragStart}
        onDoubleClick={() => toggleMaximize(id)}
      >
        <span className="font-bold text-sm text-foreground truncate select-none">{title}</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => toggleMinimize(id)}><Minus size={16} /></Button>
          <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => toggleMaximize(id)}><Square size={14} /></Button>
          <Button variant="ghost" size="icon" className="w-7 h-7 hover:bg-destructive/80" onClick={() => closeWindow(id)}><X size={16} /></Button>
        </div>
      </div>
      <div className="flex-grow p-4 bg-transparent overflow-y-auto no-scrollbar">
        {content}
      </div>
      {!isMaximized && (
        <div 
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize" 
          onMouseDown={onResizeStart}
        />
      )}
    </div>
  );
};
