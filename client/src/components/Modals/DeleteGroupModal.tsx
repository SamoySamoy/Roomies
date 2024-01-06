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
import { useDeleteGroupMutation } from '@/hooks/mutations';
import { useToast } from '@/components/ui/use-toast';

const DeleteGroupModal = () => {
  const {
    isOpen,
    modalType,
    closeModal,
    data: { group, room },
  } = useModal();
  const { toast } = useToast();
  const mutation = useDeleteGroupMutation();
  const onDelete = () => {
    mutation.mutate(
      {
        groupId: group?.id!,
        roomId: room?.id!,
      },
      {
        onSuccess: () => {
          toast({
            description: 'Delete group successfully',
            variant: 'success',
          });
          closeModal();
        },
        onError: () => {
          toast({
            description: 'Delete group failed',
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
    <Dialog open={isOpen && modalType === 'deleteGroup'} onOpenChange={closeModal}>
      <DialogContent className='overflow-hidden bg-white p-0 text-black dark:bg-zinc-900 dark:text-white'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>Delete Group</DialogTitle>
          <DialogDescription className='text-center text-zinc-500 dark:text-zinc-400'>
            Are you sure you want to delete this group <br />
            <span className='text-indigo-500 font-semibold'>#{group?.name}</span> will be
            permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='bg-gray-100 dark:bg-zinc-800 px-6 py-4'>
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

export default DeleteGroupModal;
