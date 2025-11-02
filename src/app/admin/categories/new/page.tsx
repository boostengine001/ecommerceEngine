
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { addCategory } from '@/lib/actions/category.actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ImageDropzone from '@/components/admin/image-dropzone';

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    
    // Check if an image file is present
    const imageFile = formData.get('image') as File;
    if (!imageFile || imageFile.size === 0) {
        // You might want to show a toast or an error message here
        alert('Please select an image for the category.');
        setLoading(false);
        return;
    }

    try {
      await addCategory(formData);
      router.push('/admin/categories');
    } catch (error) {
      console.error('Failed to add category:', error);
      // You could show an error toast here
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
    </form>
  );
}
