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

export const getFileNameFromUrl = (fileUrl: string) => fileUrl.split('/').pop();

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

export const convertViToEn = (str: string, toUpperCase = false) => {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư

  return toUpperCase ? str.toUpperCase() : str;
};

export const removeAccents = (str: string) =>
  !str.trim()
    ? ''
    : str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');

export const normalizeStr = (str: string) => removeAccents(str.toLowerCase());
