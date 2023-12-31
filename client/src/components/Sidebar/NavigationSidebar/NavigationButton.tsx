import { Plus, Compass, LogOut, Mail } from 'lucide-react';
import ActionTooltip from '@/components/ActionToolTip';
import { useModal } from '@/hooks/useModal';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '@/hooks/mutations';
import { useToast } from '@/components/ui/use-toast';

export const ExploreButton = () => {
  return (
    <div>
      <ActionTooltip
        side='right'
        align='center'
        label={<p className='text-sm font-bold'>Explore more rooms</p>}
      >
        <Link to={'/explore'}>
          <button className='group flex items-center'>
            <div className='mx-3 flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-[24px] bg-background transition-all group-hover:rounded-[16px] group-hover:bg-indigo-500 dark:bg-neutral-700'>
              <Compass className='text-indigo-500 transition group-hover:text-white' size={25} />
            </div>
          </button>
        </Link>
      </ActionTooltip>
    </div>
  );
};

export const CreateRoomButton = () => {
  const { openModal } = useModal();

  return (
    <div>
      <ActionTooltip
        side='right'
        align='center'
        label={<p className='text-sm font-bold'>Create a room</p>}
      >
        <button
          onClick={() =>
            openModal({
              modalType: 'createRoom',
            })
          }
          className='group flex items-center'
        >
          <div className='mx-3 flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-[24px] bg-background transition-all group-hover:rounded-[16px] group-hover:bg-emerald-500 dark:bg-neutral-700'>
            <Plus className='text-emerald-500 transition group-hover:text-white' size={25} />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};

export const InviteButton = () => {
  const { openModal } = useModal();

  return (
    <div>
      <ActionTooltip
        side='right'
        align='center'
        label={<p className='text-sm font-bold'>Join a room by invite code</p>}
      >
        <button
          onClick={() =>
            openModal({
              modalType: 'joinByInviteCode',
            })
          }
          className='group flex items-center'
        >
          <div className='mx-3 flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-[24px] bg-background transition-all group-hover:rounded-[16px] group-hover:bg-amber-500 dark:bg-neutral-700'>
            <Mail className='text-amber-500 transition group-hover:text-white' size={25} />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};
export const LogoutButton = () => {
  const mutation = useLogoutMutation();
  const { toast } = useToast();
  const navigate = useNavigate();

  const onLogout = () => {
    mutation.mutate(undefined, {
      onSuccess: () => {
        toast({
          title: 'Logout ok',
        });
        navigate('/');
      },
      onError: () => {
        toast({
          title: 'Logout failed',
        });
      },
    });
  };

  return (
    <div>
      <ActionTooltip
        side='right'
        align='center'
        label={<p className='text-sm font-bold'>Logout</p>}
      >
        <button onClick={onLogout} className='group flex items-center'>
          <div className='mx-3 flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-[24px] bg-background transition-all group-hover:rounded-[16px] group-hover:bg-rose-500 dark:bg-neutral-700'>
            <LogOut className='text-rose-500 transition group-hover:text-white' size={25} />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};
