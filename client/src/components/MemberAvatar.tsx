import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface MemberAvatarProps {
  src: string;
  fallback: React.ReactNode;
  className?: string;
}

const MemberAvatar = ({ src, fallback, className }: MemberAvatarProps) => {
  return (
    <Avatar className={cn('h-7 w-7 md:h-10 md:w-10', className)}>
      <AvatarImage src={src} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
};

export default MemberAvatar;
