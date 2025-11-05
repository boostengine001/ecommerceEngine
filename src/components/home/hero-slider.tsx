'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';
import { Button } from '../ui/button';
import Link from 'next/link';

// Mock data for slides, in a real app this might come from a CMS
const slides = [
    {
      id: 'slide1',
      title: 'Experience True Immersion',
      subtitle: 'With the new SoundScape Pro',
      buttonText: 'Shop Headphones',
      buttonLink: '/products/soundscape-pro',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzfGVufDB8fHx8MTc2MjA5NTEwN3ww&ixlib=rb-4.1.0&q=80&w=1080',
      imageHint: 'headphones'
    },
    {
      id: 'slide2',
      title: 'Timeless Elegance',
      subtitle: 'Discover the Azure Timepiece',
      buttonText: 'Shop Watches',
      buttonLink: '/products/azure-timepiece',
      imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx3YXRjaHxlbnwwfHx8fDE3NjIwOTUxNDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      imageHint: 'watch'
    },
    {
      id: 'slide3',
      title: 'Brew Perfection',
      subtitle: 'Your day starts with the Morning BrewMaster',
      buttonText: 'Shop Coffee Makers',
      buttonLink: '/products/morning-brewmaster',
      imageUrl: 'https://images.unsplash.com/photo-1545665225-b23b99e4d45e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBtYWtlcnxlbnwwfHx8fDE3NjIwOTUxNjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      imageHint: 'coffee maker'
    },
    {
      id: 'slide4',
      title: 'Smart Home, Smart Sound',
      subtitle: 'Meet the new EchoSphere',
      buttonText: 'Shop Smart Speakers',
      buttonLink: '/products/echosphere',
      imageUrl: 'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxzbWFydCUyMHNwZWFrZXJ8ZW58MHx8fHwxNzYyMDk1MjEwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      imageHint: 'smart speaker'
    },
    {
      id: 'slide5',
      title: 'Engineered for Speed',
      subtitle: 'The Velocity Runners',
      buttonText: 'Shop Running Shoes',
      buttonLink: '/products/velocity-runners',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwc2hvZXN8ZW58MHx8fHwxNzYyMDk1MjM0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      imageHint: 'running shoes'
    },
  ];

export default function HeroSlider() {

  return (
    <div className="w-full">
      <Carousel
        className="w-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative h-[300px] w-full md:h-[400px] lg:h-[500px]">
                {slide.imageUrl && (
                  <Image
                    src={slide.imageUrl}
                    alt={slide.subtitle}
                    fill
                    className="object-cover"
                    data-ai-hint={slide.imageHint}
                    priority={slide.id === 'slide1'}
                  />
                )}
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                  <h2 className="font-headline text-3xl font-bold md:text-5xl lg:text-6xl">
                    {slide.title}
                  </h2>
                  <p className="mt-2 text-lg md:text-xl">{slide.subtitle}</p>
                  <Button asChild className="mt-6" size="lg">
                    <Link href={slide.buttonLink}>{slide.buttonText}</Link>
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-white" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-white" />
      </Carousel>
    </div>
  );
}
