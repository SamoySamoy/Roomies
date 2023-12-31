import qs from 'query-string';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { IMAGE_EXT_LIST, SERVER_API_URL } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const dt = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  hour: 'numeric',
  month: 'short',
  year: 'numeric',
  minute: 'numeric',
  hour12: false,
});

export const convertMbToBytes = (mb: number) => mb * Math.pow(1024, 2);

export const getExtName = (filename: string) => {
  return filename.split('.').reverse()[0].toLowerCase();
};

export const isImageFile = (filename: string | undefined | null) => {
  if (!filename) return false;
  // path.extname trả về đuôi file có chấm ở đầu (VD: .img, .pdf)
  const fileExt = getExtName(filename);
  return IMAGE_EXT_LIST.includes(fileExt);
};

export const getFileUrl = (relUrl: string | undefined | null) => {
  if (!relUrl) return '';
  return `${SERVER_API_URL}${relUrl}`;
};

export const getQueryString = (obj: Record<string, any> | undefined | null) => {
  const queryFilter = obj || {};
  const queryKeys = Array.from(Object.keys(queryFilter));
  const queryValues = Array.from(Object.values(queryFilter));
  const queryString = obj
    ? '?' +
      qs.stringify(queryFilter, {
        skipNull: true,
        skipEmptyString: true,
      })
    : '';
  return {
    queryFilter,
    queryKeys,
    queryValues,
    queryString,
  };
};
