import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const i18n = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  hour: 'numeric',
  month: 'short',
  year: 'numeric',
  minute: 'numeric',
  hour12: false,
});
