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
import { useJoinRoomMutation } from '@/hooks/mutations';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const JoinPublicRoomModal = () => {
  const {
    isOpen,
    modalType,
    closeModal,
    data: { room },
  } = useModal();
  const { toast } = useToast();
  const navigate = useNavigate();
  const mutation = useJoinRoomMutation({
    refetch: true,
  });
  const onDelete = () => {
    mutation.mutate(
      {
        roomId: room?.id!,
        roomPassword: '',
      },
      {
        onSuccess: data => {
          if (typeof data === 'boolean') {
            toast({
              title: 'You have already joined this room',
            });
            closeModal();
            return;
          }

          toast({
            title: 'Join public room ok',
          });
          closeModal();
          navigate(`/rooms/${data.id}`);
        },
        onError: () => {
          toast({
            title: 'Join public room failed',
          });
          closeModal();
        },
        onSettled: () => {
          mutation.reset();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen && modalType === 'joinPublicRoom'} onOpenChange={closeModal}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>Join Room</DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Are you sure you want to join public room{' '}
            <span className='text-indigo-500 font-semibold'>{room?.name}</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='bg-gray-100 px-6 py-4'>
          <div className='flex items-center justify-between w-full'>
            <Button disabled={mutation.isPending} onClick={closeModal} variant='destructive'>
              Cancel
            </Button>
            <Button disabled={mutation.isPending} variant='primary' onClick={onDelete}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JoinPublicRoomModal;
