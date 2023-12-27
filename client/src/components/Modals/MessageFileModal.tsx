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
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/FileUpload';
import { useModal } from '@/hooks/useModal';

const formSchema = z.object({
  fileName: z.string().trim().min(1, {
    message: 'Attachment is required.',
  }),
});

type FormSchema = z.infer<typeof formSchema>;

const MessageFileModal = () => {
  const { isOpen, modalType, closeModal } = useModal();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileName: '',
    },
  });
  const [file, setFile] = useState<File | null>(null);

  const clearForm = () => {
    setFile(null);
    form.reset();
  };

  const onSubmit = async (values: FormSchema) => {
    try {
      // const url = qs.stringifyUrl({
      //   url: apiUrl || "",
      //   query,
      // });

      // await axios.post(url, {
      //   ...values,
      //   content: values.fileUrl,
      // });

      console.log(values);
      console.log(file);
      const formData = new FormData();
      formData.append('imageFile', file!);

      clearForm();
      closeModal();
    } catch (err) {
      console.log(err);
      clearForm();
    }
  };

  return (
    <Dialog
      open={isOpen && modalType === 'messageFile'}
      onOpenChange={() => {
        closeModal();
        clearForm();
      }}
    >
      <DialogContent className='overflow-hidden bg-white p-0 text-black'>
        <DialogHeader className='px-6 pt-8'>
          <DialogTitle className='text-2xl text-center font-bold'>Add an attachment</DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>Send a file</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-8 px-6'>
              <div className='flex items-center justify-center text-center'>
                <FormField
                  control={form.control}
                  name='fileName'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          onChange={f => {
                            setFile(f);
                            field.onChange(f?.name || '');
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className='bg-gray-100 px-6 py-4'>
              <Button type='submit' variant='primary' disabled={form.formState.isLoading}>
                <span className='text-foreground'>Send</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageFileModal;
