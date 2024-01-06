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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import FileUploadZone, { FileUpload } from '@/components/FileUploadZone';
import { useCreateRoomMutation } from '@/hooks/mutations';
import { CreateRoomSchema, useCreateRoomForm } from '@/hooks/forms';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { RoomType } from '@/lib/types';

const FirstRoomPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<FileUpload | null>(null);
  const form = useCreateRoomForm();
  const mutation = useCreateRoomMutation({
    refetch: true,
  });
  const isLoading = form.formState.isSubmitting || mutation.isPending;

  const clearForm = () => {
    setImageFile(null);
    form.reset();
    mutation.reset();
  };

  const onSubmit = async (values: CreateRoomSchema) => {
    if (values.roomType === RoomType.PRIVATE && !values.roomPassword) {
      return form.setError('roomPassword', {
        message: 'Private room require password',
        type: 'required',
      });
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
        navigate('/my-rooms');
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
    <Dialog open>
      <DialogContent className='overflow-hidden bg-white p-0 text-black dark:bg-zinc-900 dark:text-white'>
        <DialogHeader className='px-6 pt-8'>
          <DialogTitle className='text-center text-2xl font-bold'>Customize your room</DialogTitle>
          <DialogDescription className='text-left text-zinc-500 dark:text-zinc-400'>
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
                        <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>
                          Room name
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isLoading}
                            className='border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-zinc-300/50 text-black dark:bg-black dark:text-white'
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
                        <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>
                          Room Type
                        </FormLabel>
                        <FormControl>
                          <Select
                            disabled={isLoading}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className='border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-zinc-300/50 text-black dark:bg-black dark:text-white capitalize outline-none'>
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
                      <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>
                        Room password
                      </FormLabel>
                      <FormDescription>Private room require a password</FormDescription>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className='border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-zinc-300/50 text-black dark:bg-black dark:text-white'
                          placeholder='Enter password for private server'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <DialogFooter className='bg-gray-100 dark:bg-zinc-800 px-6 py-4'>
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

export default FirstRoomPage;
