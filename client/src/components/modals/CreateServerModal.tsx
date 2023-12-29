import { useState } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/FileUpload';
import { useModal } from '@/hooks/useModal';

const formSchema = z.object({
  serverName: z.string().trim().min(1, {
    message: 'Server name is required.',
  }),
  imageName: z.string().trim().min(1, {
    message: 'Server image is required.',
  }),
});

type FormSchema = z.infer<typeof formSchema>;

const CreateServerModal = () => {
  const { isOpen, modalType, closeModal } = useModal();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serverName: '',
      imageName: '',
    },
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const clearForm = () => {
    setImageFile(null);
    form.reset();
  };

  const onSubmit = async (values: FormSchema) => {
    try {
      console.log(values);
      console.log(imageFile);
      const formData = new FormData();
      formData.append('serverName', values.serverName);
      formData.append('imageFile', imageFile!);

      clearForm();
      closeModal();
    } catch (err) {
      console.log(err);
      clearForm();
    }
  };

  return (
    <Dialog
      open={isOpen && modalType === 'createServer'}
      onOpenChange={() => {
        closeModal();
        clearForm();
      }}
    >
      <DialogContent className='overflow-hidden bg-white p-0 text-black'>
        <DialogHeader className='px-6 pt-8'>
          <DialogTitle className='text-center text-2xl font-bold'>
            Customize your server
          </DialogTitle>
          <DialogDescription className='text-justify text-zinc-500'>
            Give your server a personality with a name and an image. You can always change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-8 px-6'>
              <div className='flex items-center justify-center text-center'>
                <FormField
                  control={form.control}
                  name='imageName'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          onChange={f => {
                            setImageFile(f);
                            field.onChange(f?.name || '');
                          }}
                          accept={{
                            'image/*': [],
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='serverName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                      Server name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={form.formState.isLoading}
                        className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                        placeholder='Enter server name'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className='bg-gray-100 px-6 py-4'>
              <Button type='submit' variant='primary' disabled={form.formState.isLoading}>
                <span className='text-foreground'>Create</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateServerModal;