import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const LoadingOverlay = () => {
  return (
    <div className='fixed inset-y-0 inset-x-0 z-50 dark:bg-[#313338]/90 flex justify-center items-center'>
      <LoadingIcon />
    </div>
  );
};

export const LoadingPage = () => {
  return (
    <div className='w-full h-full flex-1 dark:bg-[#313338]/90 flex justify-center items-center'>
      <LoadingIcon />
    </div>
  );
};

export const LoadingBlock = () => {
  return (
    <div className='w-full h-[200px] flex-1 flex justify-center items-center bg-transparent'>
      <LoadingIcon />
    </div>
  );
};

type LoadingIconProps = {
  className?: string;
};

export const LoadingIcon = ({ className }: LoadingIconProps) => {
  return <Loader2 className={cn('animate-spin w-8 h-8', className)} />;
};
