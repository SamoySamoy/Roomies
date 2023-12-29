import { useEffect } from 'react';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChannelType, ChannelTypeEnum } from '@/lib/types';
import { useModal } from '@/hooks/useModal';

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Channel name is required.',
    })
    .refine(name => name !== 'general', {
      message: "Channel name cannot be 'general'",
    }),
  // type: z.nativeEnum(ChannelTypeEnum),
  type: z.string(),
});

const EditChannelModal = () => {
  const {
    isOpen,
    modalType,
    closeModal,
    data: { server, channel },
  } = useModal();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      // type: channel?.type || ChannelType.TEXT,
      type: ChannelTypeEnum.TEXT.toString(),
    },
  });

  useEffect(() => {
    if (channel) {
      form.setValue('name', channel?.name);
      // form.setValue('type', channel?.type);
      form.setValue('type', 'AUDIO');
    }
  }, [form, channel]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // const url = qs.stringifyUrl({
      //   url: `/api/groups/${channel?.id}`,
      //   query: {
      //     serverId: server?.id
      //   }
      // });
      // await axios.patch(url, values);

      // form.reset();
      // router.refresh();
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    form.reset();
    closeModal();
  };

  return (
    <Dialog open={isOpen && modalType === 'editChannel'} onOpenChange={handleClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>Edit Channel</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-8 px-6'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                      Channel name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                        placeholder='Enter channel name'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edit Type</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={e => {
                        console.log(e);
                        field.onChange(e);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none'>
                          <SelectValue placeholder='Select a channel type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(ChannelTypeEnum).map(type => (
                          <SelectItem key={type} value={type} className='capitalize'>
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className='bg-gray-100 px-6 py-4'>
              <Button variant='primary' disabled={isLoading}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditChannelModal;