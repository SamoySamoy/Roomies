import { LoadingPage } from '@/components/Loading';
import RoomSidebar from '@/components/Sidebar/RoomSidebar';
import { useRoomQuery } from '@/hooks/queries';
import { useAuth } from '@/hooks/useAuth';
// import { RoomOrigin } from '@/lib/socket';
import { Navigate, Outlet, useParams } from 'react-router-dom';

const RoomLayout = () => {
  const { auth } = useAuth();
  // const { toast } = useToast();
  // const navigate = useNavigate();
  // const queryClient = useQueryClient();

  const { roomId } = useParams<{ roomId: string }>();
  // const origin: RoomOrigin = {
  //   profileId: auth.profileId!,
  //   roomId: roomId!,
  // };

  const {
    data: room,
    isPending,
    isFetching,
    isError,
  } = useRoomQuery(
    roomId!,
    {
      groups: true,
      members: true,
      profilesOfMembers: true,
    },
    {
      refetchOnMount: true,
    },
  );
  const isRoomMember = Boolean(room?.members.find(member => member.profileId === auth.profileId));

  if (isPending || isFetching) {
    return <LoadingPage />;
  }

  if (isError || !room) {
    return <Navigate to={'/error-page'} replace />;
  }

  if (!isRoomMember) {
    return <Navigate to={'/not-member'} replace />;
  }

  return (
    <div className='h-full'>
      <div className='hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0'>
        <RoomSidebar room={room} />
      </div>
      <main className='h-full md:pl-60'>
        <Outlet />
      </main>
    </div>
  );
};

export default RoomLayout;
