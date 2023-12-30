import { useState } from 'react';
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
import { useParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const LeaveRoomModal = () => {
  const {
    isOpen,
    modalType,
    closeModal,
    data: { room },
  } = useModal();
  const { toast } = useToast();
  const mutation = useLeaveRoomMutation();

  const onLeave = () => {
    mutation.mutate(
      {
        roomId: room?.id!,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Leave room ok',
          });
        },
        onError: () => {
          toast({
            title: 'Leave room failed',
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
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>Leave Room</DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Are you sure you want to leave{' '}
            <span className='font-semibold text-indigo-500'>{room?.name}</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='bg-gray-100 px-6 py-4'>
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
