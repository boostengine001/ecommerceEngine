"use client";

import { useState } from 'react';
import Image from 'next/image';
import type { ProductMedia } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Card } from '../ui/card';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ProductMediaGalleryProps {
  media: ProductMedia[];
  isOnSale: boolean;
}

export default function ProductMediaGallery({ media, isOnSale }: ProductMediaGalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState(media[0]);

  const currentIndex = media.findIndex((item) => item.url === selectedMedia.url);

  const handlePrevious = () => {
    const prevIndex = (currentIndex - 1 + media.length) % media.length;
    setSelectedMedia(media[prevIndex]);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % media.length;
    setSelectedMedia(media[nextIndex]);
  };


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
               {media.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/50 hover:bg-background/80 z-20"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/50 hover:bg-background/80 z-20"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
           </div>
           {/* The default close button is part of DialogContent, but we can add an explicit one if needed for styling. */}
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
