
'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Country,
  getCountryCallingCode,
} from 'libphonenumber-js';
import RPNInput, {
  type PhoneInputProps as RPNInputProps,
  type Country as RPNCountry,
} from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Flag from 'react-phone-number-input/flags';
import { cn } from '@/lib/utils';
import { Button } from './button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';
import { Input, type InputProps } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { ScrollArea } from './scroll-area';
import * as React from 'react';


type PhoneInputProps = Omit<RPNInputProps<typeof InputComponent>, 'onChange'> & {
  onChange: (value: RPNInputProps<typeof InputComponent>['value']) => void;
};


const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> = React.forwardRef<
  React.ElementRef<typeof RPNInput>,
  PhoneInputProps
>(({ className, onChange, ...props }, ref) => {
  return (
    <RPNInput
      ref={ref}
      className={cn('flex', className)}
      onChange={onChange}
      inputComponent={InputComponent}
      countrySelectComponent={CountrySelector}
      {...props}
    />
  );
});
PhoneInput.displayName = 'PhoneInput';


const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <Input
      className={cn("rounded-none rounded-r-lg border-l-0", className)}
      {...props}
      ref={ref}
    />
  )
);
InputComponent.displayName = "InputComponent";


type CountrySelectorProps = {
  disabled?: boolean;
  value: RPNCountry;
  onChange: (value: RPNCountry) => void;
  options: { value: RPNCountry; label: string }[];
};


const CountrySelector = ({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectorProps) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (country: RPNCountry) => {
    onChange(country);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={'outline'}
          className={cn('flex gap-1 rounded-r-none pl-3 pr-1')}
          disabled={disabled}
        >
          <Flag country={value} countryName={value} />
          <ChevronsUpDown
            className={cn(
              '-mr-2 h-4 w-4 opacity-50',
              disabled ? 'hidden' : 'opacity-100'
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <ScrollArea className="h-52">
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {options
                  .filter((option) => option.value)
                  .map((option) => (
                    <CommandItem
                      key={option.value}
                      onSelect={() => handleSelect(option.value as RPNCountry)}
                      value={`${option.label} +${getCountryCallingCode(option.value as RPNCountry)}`}
                      className="flex items-center gap-2"
                    >
                      <Flag country={option.value as RPNCountry} countryName={option.label} />
                      <span className="flex-1">{option.label}</span>
                      <span>+{getCountryCallingCode(option.value as RPNCountry)}</span>
                      <Check
                        className={cn(
                          'ml-auto h-4 w-4',
                          value === option.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};


export { PhoneInput };
