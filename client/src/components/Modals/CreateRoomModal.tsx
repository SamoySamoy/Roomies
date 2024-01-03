import { useState } from 'react';
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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import FileUploadZone, { FileUpload } from '@/components/FileUploadZone';
import { useModal } from '@/hooks/useModal';
import { CreateRoomSchema, useCreateRoomForm } from '@/hooks/forms';
import { useCreateRoomMutation } from '@/hooks/mutations';
import { RoomType } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const CreateRoomModal = () => {
  const { toast } = useToast();
  const { isOpen, modalType, closeModal } = useModal();
  const [imageFile, setImageFile] = useState<FileUpload | null>(null);
  const form = useCreateRoomForm();
  const mutation = useCreateRoomMutation();
  const isLoading = form.formState.isSubmitting || mutation.isPending;

  const clearForm = () => {
    setImageFile(null);
    form.reset();
    mutation.reset();
  };

  const onSubmit = async (values: CreateRoomSchema) => {
    if (values.roomType === RoomType.PRIVATE && !values.roomPassword) {
      return form.setError('roomPassword', { message: 'Private room require password' });
    }
    form.clearErrors();

    const formData = new FormData();
    formData.append('roomName', values.roomName);
    formData.append('roomType', values.roomType);
    formData.append('roomPassword', values.roomPassword);
    if (imageFile?.type === 'offline') {
      formData.append('roomImage', imageFile.file);
    }
    mutation.mutate(formData, {
      onSuccess: () => {
        toast({
          description: 'Create room successfully',
          variant: 'success',
        });
        closeModal();
      },
      onError: () => {
        toast({
          description: 'Create room failed',
          variant: 'error',
        });
      },
      onSettled: () => {
        clearForm();
      },
    });
  };

  return (
    <Dialog
      open={isOpen && modalType === 'createRoom'}
      onOpenChange={() => {
        closeModal();
        clearForm();
      }}
    >
      <DialogContent className='overflow-hidden bg-white p-0 text-black'>
        <DialogHeader className='px-6 pt-8'>
          <DialogTitle className='text-center text-2xl font-bold'>Create your room</DialogTitle>
          <DialogDescription className='text-left text-zinc-500'>
            Give your room a personality with a name and an image. You can always change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-4 px-6'>
              <div className='flex items-center justify-center text-center'>
                <FormField
                  control={form.control}
                  name='roomImage'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUploadZone
                          onChange={uploadFile => {
                            setImageFile(uploadFile);
                            field.onChange(
                              !uploadFile
                                ? ''
                                : uploadFile.type === 'online'
                                ? uploadFile.fileUrl
                                : uploadFile.file.name,
                            );
                          }}
                          value={imageFile}
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

              <div className='flex flex-row gap-2'>
                <div className='flex-1'>
                  <FormField
                    control={form.control}
                    name='roomName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                          Room name
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isLoading}
                            className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                            placeholder='Enter room name'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='w-24'>
                  <FormField
                    control={form.control}
                    name='roomType'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                          Room Type
                        </FormLabel>
                        <FormControl>
                          <Select
                            disabled={isLoading}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className='bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none'>
                              <SelectValue placeholder='Select a room type' />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(RoomType).map(type => (
                                <SelectItem key={type} value={type} className='capitalize'>
                                  {type.toLowerCase()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {form.getValues().roomType === RoomType.PRIVATE && (
                <FormField
                  control={form.control}
                  name='roomPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                        Room password
                      </FormLabel>
                      <FormDescription>Private room require a password</FormDescription>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                          placeholder='Enter password for private room'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <DialogFooter className='bg-gray-100 px-6 py-4'>
              <Button type='submit' variant='primary' disabled={isLoading}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoomModal;
