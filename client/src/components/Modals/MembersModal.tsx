import {
  Check,
  Gavel,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useModal } from '@/hooks/useModal';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import MemberAvatar from '@/components/MemberAvatar';
import { Member, MemberRole } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useMembersQuery } from '@/hooks/queries';
import { Navigate } from 'react-router-dom';
import { useChangeRoleMemberMutation, useKickMemberMutation } from '@/hooks/mutations';
import { useToast } from '@/components/ui/use-toast';
import { LoadingBlock } from '@/components/Loading';

const roleIconMap: Record<MemberRole, React.ReactNode> = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className='h-4 w-4 ml-2 text-indigo-500' />,
  [MemberRole.ADMIN]: <ShieldAlert className='h-4 w-4 text-rose-500' />,
};

const MembersModal = () => {
  const {
    isOpen,
    modalType,
    closeModal,
    data: { room },
  } = useModal();
  const {
    data: members,
    isPending,
    isFetching,
    isError,
  } = useMembersQuery(room?.id!, {
    profile: true,
  });

  if (isError) {
    return <Navigate to={'/error-page'} replace />;
  }

  return (
    <Dialog open={isOpen && modalType === 'members'} onOpenChange={closeModal}>
      <DialogContent className='bg-white text-black overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>Manage Members</DialogTitle>
          {!isPending && !isFetching && (
            <DialogDescription className='text-center text-zinc-500'>
              {members.length} Members
            </DialogDescription>
          )}
        </DialogHeader>
        <ScrollArea className='mt-8 max-h-[420px] pr-6'>
          {!isPending && !isFetching ? (
            members.map(member => (
              <MemberCard
                key={member.id}
                showMenu={room?.profileId !== member.profileId}
                roomId={room?.id!}
                member={member}
              />
            ))
          ) : (
            <LoadingBlock />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export type MemberCardProps = {
  member: Member;
  showMenu: boolean;
  roomId: string;
};

export const MemberCard = ({ member, showMenu, roomId }: MemberCardProps) => {
  const { toast } = useToast();
  const kickMutation = useKickMemberMutation();
  const changeRoleMutation = useChangeRoleMemberMutation();

  const onKick = async (memberId: string) => {
    kickMutation.mutate(
      {
        roomId,
        memberId,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Kick member OK',
          });
        },
        onError: err => {
          toast({
            title: 'Kick member Failed',
          });
        },
        onSettled: () => {
          kickMutation.reset();
        },
      },
    );
  };

  const onChangeRole = async (memberId: string, role: MemberRole) => {
    changeRoleMutation.mutate(
      {
        roomId,
        memberId,
        role,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Change role OK',
          });
        },
        onError: () => {
          toast({
            title: 'Change role Failed',
          });
        },
        onSettled: () => {
          changeRoleMutation.reset();
        },
      },
    );
  };

  return (
    <div className='flex items-center gap-x-2 mb-6'>
      <MemberAvatar
        src={member.profile.imageUrl}
        fallback={
          <p className='text-foreground'>{member.profile.email.split('@')[0].slice(0, 2)}</p>
        }
      />
      <div className='flex flex-col gap-y-1'>
        <div className='text-sm font-semibold flex items-center gap-x-1'>
          {member.profile.email}
          {roleIconMap[member.role]}
        </div>
        <p className='text-xs text-zinc-500 capitalize'>{member.role.toLowerCase()}</p>
      </div>
      {/* Chỉ có thành viên không phải admin thì mới hiện menu */}
      {showMenu && (
        <div className='ml-auto'>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical className='h-4 w-4 text-zinc-500' />
            </DropdownMenuTrigger>
            <DropdownMenuContent side='left'>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className='flex items-center'>
                  <ShieldQuestion className='w-4 h-4 mr-2' />
                  <span>Role</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => onChangeRole(member.id, MemberRole.GUEST)}>
                      <Shield className='h-4 w-4 mr-2' />
                      Guest
                      {member.role === MemberRole.GUEST && <Check className='h-4 w-4 ml-auto' />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onChangeRole(member.id, MemberRole.MODERATOR)}
                      className={cn({
                        'bg-emerald-400/70 focus:bg-emerald-400/90':
                          member.role === MemberRole.MODERATOR,
                      })}
                    >
                      <ShieldCheck className='h-4 w-4 mr-2' />
                      Moderator
                      {member.role === MemberRole.MODERATOR && (
                        <Check className='h-4 w-4 ml-auto' />
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onKick(member.id)}>
                <Gavel className='h-4 w-4 mr-2' />
                Kick
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      {/* {isLoading && <Loader2 className='animate-spin text-zinc-500 ml-auto w-4 h-4' />} */}
    </div>
  );
};

export default MembersModal;
