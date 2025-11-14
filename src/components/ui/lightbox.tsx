"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from 'next/image';

interface LightboxProps {
  imageUrl: string;
  onClose: () => void;
}

export function Lightbox({ imageUrl, onClose }: LightboxProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300); // Wait for animation
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newScale = scale - e.deltaY * 0.001;
    setScale(Math.min(Math.max(0.5, newScale), 5));
  };
  
  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    if (imgRef.current) imgRef.current.style.cursor = 'grabbing';
  };
  
  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };
  
  const onMouseUp = () => {
    isDragging.current = false;
    if (imgRef.current) imgRef.current.style.cursor = 'grab';
  };
  
  useEffect(() => {
    const onGlobalMouseMove = (e: MouseEvent) => onMouseMove(e);
    document.addEventListener('mousemove', onGlobalMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', onGlobalMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="bg-black/80 border-none p-0 w-screen h-screen max-w-full flex items-center justify-center data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" 
        onWheel={handleWheel}
      >
        <div
          ref={imgRef}
          className="relative w-full h-full cursor-grab"
          onMouseDown={onMouseDown}
        >
          <div style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`, transition: isDragging.current ? 'none' : 'transform 0.1s ease-out' }}>
            <Image
              src={imageUrl}
              alt="Lightbox image"
              width={1920}
              height={1080}
              className="max-w-screen-lg max-h-screen-lg object-contain"
              draggable="false"
              priority
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
