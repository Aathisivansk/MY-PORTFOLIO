
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CATEGORIES } from "@/lib/data";
import { MoreHorizontal, Folder, Code, Cloud, Bot } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Category } from '@/lib/types';

const iconMap: { [key: string]: React.ElementType } = {
    Code,
    Cloud,
    Bot,
    Folder,
};

type UpdatableCategory = Omit<Category, 'icon'> & { iconName: string; icon: React.ElementType };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<UpdatableCategory[]>(CATEGORIES.map(c => ({...c, iconName: Object.keys(iconMap).find(key => iconMap[key] === c.icon) || 'Folder' })));
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<UpdatableCategory | null>(null);
  const { toast } = useToast();

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName] || Folder;
    return <Icon className="h-5 w-5" />;
  }

  const handleAddOrUpdateCategory = () => {
    if (!newCategoryName.trim()) {
        toast({ title: "Error", description: "Category name cannot be empty.", variant: "destructive" });
        return;
    }

    if (editingCategory) {
        // Update logic in CATEGORIES array
        const categoryIndex = CATEGORIES.findIndex(c => c.id === editingCategory.id);
        if (categoryIndex !== -1) {
            CATEGORIES[categoryIndex].name = newCategoryName;
        }
        // Update state
        setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, name: newCategoryName } : c));
        toast({ title: "Success", description: `Category "${newCategoryName}" updated.` });
    } else {
        // Add new logic to CATEGORIES array
        const newCategory: Category = {
            id: newCategoryName.toLowerCase().replace(/\s+/g, '-'),
            name: newCategoryName,
            icon: Folder,
        };
        CATEGORIES.push(newCategory);
        // Update state
        setCategories([...categories, { ...newCategory, iconName: 'Folder' }]);
        toast({ title: "Success", description: `Category "${newCategoryName}" added.` });
    }
    
    closeDialog();
  }

  const openEditDialog = (category: UpdatableCategory) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setIsDialogOpen(true);
  }

  const openNewDialog = () => {
    setEditingCategory(null);
    setNewCategoryName('');
    setIsDialogOpen(true);
  }
  
  const closeDialog = () => {
    setIsDialogOpen(false);
    setNewCategoryName('');
    setEditingCategory(null);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Manage your project categories.</CardDescription>
        </div>
        <Button onClick={openNewDialog}>Add New Category</Button>
      </CardHeader>
      <CardContent>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingCategory ? 'Edit' : 'Add New'} Category</DialogTitle>
                    <DialogDescription>
                        {editingCategory ? `Update the name for the "${editingCategory.name}" category.` : 'Enter the name for the new category.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
                    <Button onClick={handleAddOrUpdateCategory}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Icon</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>ID</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{getIcon(category.iconName)}</TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-muted-foreground">{category.id}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => openEditDialog(category)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
