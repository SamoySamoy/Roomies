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
import { useModal } from '@/hooks/useModal';
import { JoinRoomSchema, useJoinRoomForm } from '@/hooks/forms';
import { useJoinRoomMutation } from '@/hooks/mutations';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const JoinPrivateRoomModal = () => {
  const { toast } = useToast();
  const {
    isOpen,
    modalType,
    closeModal,
    data: { room },
  } = useModal();
  const navigate = useNavigate();
  const form = useJoinRoomForm({
    roomId: room?.id!,
    roomPassword: '',
  });
  const mutation = useJoinRoomMutation({
    refetch: true,
  });
  const isLoading = form.formState.isSubmitting || mutation.isPending;

  const clearForm = () => {
    form.reset();
    mutation.reset();
  };

  const onSubmit = async (values: JoinRoomSchema) => {
    // console.log(values);

    mutation.mutate(values, {
      onSuccess: data => {
        if (typeof data === 'boolean') {
          toast({
            description: 'You have already joined this room',
            variant: 'warning',
          });
          closeModal();
          return;
        }

        toast({
          description: 'Join private room successfully',
          variant: 'success',
        });
        closeModal();
        navigate(`/rooms/${data.id}`);
      },
      onError: () => {
        toast({
          description: 'Join private room failed',
          variant: 'error',
        });
        closeModal();
      },
      onSettled: () => {
        clearForm();
      },
    });
  };

  return (
    <Dialog
      open={isOpen && modalType === 'joinPrivateRoom'}
      onOpenChange={() => {
        closeModal();
        clearForm();
      }}
    >
      <DialogContent className='overflow-hidden bg-white p-0 text-black dark:bg-zinc-900 dark:text-white'>
        <DialogHeader className='px-6 pt-8'>
          <DialogTitle className='text-2xl text-center font-bold'>Join Room</DialogTitle>
          <DialogDescription className='text-left text-zinc-500 dark:text-zinc-400'>
            If you want to join private room{' '}
            <span className='text-indigo-500 font-semibold'>{room?.name}</span>, you must provide
            secret password
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-4 px-6'>
              <FormField
                control={form.control}
                name='roomPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>
                      Room password
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className='border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-zinc-300/50 text-black dark:bg-black dark:text-white'
                        placeholder='Enter password for private room'
                        {...field}
                        type='password'
                        autoComplete='current-password'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className='bg-gray-100 dark:bg-zinc-800 px-6 py-4'>
              <Button type='submit' variant='primary' disabled={isLoading}>
                Join
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinPrivateRoomModal;
