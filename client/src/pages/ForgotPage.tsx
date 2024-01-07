import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useForgotMutation } from '@/hooks/mutations';
import { ForgotSchema, useForgotForm } from '@/hooks/forms';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForgotForm();
  const mutation = useForgotMutation();
  const isLoading = form.formState.isSubmitting || mutation.isPending;

  const clearForm = () => {
    form.reset();
    mutation.reset();
  };

  const onSubmit = async (values: ForgotSchema) => {
    mutation.mutate(values, {
      onSuccess: () => {
        toast({
          description:
            'An reset password mail already sent to your email address room successfully',
          variant: 'success',
        });
        navigate('/my-rooms');
      },
      onError: () => {
        toast({
          description: 'Forgot password failed',
          variant: 'error',
        });
      },
      onSettled: () => {
        clearForm();
      },
    });
  };

  return (
    <Dialog open>
      <DialogContent className='overflow-hidden bg-white p-0 text-black dark:bg-zinc-900 dark:text-white'>
        <DialogHeader className='px-6 pt-8'>
          <DialogTitle className='text-center text-2xl font-bold'>
            Forgot your password?
          </DialogTitle>
          <DialogDescription className='text-left text-zinc-500 dark:text-zinc-400'>
            Don't worry, you can provide your registered infomation. An reset password mail will be
            sent to your email addresss
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-4 px-6'>
              <div className='flex flex-row gap-2'>
                <div className='flex-1'>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-white'>
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Your email address'
                            autoComplete='email'
                            disabled={isLoading}
                            className='border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-zinc-300/50 text-black dark:bg-black dark:text-white'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <DialogFooter className='bg-gray-100 dark:bg-zinc-800 px-6 py-4 flex sm:items-center sm:justify-between'>
              <div className='flex items-center justify-between sm:justify-start'>
                <Link to={'/'}>
                  <Button type='button' variant='link'>
                    To landing page
                  </Button>
                </Link>
                <Link to={'/login'}>
                  <Button type='button' variant='link'>
                    To login page
                  </Button>
                </Link>
              </div>
              <Button type='submit' variant='primary' disabled={isLoading}>
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPage;
