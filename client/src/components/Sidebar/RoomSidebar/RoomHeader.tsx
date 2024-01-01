import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from 'lucide-react';
import { MemberRole, Room } from '@/lib/types';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useModal } from '@/hooks/useModal';

type GroupListHeaderProps = {
  room: Room;
  role: MemberRole;
};

function RoomHeader({ role, room }: GroupListHeaderProps) {
  const { openModal } = useModal();
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='focus:outline-none' asChild>
        <button className='w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'>
          {room.name}
          <ChevronDown className='h-5 w-5 ml-auto' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]'>
        {isModerator && (
          <DropdownMenuItem
            onClick={() =>
              openModal({
                modalType: 'inviteCode',
                data: {
                  room,
                },
              })
            }
            className='text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer'
          >
            Invite People
            <UserPlus className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() =>
              openModal({
                modalType: 'editRoom',
                data: {
                  room,
                },
              })
            }
            className='px-3 py-2 text-sm cursor-pointer'
          >
            Room Settings
            <Settings className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() =>
              openModal({
                modalType: 'members',
                data: {
                  room,
                },
              })
            }
            className='px-3 py-2 text-sm cursor-pointer'
          >
            Manage Members
            <Users className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            onClick={() =>
              openModal({
                modalType: 'createGroup',
                data: {
                  room,
                },
              })
            }
            className='px-3 py-2 text-sm cursor-pointer'
          >
            Create Group
            <PlusCircle className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() =>
              openModal({
                modalType: 'deleteRoom',
                data: {
                  room,
                },
              })
            }
            className='text-rose-500 px-3 py-2 text-sm cursor-pointer'
          >
            Delete Room
            <Trash className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            onClick={() =>
              openModal({
                modalType: 'leaveRoom',
                data: {
                  room,
                },
              })
            }
            className='text-rose-500 px-3 py-2 text-sm cursor-pointer'
          >
            Leave Room
            <LogOut className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default RoomHeader;
