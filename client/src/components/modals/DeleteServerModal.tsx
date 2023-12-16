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
import useModal from '@/hooks/useModal';

const DeleteServerModal = () => {
  const {
    isOpen,
    modalType,
    closeModal,
    data: { server },
  } = useModal();

  const onDelete = async () => {
    try {
      // setIsLoading(true);
      // await axios.delete(`/api/servers/${server?.id}`);
      // onClose();
      // router.refresh();
      // router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      // setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen && modalType === 'deleteServer'} onOpenChange={closeModal}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>Delete Server</DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Are you sure you want to delete this server <br />
            <span className='text-indigo-500 font-semibold'>{server?.name}</span> will be
            permanently deleted.
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

export default DeleteServerModal;
