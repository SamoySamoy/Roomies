import qs from 'query-string';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { SERVER_API_URL } from './constants';

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

export const getQueryString = (obj: Record<string, any> | undefined | null) => {
  const queryFilter = obj || {};
  const queryKeys = Array.from(Object.keys(queryFilter));
  const queryValues = Array.from(Object.values(queryFilter));
  const queryString = obj ? '?' + qs.stringify(queryFilter) : '';
  return {
    queryFilter,
    queryKeys,
    queryValues,
    queryString,
  };
};
