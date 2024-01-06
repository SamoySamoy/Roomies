import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useModal } from '@/hooks/useModal';
import { useLeaveRoomMutation } from '@/hooks/mutations';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const LeaveRoomModal = () => {
  const {
    isOpen,
    modalType,
    closeModal,
    data: { room },
  } = useModal();
  const { toast } = useToast();
  const navigate = useNavigate();
  const mutation = useLeaveRoomMutation();

  const onLeave = () => {
    mutation.mutate(
      {
        roomId: room?.id!,
      },
      {
        onSuccess: () => {
          toast({
            description: 'Leave room successfully',
            variant: 'success',
          });
          closeModal();
          navigate('/my-rooms');
        },
        onError: () => {
          toast({
            description: 'Leave room failed',
            variant: 'error',
          });
        },
        onSettled: () => {
          mutation.reset();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen && modalType === 'leaveRoom'} onOpenChange={closeModal}>
      <DialogContent className='overflow-hidden bg-white p-0 text-black dark:bg-zinc-900 dark:text-white'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>Leave Room</DialogTitle>
          <DialogDescription className='text-center text-zinc-500 dark:text-zinc-400'>
            Are you sure you want to leave{' '}
            <span className='font-semibold text-indigo-500'>{room?.name}</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='bg-gray-100 dark:bg-zinc-800 px-6 py-4'>
          <div className='flex items-center justify-between w-full'>
            <Button
              // disabled={isLoading}
              onClick={closeModal}
              variant='destructive'
            >
              Cancel
            </Button>
            <Button
              // disabled={isLoading}
              variant='primary'
              onClick={onLeave}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveRoomModal;
