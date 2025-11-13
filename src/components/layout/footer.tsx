
'use client';

import type { ISettings } from '@/models/Setting';
import type { ICategory } from '@/models/Category';
import { Facebook, Instagram, Twitter, Youtube, Phone, Mail, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '../ui/separator';

// Simple SVG for WhatsApp
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16.75 13.96c.25.13.41.2.52.34.11.14.15.33.1.5s-.24.3-.46.4-.48.11-.92-.04-1.6-.59-2.81-1.76-2-2.32-2.1-2.61.05-.4.29-.63.45-.25.59-.25.22.01.3.15.29.9.33,1.05s.05.21-.02.33-.2.19-.34.3a.5.5,0,0,0-.08.5c.09.25.32.64.73,1.15s.84.9,1.08,1.12a.5.5,0,0,0,.56.08Z" />
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18.13A8.13 8.13 0 1 1 20.13 12 8.14 8.14 0 0 1 12 20.13Z" />
  </svg>
);


export default function Footer({ settings, categories }: { settings: ISettings, categories: ICategory[] }) {
    const hasSocials = settings.socials && Object.values(settings.socials).some(link => !!link);
    
    const socialLinks = [
        { name: 'Facebook', href: settings.socials?.facebook, icon: Facebook },
        { name: 'Instagram', href: settings.socials?.instagram, icon: Instagram },
        { name: 'Twitter', href: settings.socials?.twitter, icon: Twitter },
        { name: 'YouTube', href: settings.socials?.youtube, icon: Youtube },
    ];
    
    const footerLinks = {
        'Company': [
            { name: 'About Us', href: '/about' },
            { name: 'Contact Us', href: '/contact' },
        ],
        'Policies': [
            { name: 'Privacy Policy', href: '/privacy-policy' },
            { name: 'Terms & Conditions', href: '/terms-conditions' },
            { name: 'Refund & Return Policy', href: '/refund-policy' },
        ]
    }

    const topLevelCategories = categories.filter(c => !c.parent).slice(0, 5);


  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 pt-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            <div className="col-span-2 md:col-span-1">
                <Link href="/" className="flex items-center gap-2">
                    {settings.logoUrl ? (
                        <Image src={settings.logoUrl} alt={settings.storeName} width={120} height={40} className="h-10 w-auto" />
                    ) : (
                        <span className="font-headline text-2xl font-bold">{settings.storeName}</span>
                    )}
                </Link>
                
                 {hasSocials && (
                     <div className="mt-4 flex gap-4">
                        {socialLinks.map(social => social.href && (
                            <Link key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                <social.icon className="h-6 w-6" />
                                <span className="sr-only">{social.name}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            
            {Object.entries(footerLinks).map(([title, links]) => (
                 <div key={title}>
                    <h4 className="font-semibold">{title}</h4>
                    <ul className="mt-4 space-y-3 text-sm">
                        {links.map(link => (
                            <li key={link.name}>
                                <Link href={link.href} className="text-muted-foreground hover:text-primary">
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
             <div>
                <h4 className="font-semibold">Categories</h4>
                <ul className="mt-4 space-y-3 text-sm">
                    {topLevelCategories.map(cat => (
                        <li key={cat._id}>
                            <Link href={`/category/${cat.slug}`} className="text-muted-foreground hover:text-primary">
                                {cat.name}
                            </Link>
                        </li>
                    ))}
                     <li>
                        <Link href="/shop" className="font-medium text-primary hover:underline">
                            View All
                        </Link>
                    </li>
                </ul>
            </div>
             <div>
                <h4 className="font-semibold">Contact Us</h4>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                    {settings.phone && (
                        <li>
                            <a href={`tel:${settings.phone}`} className="inline-flex items-center gap-2 hover:text-primary">
                                <Phone className="h-4 w-4" />
                                {settings.phone}
                            </a>
                        </li>
                    )}
                    {settings.contactEmail && (
                         <li>
                            <a href={`mailto:${settings.contactEmail}`} className="inline-flex items-center gap-2 hover:text-primary">
                                <Mail className="h-4 w-4" />
                                {settings.contactEmail}
                            </a>
                        </li>
                    )}
                     {settings.whatsapp && (
                         <li>
                            <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-primary">
                                <WhatsAppIcon className="h-4 w-4" />
                                Chat on WhatsApp
                            </a>
                        </li>
                    )}
                </ul>
            </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col items-center justify-between gap-4 pb-8 sm:flex-row">
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
            <p className="text-sm text-muted-foreground">
                Designed & Developed by <a href="https://boostengine.in" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-primary">Boost Engine</a>.
            </p>
        </div>
      </div>
    </footer>
  );
}

