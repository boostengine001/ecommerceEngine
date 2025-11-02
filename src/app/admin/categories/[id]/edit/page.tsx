
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getCategory, updateCategory } from '@/lib/actions/category.actions';
import type { ICategory } from '@/models/Category';
import { useEffect, useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import ImageDropzone from '@/components/admin/image-dropzone';

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const [category, setCategory] = useState<ICategory | null>(null);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  useEffect(() => {
    async function fetchCategory() {
      const cat = await getCategory(params.id);
      setCategory(cat);
    }
    fetchCategory();
  }, [params.id]);

  const handleAddSubcategory = () => {
    if (newSubcategoryName.trim() && category) {
      const slug = newSubcategoryName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      const newSub = { name: newSubcategoryName.trim(), slug };
      // @ts-ignore
      setCategory({ ...category, subcategories: [...category.subcategories, newSub] });
      setNewSubcategoryName('');
    }
  };

  const handleRemoveSubcategory = (index: number) => {
    if (category) {
      const updatedSubcategories = category.subcategories.filter((_, i) => i !== index);
      setCategory({ ...category, subcategories: updatedSubcategories });
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    
    if (category) {
        // @ts-ignore
        formData.append('subcategories', JSON.stringify(category.subcategories));
    }

    try {
        await updateCategory(params.id, formData);
        router.push('/admin/categories');
    } catch (error) {
        console.error('Failed to update category:', error);
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
                <Input id="name" name="name" defaultValue={category.name} />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={category.description} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Subcategories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input 
                        placeholder="New subcategory name..."
                        value={newSubcategoryName}
                        onChange={(e) => setNewSubcategoryName(e.target.value)}
                    />
                    <Button type="button" variant="outline" onClick={handleAddSubcategory}>
                        <PlusCircle className="mr-2 h-4 w-4"/> Add
                    </Button>
                </div>
                <div className="space-y-2">
                    {category.subcategories.map((sub, index) => (
                        <div key={index} className="flex items-center justify-between rounded-md border p-3">
                           <div>
                             <p className="font-medium">{sub.name}</p>
                             <p className="text-sm text-muted-foreground">/{sub.slug}</p>
                           </div>
                           <Button type="button" size="icon" variant="ghost" onClick={() => handleRemoveSubcategory(index)}>
                                <Trash2 className="h-4 w-4 text-destructive"/>
                           </Button>
                        </div>
                    ))}
                    {category.subcategories.length === 0 && (
                        <p className="text-center text-sm text-muted-foreground py-4">No subcategories yet.</p>
                    )}
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
