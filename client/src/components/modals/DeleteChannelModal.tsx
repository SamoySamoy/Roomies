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
import { useParams } from 'react-router-dom';
import { useDeleteChannelMutation } from '@/hooks/mutations';
import { useToast } from '@/components/ui/use-toast';

const DeleteChannelModal = () => {
  const {
    isOpen,
    modalType,
    closeModal,
    data: { server, channel },
  } = useModal();
  const { toast } = useToast();
  const { channelId } = useParams<{ channelId: string }>();
  const mutation = useDeleteChannelMutation();
  const onDelete = () => {
    mutation.mutate(
      {
        channelId: channelId!,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Delete server ok',
          });
        },
        onError: () => {
          toast({
            title: 'Delete server failed',
          });
        },
        onSettled: () => {
          mutation.reset();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen && modalType === 'deleteChannel'} onOpenChange={closeModal}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>Delete Server</DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Are you sure you want to delete this channel <br />
            <span className='text-indigo-500 font-semibold'>#{channel?.name}</span> will be
            permanently deleted.
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

export default DeleteChannelModal;
