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

const DeleteChannelModal = () => {
  const {
    isOpen,
    modalType,
    closeModal,
    data: { server, channel },
  } = useModal();

  const onDelete = async () => {
    try {
      // setIsLoading(true);
      // const url = qs.stringifyUrl({
      //   url: `/api/channels/${channel?.id}`,
      //   query: {
      //     serverId: server?.id,
      //   }
      // })
      // await axios.delete(url);
      // onClose();
      // router.refresh();
      // router.push(`/servers/${server?.id}`);
    } catch (error) {
      console.log(error);
    } finally {
      // setIsLoading(false);
    }
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

export default DeleteChannelModal;
