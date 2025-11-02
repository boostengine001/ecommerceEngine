
'use client';

import type { ISettings } from '@/models/Setting';
import { Facebook, Instagram, Twitter, Youtube, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

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


export default function Footer({ settings }: { settings: ISettings }) {
    const hasSocials = settings.socials && Object.values(settings.socials).some(link => !!link);
    
    const socialLinks = [
        { name: 'Facebook', href: settings.socials?.facebook, icon: Facebook },
        { name: 'Instagram', href: settings.socials?.instagram, icon: Instagram },
        { name: 'Twitter', href: settings.socials?.twitter, icon: Twitter },
        { name: 'YouTube', href: settings.socials?.youtube, icon: Youtube },
    ];

  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3 md:text-left">
            <div>
                <h4 className="text-lg font-semibold">{settings.storeName}</h4>
                <p className="mt-2 text-sm text-muted-foreground">© {new Date().getFullYear()} All rights reserved.</p>
            </div>
             <div>
                <h4 className="text-lg font-semibold">Contact Us</h4>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
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
            {hasSocials && (
                 <div>
                    <h4 className="text-lg font-semibold">Follow Us</h4>
                    <div className="mt-2 flex justify-center gap-4 md:justify-start">
                        {socialLinks.map(social => social.href && (
                            <Link key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                <social.icon className="h-6 w-6" />
                                <span className="sr-only">{social.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </footer>
  );
}
