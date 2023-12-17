import { useState } from 'react';
import {
  Check,
  Gavel,
  Loader2,
  Loader,
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
import { members } from '@/lib/fakeData';
import { ChannelTypeEnum, Member, MemberRole, ServerTypeEnum } from '@/lib/types';
import { cn } from '@/lib/utils';

const roleIconMap: Record<MemberRole, React.ReactNode> = {
  guest: null,
  moderator: <ShieldCheck className='h-4 w-4 ml-2 text-indigo-500' />,
  admin: <ShieldAlert className='h-4 w-4 text-rose-500' />,
};

const MembersModal = () => {
  const {
    isOpen,
    modalType,
    closeModal,
    data: { server },
  } = useModal();

  // console.log(Object.values(ChannelTypeEnum.AUDIO.toString()));
  // console.log(ChannelTypeEnum.AUDIO.toString());

  const onKick = async (memberId: string) => {
    try {
      // setLoadingId(memberId);
      // const url = qs.stringifyUrl({
      //   url: `/api/members/${memberId}`,
      //   query: {
      //     serverId: server?.id,
      //   },
      // });
      // const response = await axios.delete(url);
      // router.refresh();
      // onOpen('members', { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      // setLoadingId('');
    }
  };

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      // setLoadingId(memberId);
      // const url = qs.stringifyUrl({
      //   url: `/api/members/${memberId}`,
      //   query: {
      //     serverId: server?.id,
      //   },
      // });
      // const response = await axios.patch(url, { role });
      // router.refresh();
      // onOpen('members', { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      // setLoadingId('');
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  return (
    <Dialog open={isOpen && modalType === 'members'} onOpenChange={closeModal}>
      <DialogContent className='bg-white text-black overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>Manage Members</DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='mt-8 max-h-[420px] pr-6'>
          {members.map(member => (
            <div key={member.id} className='flex items-center gap-x-2 mb-6'>
              {/* <MemberAvatar src={member.profile.imageUrl} /> */}
              <MemberAvatar src='' fallback={<p className='text-foreground'>UN</p>} />
              <div className='flex flex-col gap-y-1'>
                <div className='text-xs font-semibold flex items-center gap-x-1'>
                  {/* {member.profile.name} */}
                  {member.id}
                  {roleIconMap[member.role as MemberRole]}
                </div>
                {/* <p className='text-xs text-zinc-500'>{member.profile.email}</p> */}
                <p className='text-xs text-zinc-500'>{member.profileId}</p>
              </div>
              {/* This modal show for only, the following block is action for not admin account */}
              {/* {server.profileId !== member.profileId && loadingId !== member.id && ( */}
              {/* TODO: Tách khối điều kiện này thành 1 Component */}
              {member.profileId && !isLoading && (
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
                            <DropdownMenuItem onClick={() => onRoleChange(member.id, 'guest')}>
                              <Shield className='h-4 w-4 mr-2' />
                              Guest
                              {member.role === 'guest' && <Check className='h-4 w-4 ml-auto' />}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onRoleChange(member.id, 'moderator')}
                              // className={cn({
                              //   'bg-emerald-400/70 focus:bg-emerald-400/90':
                              //     member.role === 'moderator',
                              // })}
                            >
                              <ShieldCheck className='h-4 w-4 mr-2' />
                              Moderator
                              {member.role === 'moderator' && <Check className='h-4 w-4 ml-auto' />}
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
              {/* {loadingId === member.id && ( */}
              {isLoading && <Loader2 className='animate-spin  text-zinc-500 ml-auto w-4 h-4' />}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MembersModal;
