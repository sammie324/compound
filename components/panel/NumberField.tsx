'use client';

import { cn } from '@/lib/utils';

interface NumberFieldProps {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  unit?: string;
  placeholder?: string;
}

export function NumberField({ label, value, onChange, unit, placeholder }: NumberFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      onChange(undefined);
    } else {
      const num = parseFloat(val);
      if (!isNaN(num)) {
        onChange(num);
      }
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-zinc-400">{label}</label>
      <div className="relative">
        {unit === '$' && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">$</span>
        )}
        <input
          type="number"
          value={value ?? ''}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            'w-full py-2 text-sm text-zinc-100 bg-zinc-900 border border-zinc-800 rounded-md',
            'placeholder:text-zinc-600',
            'focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50',
            'transition-colors',
            unit === '$' ? 'pl-7 pr-3' : 'px-3'
          )}
        />
        {unit && unit !== '$' && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}