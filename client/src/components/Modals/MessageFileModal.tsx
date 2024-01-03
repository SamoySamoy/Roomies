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
import FileUploadZone, { FileUpload } from '@/components/FileUploadZone';
import { useModal } from '@/hooks/useModal';
import { socket } from '@/lib/socket';
import { convertMbToBytes } from '@/lib/utils';
import { IMAGE_SIZE_LIMIT_IN_MB } from '@/lib/constants';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  fileName: z.string().trim().min(1, {
    message: 'Attachment is required.',
  }),
});

type FormSchema = z.infer<typeof formSchema>;

const MessageFileModal = () => {
  const { toast } = useToast();
  const {
    isOpen,
    modalType,
    closeModal,
    data: { groupOrigin, conversationOrigin },
  } = useModal();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileName: '',
    },
  });
  const [uploadedFile, setUploadedFile] = useState<FileUpload | null>(null);

  const clearForm = () => {
    setUploadedFile(null);
    form.reset();
  };

  const onSubmit = async (_: FormSchema) => {
    // console.log(uploadedFile);
    if (!uploadedFile || uploadedFile?.type === 'online') return;

    if (uploadedFile.file.size > convertMbToBytes(IMAGE_SIZE_LIMIT_IN_MB)) {
      return toast({
        title: 'Invalid',
        description: 'File size not over 5 MB',
        variant: 'warning',
      });
    }

    // console.log('Group origin', groupOrigin);
    // console.log('Conversation origin', conversationOrigin);

    if (groupOrigin) {
      socket.emit('client:group:message:upload', groupOrigin!, {
        filename: uploadedFile.file.name,
        filesize: uploadedFile.file.size,
        filetype: uploadedFile.file.type,
        buffer: uploadedFile.file.slice(),
      });
    } else {
      socket.emit('client:conversation:message:upload', conversationOrigin!, {
        filename: uploadedFile.file.name,
        filesize: uploadedFile.file.size,
        filetype: uploadedFile.file.type,
        buffer: uploadedFile.file.slice(),
      });
    }

    clearForm();
    closeModal();
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
                        <FileUploadZone
                          onChange={uploadFile => {
                            setUploadedFile(uploadFile);
                            field.onChange(
                              !uploadFile
                                ? ''
                                : uploadFile.type === 'online'
                                ? uploadFile.fileUrl
                                : uploadFile.file.name,
                            );
                          }}
                          value={uploadedFile}
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
