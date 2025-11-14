import { NextResponse } from 'next/server';
import { CATEGORIES } from '@/lib/data';
import { Folder, Code, Cloud, Bot } from 'lucide-react';

// We can't serialize component functions, so we map them to strings
const iconMap: { [key: string]: React.ElementType } = {
    Code,
    Cloud,
    Bot,
    Folder,
};

export async function GET() {
  const serializableCategories = CATEGORIES.map(category => {
    const iconName = Object.keys(iconMap).find(key => iconMap[key] === category.icon) || 'Folder';
    return {
        ...category,
        icon: iconName,
    }
  });

  return NextResponse.json(serializableCategories);
}
