import { useEffect, useState } from 'react';
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
import ServerImageUpload from '../ServerImageUpload';
import { useModal } from '@/context/ModalProvider';

const formSchema = z.object({
  serverName: z.string().trim().min(1, {
    message: 'Server name is required.',
  }),
  imageName: z.string().trim().min(1, {
    message: 'Server image is required.',
  }),
});

type FormSchema = z.infer<typeof formSchema>;

const EditServerModal = () => {
  const {
    isOpen,
    modalType,
    closeModal,
    data: { server },
  } = useModal();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serverName: server?.name || '',
      // In this case have imageName or imageUrl still ok
      imageName: server?.imageUrl || '',
    },
  });

  const isServerNameChanged = form.getFieldState('serverName').isDirty;
  const isServerImageChanged = form.getFieldState('imageName').isDirty;
  const isChanged = isServerNameChanged || isServerImageChanged;

  useEffect(() => {
    form.setValue('serverName', server?.name || '');
    form.setValue('imageName', server?.imageUrl || '');
  }, [server]);

  const clearForm = () => {
    setImageFile(null);
    form.reset();
  };

  const onSubmit = async (values: FormSchema) => {
    try {
      const formData = new FormData();
      console.log(values);
      if (isServerNameChanged) {
        formData.append('serverName', values.serverName);
      }
      if (isServerImageChanged) {
        console.log(imageFile);
        formData.append('imageFile', imageFile!);
      }

      clearForm();
      closeModal();
    } catch (err) {
      console.log(err);
      clearForm();
    }
  };

  return (
    <Dialog
      open={isOpen && modalType === 'editServer'}
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
                        <ServerImageUpload
                          onChange={f => {
                            setImageFile(f);
                            field.onChange(f?.name || '');
                          }}
                          preset={server?.imageUrl}
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
              <Button
                type='submit'
                variant='primary'
                disabled={form.formState.isLoading || !isChanged}
              >
                <span className='text-foreground'>Save</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditServerModal;
