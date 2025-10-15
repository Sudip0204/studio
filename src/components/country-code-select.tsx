'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const countryCodes = [
  { code: '+91', country: 'India' },
  { code: '+1', country: 'USA' },
  { code: '+44', country: 'UK' },
  { code: '+61', country: 'Australia' },
  { code: '+86', country: 'China' },
  { code: '+81', country: 'Japan' },
];

interface CountryCodeSelectProps {
    onValueChange: (value: string) => void;
    defaultValue?: string;
}

export function CountryCodeSelect({ onValueChange, defaultValue }: CountryCodeSelectProps) {
  return (
    <Select onValueChange={onValueChange} defaultValue={defaultValue}>
      <SelectTrigger>
        <SelectValue placeholder="Code" />
      </SelectTrigger>
      <SelectContent>
        {countryCodes.map((item) => (
          <SelectItem key={item.code} value={item.code}>
            {item.code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
