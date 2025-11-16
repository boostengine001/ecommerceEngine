
'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Country,
  E164Number,
  formatIncompletePhoneNumber,
  getCountryCallingCode,
  parsePhoneNumber,
} from 'libphonenumber-js';
import PhoneInputWithCountry, {
  CountrySelectorProps,
  Flag,
  isCountry,
  usePhoneInput,
} from 'react-phone-number-input/react-hook-form';
import 'react-phone-number-input/style.css';
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
import { Control, FieldValues, Path, PathValue } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';

type PhoneInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
> = Omit<React.ComponentPropsWithoutRef<'input'>, 'onChange' | 'value'> & {
  control: Control<TFieldValues>;
  name: TName;
  defaultValue?: PathValue<TFieldValues, TName>;
  label?: string;
  description?: string;
  international?: boolean;
};

const PhoneInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
>({
  name,
  control,
  label,
  description,
  ...props
}: PhoneInputProps<TFieldValues, TName>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <PhoneInputWithCountry
              name={field.name}
              control={control}
              rules={{
                validate: (value) => {
                  if (!value) return true;
                  const phoneNumber = parsePhoneNumber(value);
                  return !!phoneNumber?.isValid();
                },
              }}
              {...props}
              className={cn(
                'flex',
                error && 'rounded-md border border-destructive'
              )}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

type PhoneInputWithCountryProps = Omit<
  React.ComponentPropsWithoutRef<typeof PhoneInputWithCountry>,
  'country'
> & {
  country?: Country;
};

const PhoneInputWithCountryForward = React.forwardRef<
  React.ElementRef<typeof PhoneInputWithCountry>,
  PhoneInputWithCountryProps
>(({ className, country: countryProp, ...props }, ref) => {
  const {
    // An array of countries available for selection.
    countries,

    // Two-letter country code of the selected country.
    // E.g. "US", "RU", etc.
    country,

    // Set a new selected country.
    setCountry,

    // `country` property value of the international phone number.
    // E.g. "+1" for "US".
    countryCallingCode,

    // `nationalNumber` property value of the international phone number.
    // E.g. "2133734253"
    nationalNumber,

    // The `value` property of the `phone-input`.
    // E.g. "+12133734253".
    numberValue,

    // The `onChange` property of the `phone-input`.
    onChange,
  } = usePhoneInput({
    ...props,
    ...(countryProp && { defaultCountry: countryProp }),
  });

  return (
    <Input
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      placeholder="Enter phone number"
      value={formatIncompletePhoneNumber(
        (numberValue as E164Number) ?? '',
        country
      )}
      onChange={onChange}
      type="tel"
      ref={ref}
      // This is a custom property that we're adding to the `Input` component
      // to render the country selector.
      // We could also have used `React.cloneElement` to add the country selector.
      startAdornment={
        <MemoisedCountrySelector
          countries={countries}
          selectedCountry={country}
          onSelect={(value) => {
            // Focus the input field after selecting a country.
            const input = (
              ref as React.RefObject<HTMLInputElement>
            )?.current?.form?.querySelector<HTMLInputElement>(
              `input[name="${props.name}"]`
            );
            input?.focus();
            setCountry(value);
          }}
          value={countryCallingCode}
        />
      }
      {...props}
    />
  );
});

PhoneInputWithCountryForward.displayName = 'PhoneInputWithCountry';

const CustomCountrySelector = ({
  selectedCountry,
  countries,
  value,
  onSelect,
}: CountrySelectorProps) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (country: Country) => {
    onSelect(country);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="h-auto justify-between px-2 text-sm"
        >
          <div className="flex items-center gap-2">
            <Flag country={selectedCountry} countryName={selectedCountry} />
            {value}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <ScrollArea className="h-52">
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countries.map((c) => {
                  if (!isCountry(c)) return null;
                  return (
                    <CommandItem
                      key={c}
                      onSelect={() => handleSelect(c)}
                      value={`${getCountryCallingCode(c)}-${c}`}
                      className="flex items-center gap-2"
                    >
                      <Flag country={c} countryName={c} />
                      <span className="flex-1">{c}</span>
                      <span>+{getCountryCallingCode(c)}</span>
                      <Check
                        className={cn(
                          'ml-auto h-4 w-4',
                          selectedCountry === c ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const MemoisedCountrySelector = React.memo(CustomCountrySelector);
MemoisedCountrySelector.displayName = 'MemoisedCountrySelector';

export { PhoneInput };
