import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useModal } from '@/hooks/useModal';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ImageModal = () => {
  const {
    isOpen,
    modalType,
    closeModal,
    data: { imageUrl },
  } = useModal();

  return (
    <Dialog open={isOpen && modalType === 'image'} onOpenChange={closeModal}>
      <DialogContent className={`bg-white text-black gap-y-0 p-0 min-w-[1000px] min-h-[600px]`}>
        <img src={imageUrl} className={`h-full w-full`} />
        <DialogFooter className=''>
          <Link to={imageUrl || '#'} rel='noopener noreferrer' target='_blank'>
            <Button variant='link' className='text-black'>
              Open image in other tab
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
