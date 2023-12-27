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
import { GroupType } from '@/lib/types';
import { useModal } from '@/hooks/useModal';
import { CreateGroupSchema, useCreateGroupForm } from '@/hooks/forms';
import { useUpdateGroupMutation } from '@/hooks/mutations';
import { useParams } from 'react-router-dom';

const EditGroupModal = () => {
  const {
    isOpen,
    modalType,
    closeModal,
    data: { room, groupType },
  } = useModal();
  const { groupId } = useParams<{ groupId: string }>();
  const form = useCreateGroupForm();
  const mutation = useUpdateGroupMutation();
  const onSubmit = async (values: CreateGroupSchema) => {
    mutation.mutate(
      {
        ...values,
        groupId: groupId!,
      },
      {
        onSettled: () => {
          form.reset();
          mutation.reset();
        },
      },
    );
  };
  const isLoading = form.formState.isSubmitting || mutation.isPending;

  const handleClose = () => {
    form.reset();
    mutation.reset();
    closeModal();
  };

  return (
    <Dialog open={isOpen && modalType === 'createGroup'} onOpenChange={handleClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>Edit Group</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-8 px-6'>
              <FormField
                control={form.control}
                name='groupName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                      Group name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                        placeholder='Enter group name'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='groupType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Type</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className='bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none'>
                          <SelectValue placeholder='Select a group type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(GroupType).map(type => (
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

export default EditGroupModal;
