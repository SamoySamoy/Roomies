import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { useModal } from '@/hooks/useModal';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { REAL_MESSAGE_FILE_HEIGHT, REAL_MESSAGE_FILE_WIDTH } from '@/lib/constants';

const ImageModal = () => {
  const {
    isOpen,
    modalType,
    closeModal,
    data: { imageUrl },
  } = useModal();

  return (
    <Dialog open={isOpen && modalType === 'image'} onOpenChange={closeModal}>
      <DialogContent
        className={`bg-white text-black dark:bg-zinc-900 dark:text-white gap-y-0 p-0 min-w-[${REAL_MESSAGE_FILE_WIDTH}px] min-h-[${REAL_MESSAGE_FILE_HEIGHT}px]`}
      >
        <img src={imageUrl} className={`h-full w-full`} />
        <DialogFooter className='bg-gray-100 dark:bg-zinc-800'>
          <Link to={imageUrl || '#'} rel='noopener noreferrer' target='_blank'>
            <Button variant='link' className='text-black dark:text-white'>
              Open image in other tab
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
