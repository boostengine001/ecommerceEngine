
'use client';

import { useState, useMemo, useEffect } from 'react';
import type { IProduct, IVariant } from '@/models/Product';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import AddToCartButton from './add-to-cart-button';
import BuyNowButton from './buy-now-button';
import WishlistButton from './wishlist-button';
import { useCart } from '@/hooks/use-cart';

interface VariantSelectorProps {
  product: IProduct;
}

export default function VariantSelector({ product }: VariantSelectorProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const { addToCart } = useCart();

  const optionTypes = useMemo(() => {
    const options: Record<string, string[]> = {};
    product.variants.forEach(variant => {
      variant.options.forEach(option => {
        if (!options[option.name]) {
          options[option.name] = [];
        }
        if (!options[option.name].includes(option.value)) {
          options[option.name].push(option.value);
        }
      });
    });
    return options;
  }, [product.variants]);

  // Set default selected options
  useEffect(() => {
    const defaults: Record<string, string> = {};
    for (const optionName in optionTypes) {
        defaults[optionName] = optionTypes[optionName][0];
    }
    setSelectedOptions(defaults);
  }, [optionTypes]);

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return null;
    return product.variants.find(variant => 
      variant.options.every(opt => selectedOptions[opt.name] === opt.value)
    );
  }, [selectedOptions, product.variants]);


  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value,
    }));
  };
  
  const productForButtons = {
    // Use variant SKU as the unique ID for the cart item, or product ID if no variants
    id: selectedVariant?.sku || product._id,
    // ALWAYS use the parent product's ID for linking back to the product
    productId: product._id,
    name: selectedVariant?.name || product.name,
    price: selectedVariant?.price || product.salePrice || product.price,
    image: product.media?.[0]?.url || '',
  }

  return (
    <div className="mt-8">
      {Object.entries(optionTypes).map(([name, values]) => (
        <div key={name} className="mb-4">
          <Label className="text-lg font-semibold">{name}</Label>
          <RadioGroup 
            value={selectedOptions[name]} 
            onValueChange={(value) => handleOptionChange(name, value)}
            className="mt-2 flex flex-wrap gap-2"
          >
            {values.map(value => (
              <RadioGroupItem key={value} value={value} id={`${name}-${value}`} className="sr-only" />
            ))}
          </RadioGroup>
        </div>
      ))}
      
      {selectedVariant ? (
        <div className="mt-4 text-sm text-muted-foreground">
          SKU: {selectedVariant.sku} | Stock: {selectedVariant.stock}
        </div>
      ) : (
         product.variants && product.variants.length > 0 && (
          <div className="mt-4 text-sm text-destructive">
            Selected combination is not available.
          </div>
         )
      )}

      <div className="mt-8 flex w-full flex-col gap-4 md:flex-row">
        <AddToCartButton product={productForButtons as any} className="w-full" />
        <BuyNowButton product={productForButtons as any} className="w-full" />
        <WishlistButton product={product as any} className="w-full md:w-auto" />
      </div>
    </div>
  );
}
