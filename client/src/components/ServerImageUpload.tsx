import { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import { Plus, X } from 'lucide-react';

interface ImageUploadProps {
  onChange: (file: File | null) => void;
  preset?: string;
}

const ServerImageUpload = ({ onChange, preset }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string>(preset || '');
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return preview ? (
    <div className='relative flex h-20 w-20 items-center justify-center'>
      <img src={preview} className='h-full w-full rounded-full' />
      <div
        className='absolute -right-2 -top-2 rounded-full bg-rose-500 p-1 text-white shadow-sm'
        onClick={() => {
          setPreview('');
          onChange(null);
        }}
      >
        <X className='h-4 w-4' />
      </div>
    </div>
  ) : (
    <Dropzone
      onDrop={acceptedFiles => {
        acceptedFiles.forEach(f => {
          setPreview(URL.createObjectURL(f));
          onChange(f);
        });
      }}
      multiple={false}
    >
      {({ getRootProps, getInputProps, isDragActive }) => (
        <div {...getRootProps()} className='flex w-full items-center justify-center'>
          <input {...getInputProps()} />
          <div className='flex h-20 w-20 flex-col items-center justify-center rounded-full border border-solid border-background'>
            <Plus size={24} strokeWidth={1} absoluteStrokeWidth />
            {isDragActive && <p className='text-xs font-bold text-background'>Drop here</p>}
          </div>
        </div>
      )}
    </Dropzone>
  );
};

export default ServerImageUpload;
