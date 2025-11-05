'use client';

// In a real application, these reviews would be fetched from a database.
// For now, we'll use a mock list.

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Star } from 'lucide-react';

export type Review = {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    title: string;
    comment: string;
};

const reviews: Review[] = [
    {
        id: 'review-1',
        name: 'Sarah L.',
        avatar: 'https://i.pravatar.cc/40?u=sarah',
        rating: 5,
        title: 'Absolutely love it!',
        comment: 'The SoundScape Pro headphones are incredible. The noise cancellation is top-notch and they are so comfortable to wear for hours.'
    },
    {
        id: 'review-2',
        name: 'Mike P.',
        avatar: 'https://i.pravatar.cc/40?u=mike',
        rating: 5,
        title: 'Best watch I\'ve ever owned.',
        comment: 'The Azure Timepiece is a thing of beauty. It looks even better in person and I get compliments on it all the time. Highly recommend.'
    },
    {
        id: 'review-3',
        name: 'Jessica D.',
        avatar: 'https://i.pravatar.cc/40?u=jessica',
        rating: 4,
        title: 'Great value for the price.',
        comment: 'The Morning BrewMaster makes a great cup of coffee. It\'s easy to use and clean. My only wish is that the carafe was a bit larger.'
    },
     {
        id: 'review-4',
        name: 'Chris B.',
        avatar: 'https://i.pravatar.cc/40?u=chris',
        rating: 5,
        title: 'A must-have for commuters.',
        comment: 'The Voyager backpack is perfect for my daily commute. It has plenty of space for my laptop, books, and other essentials. The leather is high quality.'
    }
];

export default function ReviewsSection() {
  return (
    <div className="py-12">
      <div className="mb-8 border-b pb-4">
        <h2 className="text-4xl font-bold tracking-tight">What Our Customers Say</h2>
        <p className="mt-2 text-lg text-muted-foreground">Real reviews from satisfied shoppers.</p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {reviews.map((review) => (
          <Card key={review.id} className="flex flex-col">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Avatar>
                        <AvatarImage src={review.avatar} alt={review.name} />
                        <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{review.name}</p>
                         <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-primary fill-primary' : 'text-muted-foreground'}`}/>
                            ))}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
                <CardTitle className="text-lg mb-2">{review.title}</CardTitle>
                <p className="text-muted-foreground">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
