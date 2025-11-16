
'use client';

import 'react-phone-number-input/style.css';
import RPNInput from 'react-phone-number-input';
import { cn } from '@/lib/utils';
import * as React from 'react';

type PhoneInputProps = React.ComponentProps<typeof RPNInput>;

const PhoneInput = React.forwardRef<
  HTMLInputElement,
  PhoneInputProps
>((props, ref) => {
  return (
    <RPNInput
      ref={ref as any}
      className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          '[&_input]:h-full [&_input]:w-full [&_input]:border-none [&_input]:bg-transparent [&_input]:px-3 [&_input]:py-2 [&_input]:focus-visible:ring-0',
          '[&_.PhoneInputCountry]:mr-2 [&_.PhoneInputCountry]:h-full [&_.PhoneInputCountry]:p-2 [&_.PhoneInputCountrySelect]:!border-none'
      )}
      {...props}
    />
  );
});
PhoneInput.displayName = 'PhoneInput';

export { PhoneInput };
