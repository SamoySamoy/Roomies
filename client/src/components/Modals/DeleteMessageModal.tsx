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
import { socket } from '@/lib/socket';
import { useState } from 'react';

const DeleteMessageModal = () => {
  const {
    isOpen,
    modalType,
    closeModal,
    data: { origin, messageId },
  } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    setIsLoading(true);
    socket.emit('client:group:message:delete', origin!, {
      messageId: messageId!,
    });
    setIsLoading(false);
    closeModal();
  };

  return (
    <Dialog open={isOpen && modalType === 'deleteMessage'} onOpenChange={closeModal}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>Delete Message</DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Are you sure you want to delete this message <br />
            The message will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='bg-gray-100 px-6 py-4'>
          <div className='flex items-center justify-between w-full'>
            <Button disabled={isLoading} onClick={closeModal} variant='destructive'>
              Cancel
            </Button>
            <Button disabled={isLoading} variant='primary' onClick={onDelete}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMessageModal;
