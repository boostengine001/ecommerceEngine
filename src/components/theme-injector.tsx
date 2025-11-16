
'use client';

import { useEffect } from 'react';
import { useSettings } from '@/hooks/use-settings';
import { hexToHsl } from '@/lib/utils';

export default function ThemeInjector() {
  const { settings } = useSettings();

  useEffect(() => {
    if (!settings.primaryColor || !settings.primaryColorDark) return;

    const primaryColorLightHsl = hexToHsl(settings.primaryColor);
    const primaryColorDarkHsl = hexToHsl(settings.primaryColorDark);

    const fontBody = settings.font === 'poppins' ? "'Poppins', sans-serif" : "'Inter', sans-serif";
    const fontHeadline = settings.font === 'poppins' ? "'Poppins', sans-serif" : "'Poppins', sans-serif";

    const style = document.createElement('style');
    style.id = 'theme-variables';
    style.innerHTML = `
      :root { 
        --primary-light: ${primaryColorLightHsl};
        --primary-dark: ${primaryColorDarkHsl};
        --font-body: ${fontBody};
        --font-headline: ${fontHeadline};
      }
    `;

    // Remove existing theme style if it exists
    const existingStyle = document.getElementById('theme-variables');
    if (existingStyle) {
      existingStyle.remove();
    }

    document.head.appendChild(style);
  }, [settings.primaryColor, settings.primaryColorDark, settings.font]);

  return null;
}
