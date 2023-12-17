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
    data: { server },
  } = useModal();

  const [copied, setCopied] = useState(false);
  const inviteUrl = `${origin}/invite/${server?.inviteCode || ''}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Dialog open={isOpen && modalType === 'invite'} onOpenChange={closeModal}>
      <DialogContent className='bg-background text-foreground p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>Invite Friends</DialogTitle>
        </DialogHeader>
        <div className='px-6 pb-4'>
          <Label className='uppercase text-xs font-bold text-zinc-500 dark:text-muted-foreground'>
            Server invite link
          </Label>
          <div className='flex items-center mt-2 gap-x-2'>
            <Input
              className='bg-zinc-300/50 dark:bg-foreground border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
              value={inviteUrl}
              onChange={e => e.preventDefault()}
            />
            <Button onClick={onCopy} size='icon'>
              {copied ? <Check className='w-4 h-4' /> : <Copy className='w-4 h-4' />}
            </Button>
          </div>
          {/* <Button
            onClick={onNew}
            disabled={isLoading}
            variant='link'
            size='sm'
            className='text-xs text-zinc-500 mt-4'
          >
            Generate a new link
            <RefreshCw className='w-4 h-4 ml-2' />
          </Button> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
