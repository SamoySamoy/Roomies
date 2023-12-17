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
import { useModal } from '@/context/ModalProvider';

const LeaveServerModal = () => {
  const {
    isOpen,
    modalType,
    closeModal,
    data: { server },
  } = useModal();

  const onLeave = async () => {
    try {
      // setIsLoading(true);
      // await axios.patch(`/api/servers/${server?.id}/leave`);
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
    <Dialog open={isOpen && modalType === 'leaveServer'} onOpenChange={closeModal}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>Leave Server</DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Are you sure you want to leave{' '}
            <span className='font-semibold text-indigo-500'>{server?.name}</span>?
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

export default LeaveServerModal;
