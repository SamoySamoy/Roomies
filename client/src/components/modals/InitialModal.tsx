import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import { Plus, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const InitialModal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [serverName, setServerName] = useState('');

  const onSubmit = async () => {
    try {
      if (!serverName.trim()) {
        toast({
          title: 'Create server incomplete',
          description: 'Require server name',
        });
        return;
      }

      if (!imageFile) {
        toast({
          title: 'Create server incomplete',
          description: 'Require server image',
        });
        return;
      }

      const formData = new FormData();
      formData.append('serverName', serverName);
      formData.append('imageFile', imageFile);
    } catch {}
  };

  return (
    <Dialog open>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Customize your server
          </DialogTitle>
          <DialogDescription className='text-justify text-zinc-500'>
            Give your server a personality with a name and an image. You can always change it later.
          </DialogDescription>
        </DialogHeader>
        <div className='px-6 flex flex-col gap-4'>
          <div className='flex flex-col gap-2 justify-center items-center'>
            <label className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
              Server image
            </label>
            <ImageUpload onChange={(f) => setImageFile(f)} />
          </div>
          <div>
            <label className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
              Server name
            </label>
            <Input
              disabled={false}
              className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
              placeholder='Enter server name'
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className='bg-gray-100 px-6 py-4'>
          <Button disabled={false} onClick={onSubmit}>
            <span className='text-foreground'>Create</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface ImageUploadProps {
  onChange: (file: File) => void;
}

const ImageUpload = ({ onChange }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string>('');
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return preview ? (
    <div className='w-20 h-20 flex items-center justify-center relative'>
      <img src={preview} className='w-full h-full rounded-full' />
      <div
        className='bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm'
        onClick={() => setPreview('')}
      >
        <X className='h-4 w-4' />
      </div>
    </div>
  ) : (
    <Dropzone
      onDrop={(acceptedFiles) => {
        acceptedFiles.forEach((f) => {
          setPreview(URL.createObjectURL(f));
          onChange(f);
        });
      }}
      multiple={false}
    >
      {({ getRootProps, getInputProps, isDragActive }) => (
        <div {...getRootProps()} className='w-full flex items-center justify-center'>
          <input {...getInputProps()} />
          <div className='border-solid border border-background w-20 h-20 rounded-full flex flex-col items-center justify-center'>
            <Plus size={24} strokeWidth={1} absoluteStrokeWidth />
            {isDragActive && <p className='font-bold text-xs text-background'>Drop here</p>}
          </div>
        </div>
      )}
    </Dropzone>
  );
};

export default InitialModal;
