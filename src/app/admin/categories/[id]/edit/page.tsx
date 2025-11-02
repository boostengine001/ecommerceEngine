
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getCategory, updateCategory, getAllCategories } from '@/lib/actions/category.actions';
import type { ICategory } from '@/models/Category';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import ImageDropzone from '@/components/admin/image-dropzone';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [category, setCategory] = useState<ICategory | null>(null);
  const [allCategories, setAllCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  useEffect(() => {
    async function fetchData() {
      const [cat, allCats] = await Promise.all([
        getCategory(id),
        getAllCategories()
      ]);
      setCategory(cat);
      // Filter out the current category and its descendants from the list of potential parents
      setAllCategories(allCats.filter(c => c._id !== cat?._id && !c.ancestors.some(a => a._id === cat?._id)));
    }
    fetchData();
  }, [id]);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    
    try {
        await updateCategory(id, formData);
        router.push('/admin/categories');
    } catch (error) {
        console.error('Failed to update category:', error);
        alert('Failed to update category. Please check console for details.');
    } finally {
        setLoading(false);
    }
  };


  if (!category) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-1/2" />
            <Card>
                <CardHeader><Skeleton className="h-8 w-1/4" /></CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Category</h2>
          <p className="text-muted-foreground">Update the details for the category.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name</Label>
                <Input id="name" name="name" defaultValue={category.name} required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={category.description} required />
              </div>
              <div>
                <Label htmlFor="parent">Parent Category</Label>
                <Select name="parent" defaultValue={category.parent?._id || "null"}>
                  <SelectTrigger id="parent">
                    <SelectValue placeholder="Select a parent category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">None (Top-level)</SelectItem>
                    {allCategories.map(cat => (
                      <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageDropzone name="image" initialImage={category.image} />
              <Input type="hidden" name="currentImage" defaultValue={category.image} />
            </CardContent>
          </Card>
          <Button size="lg" type="submit" className="w-full" disabled={loading}>{loading ? 'Updating...' : 'Update Category'}</Button>
        </div>
      </div>
    </form>
  );
}
