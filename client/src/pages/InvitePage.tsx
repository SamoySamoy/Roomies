import { Navigate, useParams } from 'react-router-dom';
import { LoadingPage } from '@/components/Loading';
import { useEffect, useState } from 'react';
import { useJoinRoomByInviteCodeMutation } from '@/hooks/mutations';
import { useToast } from '@/components/ui/use-toast';

const InvitePage = () => {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const { toast } = useToast();
  const mutation = useJoinRoomByInviteCodeMutation({
    refetch: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [nextLocation, setNextLocation] = useState('/my-rooms');

  const onInvite = () => {
    mutation.mutate(
      {
        inviteCode: inviteCode!,
      },
      {
        onSuccess: data => {
          if (typeof data === 'boolean') {
            toast({
              title: 'You have already joined this room',
              variant: 'warning',
            });
            return;
          }

          setNextLocation(`/rooms/${data.id}`);
          toast({
            title: 'Join room by invite code ok',
            variant: 'success',
          });
        },
        onError: () => {
          toast({
            title: 'Join room by invite code failed',
            variant: 'error',
          });
        },
        onSettled: () => {
          setIsLoading(false);
          mutation.reset();
        },
      },
    );
  };

  useEffect(() => {
    onInvite();
  }, []);

  if (isLoading || mutation.isPending) {
    return <LoadingPage />;
  }

  return <Navigate to={nextLocation} replace />;
};

export default InvitePage;
