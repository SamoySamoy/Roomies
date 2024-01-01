import { useEffect, useState } from 'react';
import Dropzone, { DropzoneProps } from 'react-dropzone';
import { Plus, X, FileIcon } from 'lucide-react';
import { getFileNameFromUrl, getFileUrl, isImageFile } from '@/lib/utils';

export type FileUpload =
  | {
      type: 'offline';
      file: File;
    }
  | {
      type: 'online';
      fileUrl: string;
    };

type FileUploadZoneProps = DropzoneProps & {
  onChange: (file: FileUpload | null) => void;
  value: FileUpload | null;
};

const getPreview = (file: FileUpload | null | undefined) => {
  if (file && file.type === 'online') {
    return getFileUrl(file.fileUrl);
  }
  if (file && file.type === 'offline') {
    return URL.createObjectURL(file.file);
  }
  return '';
};

const FileUploadZone = ({ onChange, value, ...dropzoneProps }: FileUploadZoneProps) => {
  const [preview, setPreview] = useState<string>(getPreview(value));

  const clearFile = () => {
    setPreview('');
    onChange(null);
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  if (!value) {
    return (
      <Dropzone
        onDrop={acceptedFiles => {
          acceptedFiles.forEach(file => {
            const newFileUpload: FileUpload = {
              type: 'offline',
              file,
            };
            setPreview(getPreview(newFileUpload));
            onChange(newFileUpload);
          });
        }}
        multiple={false}
        {...dropzoneProps}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div {...getRootProps()} className='flex w-full items-center justify-center'>
            <input {...getInputProps()} />
            <div className='flex h-20 w-20 flex-col items-center justify-center rounded-full border border-solid border-slate-950'>
              <Plus size={24} strokeWidth={1} absoluteStrokeWidth />
              {isDragActive && <p className='text-xs font-bold text-background'>Drop here</p>}
            </div>
          </div>
        )}
      </Dropzone>
    );
  }

  // Has preview
  if (isImageFile(value.type === 'online' ? value.fileUrl : value.file.name)) {
    return (
      <div className='relative flex h-20 w-20 items-center justify-center'>
        <img src={preview} className='h-full w-full rounded-full' />
        <div
          className='absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-white shadow-sm'
          onClick={clearFile}
        >
          <X className='h-4 w-4' />
        </div>
      </div>
    );
  }

  return (
    <div className='relative flex items-center p-2 mt-2 rounded-md bg-background/10'>
      <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400' />
      <a
        href={preview}
        target='_blank'
        rel='noopener noreferrer'
        className='ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'
      >
        {value.type === 'online' ? getFileNameFromUrl(value.fileUrl) : value.file.name}
      </a>
      <button
        onClick={clearFile}
        className='bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm'
        type='button'
      >
        <X className='h-4 w-4' />
      </button>
    </div>
  );
};

export default FileUploadZone;
