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
  const mutation = useJoinRoomMutation();
  const isLoading = form.formState.isSubmitting || mutation.isPending;

  const clearForm = () => {
    form.reset();
    mutation.reset();
  };

  const onSubmit = async (values: JoinRoomSchema) => {
    mutation.mutate(values, {
      onSuccess: (_, { roomId }) => {
        toast({
          title: 'Join private room ok',
        });
        closeModal();
        navigate(`/rooms/${roomId}`);
      },
      onError: () => {
        toast({
          title: 'Join private room failed',
        });
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
      <DialogContent className='overflow-hidden bg-white p-0 text-black'>
        <DialogHeader className='px-6 pt-8'>
          <DialogTitle className='text-2xl text-center font-bold'>Join Room</DialogTitle>
          <DialogDescription className='text-justify text-zinc-500'>
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
            </div>
            <DialogFooter className='bg-gray-100 px-6 py-4'>
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
