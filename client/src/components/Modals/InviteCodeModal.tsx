import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useModal } from '@/hooks/useModal';

const InviteModal = () => {
  const {
    isOpen,
    modalType,
    closeModal,
    data: { room },
  } = useModal();

  const inviteUrl = `${window.location.origin}/invite/${room?.inviteCode || ''}`;

  return (
    <Dialog open={isOpen && modalType === 'inviteCode'} onOpenChange={closeModal}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>Invite Friends</DialogTitle>
        </DialogHeader>
        <InviteSection label='Room Invite Code' value={room?.inviteCode!} />
        <InviteSection label='Room Invite Link' value={inviteUrl} />
      </DialogContent>
    </Dialog>
  );
};

type InviteSectionProps = {
  label: string;
  value: string;
};
const InviteSection = ({ label, value }: InviteSectionProps) => {
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <div className='px-6 pb-4'>
      <Label className='uppercase text-xs font-bold text-zinc-500 dark:text-muted-foreground'>
        {label}
      </Label>
      <div className='flex items-center mt-2 gap-x-2'>
        <Input
          className='bg-zinc-300/50 dark:bg-foreground border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
          value={value}
          onChange={e => e.preventDefault()}
          autoFocus={false}
        />
        <Button onClick={onCopy} size='icon'>
          {copied ? <Check className='w-4 h-4' /> : <Copy className='w-4 h-4' />}
        </Button>
      </div>
    </div>
  );
};

export default InviteModal;
