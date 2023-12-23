import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

const LoadingIcon = ({ className }: Props) => {
  return <Loader2 className={cn('animate-spin w-8 h-8', className)} />;
};

export default LoadingIcon;
