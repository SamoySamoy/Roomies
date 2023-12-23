import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { SERVER_API_URL } from './api';

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

export const getImageUrl = (relUrl: string) => `${SERVER_API_URL}${relUrl}`;
