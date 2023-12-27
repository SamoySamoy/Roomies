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
import FileUpload from '@/components/FileUpload';
import { useCreateRoomMutation } from '@/hooks/mutations';
import { CreateRoomSchema, useCreateRoomForm } from '@/hooks/forms';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { RoomType } from '@/lib/types';

const FirstRoomPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File | null>(null);
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
    formData.append('roomImage', imageFile!);
    mutation.mutate(formData, {
      onSuccess: () => {
        toast({
          title: 'Create room OK',
        });
        // navigate('/rooms');
      },
      onError: () => {
        toast({
          title: 'Create room Failed',
        });
      },
      onSettled: () => {
        clearForm();
      },
    });
  };

  return (
    <Dialog open>
      <DialogContent className='overflow-hidden bg-white p-0 text-black'>
        <DialogHeader className='px-6 pt-8'>
          <DialogTitle className='text-center text-2xl font-bold'>
            Create your first room
          </DialogTitle>
          <DialogDescription className='text-justify text-zinc-500'>
            Give your room a personality with a name and an image. You can always change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-8 px-6'>
              <div className='flex items-center justify-center text-center'>
                <FormField
                  control={form.control}
                  name='roomImage'
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
                name='roomName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                      Room name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={form.formState.isLoading}
                        className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                        placeholder='Enter room name'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='roomType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Type</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className='bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none'>
                          <SelectValue placeholder='Select a room type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(RoomType).map(type => (
                          <SelectItem key={type} value={type} className='capitalize'>
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        disabled={form.formState.isLoading}
                        className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                        placeholder='Password of private room'
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

export default FirstRoomPage;
