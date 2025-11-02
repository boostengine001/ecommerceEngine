
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { addCategory, getAllCategories } from '@/lib/actions/category.actions';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import ImageDropzone from '@/components/admin/image-dropzone';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ICategory } from '@/models/Category';

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    async function fetchCategories() {
        const cats = await getAllCategories();
        setCategories(cats);
    }
    fetchCategories();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const image = formData.get('image') as File;

    if (!image || image.size === 0) {
        alert('Please select an image for the category.');
        return;
    }
    
    setLoading(true);

    try {
      await addCategory(formData);
      router.push('/admin/categories');
    } catch (error) {
      console.error('Failed to add category:', error);
      alert('Failed to add category. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add New Category</h2>
          <p className="text-muted-foreground">Fill in the details for the new category.</p>
        </div>
      </div>
      {isClient && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Category Name</Label>
                  <Input id="name" name="name" placeholder="e.g. Menswear" required/>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" placeholder="A short description of the category." required/>
                </div>
                <div>
                  <Label htmlFor="parent">Parent Category</Label>
                  <Select name="parent" defaultValue="null">
                      <SelectTrigger id="parent">
                          <SelectValue placeholder="Select a parent category (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="null">None (Top-level)</SelectItem>
                          {categories.map(cat => (
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
                      <ImageDropzone name="image" />
                  </CardContent>
              </Card>
              <Button size="lg" type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Category'}
              </Button>
          </div>
        </div>
      )}
    </form>
  );
}
