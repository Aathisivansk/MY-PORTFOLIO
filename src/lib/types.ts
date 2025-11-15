
import type React from 'react';

export type Category = {
  id: string;
  name: string;
  iconName: string;
};

export type ProjectFile = {
  name: string;
  dataUri: string;
};

export type Project = {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  myContribution: string;
  techStack: string[];
  flowchart_url?: string;
  demo_photo_url?: string;
  demo_video_url?: string;
  otherFiles?: ProjectFile[];
};

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: string;
};

export type WindowInstance = {
  id: string;
  title: string;
  icon?: React.ElementType;
  position: { x: number; y: number };
  size: { width: number; height: number };
  minSize: { width: number; height: number };
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  content: React.ReactNode;
};
