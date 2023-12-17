import { Plus, Settings } from 'lucide-react';
import ActionTooltip from '@/components/ActionToolTip';
import { ChannelType, MemberRole } from '@/lib/types';
import { useModal } from '@/context/ModalProvider';

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: 'channels' | 'members';
  channelType?: ChannelType;
  server?: any;
}

const ChannelListSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) => {
  const { openModal } = useModal();

  return (
    <div className='flex items-center justify-between py-2'>
      <p className='text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400'>{label}</p>
      {/* {role !== MemberRole.GUEST && sectionType === 'channels' && ( */}
      {role !== 'guest' && sectionType === 'channels' && (
        <ActionTooltip label='Create Channel' side='top'>
          <button
            onClick={() =>
              openModal({
                modalType: 'createChannel',
                data: {
                  channelType,
                },
              })
            }
            className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
          >
            <Plus className='h-4 w-4' />
          </button>
        </ActionTooltip>
      )}
      {/* {role === MemberRole.ADMIN && sectionType === 'members' && ( */}
      {role === 'admin' && sectionType === 'members' && (
        <ActionTooltip label='Manage Members' side='top'>
          <button
            onClick={() =>
              openModal({
                modalType: 'members',
                data: {
                  server,
                },
              })
            }
            className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
          >
            <Settings className='h-4 w-4' />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};

export default ChannelListSection;
