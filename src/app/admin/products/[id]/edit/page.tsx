
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getProduct, updateProduct } from '@/lib/actions/product.actions';
import { getAllCategories } from '@/lib/actions/category.actions';
import type { IProduct, IVariant, IDimensions } from '@/models/Product';
import type { ICategory } from '@/models/Category';
import { useEffect, useState, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { UploadCloud, X, Trash2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Separator } from '@/components/ui/separator';


export default function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [product, setProduct] = useState<IProduct | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<Partial<IVariant>[]>([{ name: '', sku: '', price: 0, stock: 0, options: [{ name: '', value: ''}] }]);
  const [productName, setProductName] = useState('');

  const generateSku = useCallback((vIndex: number) => {
    const productPrefix = productName.slice(0, 5).toUpperCase().replace(/[^A-Z0-9]/g, '');
    const variantOptions = variants[vIndex].options?.map(opt => opt.value.slice(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, '')).join('-') || '';
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    
    const newSku = `${productPrefix}-${variantOptions}-${randomSuffix}`;

    const newVariants = [...variants];
    newVariants[vIndex].sku = newSku;
    setVariants(newVariants);
  }, [productName, variants]);

  useEffect(() => {
    // When product name changes, regenerate SKUs for all variants that don't have a manually set one.
    variants.forEach((_, vIndex) => {
        // A simple check to avoid overwriting user-entered SKUs. 
        // This could be more robust, e.g., by tracking which SKUs are auto-generated.
        if (!variants[vIndex].sku || variants[vIndex].sku?.startsWith(productName.slice(0,5).toUpperCase())) {
            generateSku(vIndex);
        }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productName]);

  useEffect(() => {
    async function fetchData() {
      const [prod, cats] = await Promise.all([
        getProduct(id),
        getAllCategories()
      ]);
      setProduct(prod);
      setCategories(cats);
      if (prod) {
          setProductName(prod.name);
          const imageUrls = prod.media.map(m => m.url);
          setExistingImages(imageUrls);
          setPreviews(imageUrls);
          if (prod.variants && prod.variants.length > 0) {
            setVariants(prod.variants.map(v => ({...v})));
          } else {
            // If no variants, start with one empty one and generate an initial SKU
            const newVariants = [{ name: '', sku: '', price: 0, stock: 0, options: [{ name: '', value: ''}] }];
            const productPrefix = prod.name.slice(0, 5).toUpperCase().replace(/[^A-Z0-9]/g, '');
            const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
            newVariants[0].sku = `${productPrefix}--${randomSuffix}`;
            setVariants(newVariants);
          }
      }
    }
    fetchData();
  }, [id]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (acceptedFiles) => {
      const newFiles = [...files, ...acceptedFiles];
      setFiles(newFiles);

      const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    },
  });

  const removeImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
        const fileIndex = index - existingImages.length;
        setFiles(prev => prev.filter((_, i) => i !== fileIndex));
    }
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleVariantChange = (index: number, field: keyof IVariant, value: any) => {
    const newVariants = [...variants];
    (newVariants[index] as any)[field] = value;
    setVariants(newVariants);
  };
  
  const handleVariantDimensionChange = (index: number, field: keyof IDimensions, value: string) => {
    const newVariants = [...variants];
    const variant = newVariants[index];
    if (!variant.dimensions) {
      variant.dimensions = { length: 0, width: 0, height: 0 };
    }
    (variant.dimensions as any)[field] = parseFloat(value) || 0;
    setVariants(newVariants);
  };

  const handleVariantOptionChange = (vIndex: number, oIndex: number, field: 'name' | 'value', value: string) => {
      const newVariants = [...variants];
      if (newVariants[vIndex].options) {
        newVariants[vIndex].options![oIndex][field] = value;
        setVariants(newVariants);
        generateSku(vIndex);
      }
  };

  const addVariant = () => {
      setVariants([...variants, { name: '', sku: '', price: 0, stock: 0, options: [{ name: '', value: ''}] }]);
  };
  
  const removeVariant = (index: number) => {
      setVariants(variants.filter((_, i) => i !== index));
  };
  
  const addVariantOption = (vIndex: number) => {
    const newVariants = [...variants];
    if (newVariants[vIndex].options) {
        newVariants[vIndex].options!.push({ name: '', value: '' });
        setVariants(newVariants);
    }
  };

  const removeVariantOption = (vIndex: number, oIndex: number) => {
      const newVariants = [...variants];
      if (newVariants[vIndex].options) {
        newVariants[vIndex].options = newVariants[vIndex].options!.filter((_, i) => i !== oIndex);
        setVariants(newVariants);
      }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!product) return;

    setLoading(true);
    const formData = new FormData(event.currentTarget);
    
    existingImages.forEach(url => formData.append('existingImages', url));
    files.forEach(file => formData.append('images', file));
    
    formData.append('variants', JSON.stringify(variants.filter(v => v.sku)));

    try {
        await updateProduct(id, formData);
        router.push('/admin/products');
    } catch (error) {
        console.error('Failed to update product:', error);
        alert('Failed to update product. Please check console for details.');
    } finally {
        setLoading(false);
    }
  };


  if (!product) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/2" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card><CardHeader><Skeleton className="h-8 w-1/4" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-20 w-full" /><Skeleton className="h-10 w-full" /></CardContent></Card>
          </div>
          <div className="space-y-6">
            <Card><CardHeader><Skeleton className="h-8 w-1/4" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-8 w-1/4" /></CardHeader><CardContent><Skeleton className="h-10 w-full" /></CardContent></Card>
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
          <p className="text-muted-foreground">Update the details for "{product.name}".</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Product Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label htmlFor="name">Product Name</Label><Input id="name" name="name" value={productName} onChange={(e) => setProductName(e.target.value)} required /></div>
              <div><Label htmlFor="description">Description</Label><Textarea id="description" name="description" defaultValue={product.description} required /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div><Label htmlFor="price">Price</Label><Input id="price" name="price" type="number" step="0.01" defaultValue={product.price} required/></div>
                 <div><Label htmlFor="salePrice">Sale Price (Discount)</Label><Input id="salePrice" name="salePrice" type="number" step="0.01" defaultValue={product.salePrice || ''} /></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Variants</CardTitle>
              <CardDescription>Add variants like color or size. Each variant can have its own price, stock, and shipping details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {variants.map((variant, vIndex) => (
                <div key={vIndex} className="p-4 border rounded-md space-y-4 relative bg-muted/20">
                  <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => removeVariant(vIndex)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  
                  <div>
                    <Label htmlFor={`variant-name-${vIndex}`}>Variant Name</Label>
                    <Input id={`variant-name-${vIndex}`} placeholder="e.g. Blue / Large" value={variant.name || ''} onChange={(e) => handleVariantChange(vIndex, 'name', e.target.value)} />
                    <p className="text-xs text-muted-foreground mt-1">Leave blank to auto-generate from options.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor={`variant-sku-${vIndex}`}>SKU</Label>
                        <Input id={`variant-sku-${vIndex}`} placeholder="Auto-generated SKU" value={variant.sku || ''} onChange={(e) => handleVariantChange(vIndex, 'sku', e.target.value)} required />
                    </div>
                    <div>
                        <Label htmlFor={`variant-price-${vIndex}`}>Variant Price</Label>
                        <Input id={`variant-price-${vIndex}`} type="number" step="0.01" placeholder="Overrides main price" value={variant.price || ''} onChange={(e) => handleVariantChange(vIndex, 'price', parseFloat(e.target.value))} />
                    </div>
                    <div>
                        <Label htmlFor={`variant-stock-${vIndex}`}>Stock</Label>
                        <Input id={`variant-stock-${vIndex}`} type="number" placeholder="100" value={variant.stock || ''} onChange={(e) => handleVariantChange(vIndex, 'stock', parseInt(e.target.value))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Options</Label>
                    {variant.options?.map((option, oIndex) => (
                       <div key={oIndex} className="flex items-end gap-2">
                           <div className="flex-1">
                               <Input placeholder="e.g. Color" value={option.name} onChange={(e) => handleVariantOptionChange(vIndex, oIndex, 'name', e.target.value)} />
                           </div>
                            <div className="flex-1">
                                <Input placeholder="e.g. Blue" value={option.value} onChange={(e) => handleVariantOptionChange(vIndex, oIndex, 'value', e.target.value)} />
                           </div>
                           <Button type="button" variant="outline" size="icon" className="shrink-0" onClick={() => removeVariantOption(vIndex, oIndex)}>
                               <Trash2 className="h-4 w-4 text-destructive" />
                           </Button>
                       </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => addVariantOption(vIndex)}>Add Option</Button>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label className="text-sm">Variant Shipping Details (Optional)</Label>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                        <Label htmlFor={`variant-weight-${vIndex}`} className="text-xs">Weight (kg)</Label>
                        <Input id={`variant-weight-${vIndex}`} type="number" step="0.01" placeholder="0.5" value={variant.weight || ''} onChange={(e) => handleVariantChange(vIndex, 'weight', parseFloat(e.target.value))} />
                        </div>
                        <div>
                        <Label htmlFor={`variant-length-${vIndex}`} className="text-xs">Length (cm)</Label>
                        <Input id={`variant-length-${vIndex}`} type="number" step="0.01" placeholder="30" value={variant.dimensions?.length || ''} onChange={(e) => handleVariantDimensionChange(vIndex, 'length', e.target.value)} />
                        </div>
                        <div>
                        <Label htmlFor={`variant-width-${vIndex}`} className="text-xs">Width (cm)</Label>
                        <Input id={`variant-width-${vIndex}`} type="number" step="0.01" placeholder="20" value={variant.dimensions?.width || ''} onChange={(e) => handleVariantDimensionChange(vIndex, 'width', e.target.value)} />
                        </div>
                        <div>
                        <Label htmlFor={`variant-height-${vIndex}`} className="text-xs">Height (cm)</Label>
                        <Input id={`variant-height-${vIndex}`} type="number" step="0.01" placeholder="5" value={variant.dimensions?.height || ''} onChange={(e) => handleVariantDimensionChange(vIndex, 'height', e.target.value)} />
                        </div>
                    </div>
                  </div>

                </div>
              ))}
              <Button type="button" variant="secondary" onClick={addVariant}>Add Variant</Button>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Default Shipping</CardTitle>
               <CardDescription>Default shipping details if a variant does not have its own.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" name="weight" type="number" step="0.01" placeholder="0.5" defaultValue={product.weight || ''}/>
                </div>
                <div>
                  <Label htmlFor="length">Length (cm)</Label>
                  <Input id="length" name="length" type="number" step="0.01" placeholder="30" defaultValue={product.dimensions?.length || ''}/>
                </div>
                <div>
                  <Label htmlFor="width">Width (cm)</Label>
                  <Input id="width" name="width" type="number" step="0.01" placeholder="20" defaultValue={product.dimensions?.width || ''}/>
                </div>
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input id="height" name="height" type="number" step="0.01" placeholder="5" defaultValue={product.dimensions?.height || ''}/>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Product Images</CardTitle><CardDescription>Manage your product images.</CardDescription></CardHeader>
            <CardContent>
                <div {...getRootProps()} className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${isDragActive ? 'border-primary' : 'border-input'}`}>
                    <input {...getInputProps()} />
                    <UploadCloud className="w-10 h-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
                </div>
                {previews.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                        {previews.map((src, index) => {
                            const isExisting = index < existingImages.length && src === existingImages[index];
                            return (
                                <div key={src} className="relative">
                                    <Image src={src} alt={`Preview ${index + 1}`} width={100} height={100} className="rounded-md object-cover w-full aspect-square" />
                                    <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeImage(index, isExisting)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Category</CardTitle></CardHeader>
            <CardContent>
              <Select name="category" defaultValue={product.category._id.toString()} required>
                <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id.toString()}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          <Button size="lg" type="submit" className="w-full" disabled={loading}>{loading ? 'Updating...' : 'Update Product'}</Button>
        </div>
      </div>
    </form>
  );
}
