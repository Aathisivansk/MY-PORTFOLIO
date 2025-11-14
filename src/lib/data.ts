import type { Category, Project, BlogPost } from './types';
import { Folder, Code, Cloud, Bot } from 'lucide-react';

export const CATEGORIES: Category[] = [
  { id: 'frontend', name: 'Frontend', icon: Code },
  { id: 'backend', name: 'Backend', icon: Cloud },
  { id: 'ai-ml', name: 'AI/ML', icon: Bot },
];

export const PROJECTS: Project[] = [
  {
    id: 'proj-1',
    categoryId: 'frontend',
    title: 'Interactive Data Dashboard',
    description: 'A real-time data visualization tool for business analytics.',
    myContribution: 'Led the frontend development, designing and implementing a modular component system with React and D3.js. Focused on performance optimization for large datasets and ensuring a responsive, mobile-first user experience.',
    techStack: ['React', 'TypeScript', 'D3.js', 'Tailwind CSS', 'Next.js'],
    demo_photo_url: 'https://picsum.photos/seed/102/800/600',
  },
  {
    id: 'proj-2',
    categoryId: 'frontend',
    title: 'E-commerce Platform',
    description: 'A full-featured online store with a custom CMS.',
    myContribution: 'Developed the entire shopping cart and checkout flow. Integrated with Stripe for payment processing and built a custom product management interface for the admin panel.',
    techStack: ['Vue.js', 'Stripe', 'GraphQL', 'Node.js'],
    flowchart_url: 'https://picsum.photos/seed/101/800/600',
  },
  {
    id: 'proj-3',
    categoryId: 'backend',
    title: 'Cloud-Native API Gateway',
    description: 'A scalable and secure API gateway for a microservices architecture.',
    myContribution: 'Architected and built the core routing and authentication logic using Go. Implemented rate limiting, request logging, and JWT-based security. Deployed and managed the service on AWS using Kubernetes and Terraform.',
    techStack: ['Go', 'Docker', 'Kubernetes', 'AWS', 'PostgreSQL', 'Terraform'],
    demo_photo_url: 'https://picsum.photos/seed/103/800/600',
  },
  {
    id: 'proj-4',
    categoryId: 'ai-ml',
    title: 'Image Recognition API',
    description: 'A deep learning model to classify images with high accuracy.',
    myContribution: 'Trained a Convolutional Neural Network (CNN) using TensorFlow and Keras on a custom dataset. Developed a REST API with Flask to serve the model predictions. Optimized the model for inference speed.',
    techStack: ['Python', 'TensorFlow', 'Keras', 'Flask', 'OpenCV'],
    flowchart_url: 'https://picsum.photos/seed/104/800/600',
    demo_photo_url: 'https://picsum.photos/seed/105/800/600'
  },
];

export const BLOG_POSTS: BlogPost[] = [
    {
        id: 'blog-1',
        title: 'Understanding Server Components in Next.js',
        content: '<p>Next.js 13 introduced a new paradigm: React Server Components (RSCs). This post dives deep into what they are, how they work, and why they represent a fundamental shift in how we build web applications. We\'ll explore the benefits of reduced client-side JavaScript, improved performance, and direct database access from components.</p><p>We will also look at practical examples of converting traditional client components into server components and discuss the patterns and trade-offs involved.</p>',
        createdAt: '2023-10-26',
        author: 'aathisivan.dev'
    },
    {
        id: 'blog-2',
        title: 'A Guide to Glassmorphism in UI Design',
        content: '<p>Glassmorphism is a UI trend that creates a "frosted glass" effect on elements. It\'s characterized by transparency, blur, and a subtle border to create a sense of depth and hierarchy. This post explores the key principles of glassmorphism, its pros and cons, and provides practical CSS tips for implementing it effectively in your own projects.</p><p>We will build a sample card component to demonstrate how to combine `backdrop-filter`, `background-color`, and `border` to achieve this modern aesthetic.</p>',
        createdAt: '2023-11-15',
        author: 'aathisivan.dev'
    }
];
