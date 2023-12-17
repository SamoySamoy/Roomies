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

const DeleteMessageModal = () => {
  const {
    isOpen,
    modalType,
    closeModal,
    data: { server, channel, apiUrl, query },
  } = useModal();

  const onDelete = async () => {
    try {
      // setIsLoading(true);
      // const url = qs.stringifyUrl({
      //   url: apiUrl || "",
      //   query,
      // });
      // await axios.delete(url);
      // onClose();
    } catch (error) {
      console.log(error);
    } finally {
      // setIsLoading(false);
    }
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
              onClick={onDelete}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMessageModal;