
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Folder, Code, Cloud, Bot, Loader2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Category } from '@/lib/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';

const iconMap: { [key: string]: React.ElementType } = {
    Code,
    Cloud,
    Bot,
    Folder,
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const { toast } = useToast();

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch categories.');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
            setCategories(data);
        } else {
            console.error("API did not return an array for categories:", data);
            setCategories([]); // Reset to empty array to prevent .map error
            throw new Error("Received unexpected data format for categories.");
        }
    } catch (error: any) {
        toast({ title: "Error", description: error.message || "Failed to fetch categories.", variant: "destructive" });
        setCategories([]); // Ensure categories is an array on error
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName] || Folder;
    return <Icon className="h-5 w-5" />;
  }

  const handleAddOrUpdateCategory = async () => {
    if (!newCategoryName.trim()) {
        toast({ title: "Error", description: "Category name cannot be empty.", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);

    const isEditing = !!editingCategory;
    const url = isEditing ? `/api/categories/${editingCategory.id}` : '/api/categories';
    const method = isEditing ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newCategoryName }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Failed to ${isEditing ? 'update' : 'add'} category`);
        }
        
        toast({ title: "Success", description: `Category "${newCategoryName}" ${isEditing ? 'updated' : 'added'}.` });
        fetchCategories(); // Re-fetch to get the latest list
        closeDialog();
    } catch (error: any) {
        toast({ title: "Error", description: error.message || `Could not ${isEditing ? 'update' : 'add'} category.`, variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  }

  const openEditDialog = (category: Category) => {
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
    if (isSubmitting) return;
    setIsDialogOpen(false);
    setNewCategoryName('');
    setEditingCategory(null);
  }

  const openDeleteDialog = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setCategoryToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
        const response = await fetch(`/api/categories/${categoryToDelete.id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete category');
        }

        toast({ title: "Success", description: `Category "${categoryToDelete.name}" deleted.` });
        fetchCategories();
    } catch (error: any) {
        toast({ title: "Error", description: error.message || "Could not delete category.", variant: "destructive" });
    } finally {
        closeDeleteDialog();
    }
  };

  return (
    <>
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
                          <Input id="name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="col-span-3" disabled={isSubmitting} />
                      </div>
                  </div>
                  <DialogFooter>
                      <Button type="button" variant="outline" onClick={closeDialog} disabled={isSubmitting}>Cancel</Button>
                      <Button onClick={handleAddOrUpdateCategory} disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </Button>
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
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-5 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                ))
              ) : (categories && categories.length > 0) ? categories.map((category) => (
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
                        <DropdownMenuItem onClick={() => openDeleteDialog(category)} className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No categories found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the "{categoryToDelete?.name}" category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteDialog}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
