"use client";

import { useState } from 'react';
import Image from 'next/image';
import type { ProductMedia } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Card } from '../ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface ProductMediaGalleryProps {
  media: ProductMedia[];
  isOnSale: boolean;
}

export default function ProductMediaGallery({ media, isOnSale }: ProductMediaGalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState(media[0]);

  return (
    <div className="grid gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <Card className="overflow-hidden cursor-zoom-in">
            <div className="relative aspect-square">
              {isOnSale && (
                <Badge className="absolute top-4 left-4 z-10 text-lg" variant="destructive">Sale</Badge>
              )}
              <Image
                src={selectedMedia.url}
                alt={selectedMedia.alt}
                width={800}
                height={800}
                className="h-full w-full object-cover transition-opacity duration-300"
                data-ai-hint={selectedMedia.imageHint}
                priority
              />
            </div>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-4xl p-2 sm:p-4">
           <div className="relative aspect-square">
            <Image
                src={selectedMedia.url}
                alt={selectedMedia.alt}
                fill
                className="object-contain"
              />
           </div>
        </DialogContent>
      </Dialog>
      
      {media.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {media.map((item, index) => (
            <button
              key={index}
              onClick={() => setSelectedMedia(item)}
              className={cn(
                "overflow-hidden rounded-md border-2 transition-colors",
                selectedMedia.url === item.url ? "border-primary" : "border-transparent hover:border-primary/50"
              )}
            >
              <Image
                src={item.url}
                alt={item.alt}
                width={150}
                height={150}
                className="aspect-square h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
