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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export default function NewProductPage() {
  const [variants, setVariants] = useState([{ name: '', price: '', stock: '' }]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const addVariant = () => {
    setVariants([...variants, { name: '', price: '', stock: '' }]);
  };

  const removeVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
    }
  };


  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add New Product</h2>
          <p className="text-muted-foreground">Fill in the details for the new product.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" placeholder="e.g. Summer T-Shirt" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="A short description of the product." />
              </div>
              <div>
                <Label htmlFor="price">Base Price</Label>
                <Input id="price" type="number" placeholder="19.99" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Product Variants</CardTitle>
              <Button variant="outline" size="sm" onClick={addVariant}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Variant
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {variants.map((variant, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 items-end">
                  <div>
                    <Label htmlFor={`variant-name-${index}`}>Variant Name</Label>
                    <Input id={`variant-name-${index}`} placeholder="e.g. Color, Size" />
                  </div>
                  <div>
                    <Label htmlFor={`variant-value-${index}`}>Options</Label>
                    <Input id={`variant-value-${index}`} placeholder="e.g. Red, Blue, Green" />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeVariant(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {imagePreview && (
                <div className="aspect-square overflow-hidden rounded-md border">
                  <Image src={imagePreview} alt="Image preview" width={300} height={300} className="h-full w-full object-cover" />
                </div>
              )}
              <Label htmlFor="picture">Picture</Label>
              <Input id="picture" type="file" onChange={handleImageChange} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
           <Button size="lg" className="w-full">Save Product</Button>
        </div>
      </div>
    </div>
  );
}
