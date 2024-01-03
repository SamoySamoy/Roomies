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
import { useResetMutation } from '@/hooks/mutations';
import { ResetSchema, useResetForm } from '@/hooks/forms';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';

const ResetPage = () => {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useResetForm();
  const mutation = useResetMutation();
  const isLoading = form.formState.isSubmitting || mutation.isPending;

  const clearForm = () => {
    form.reset();
    mutation.reset();
  };

  const onSubmit = async (values: ResetSchema) => {
    const { confirmPassword, password } = form.getValues();
    if (password !== confirmPassword) {
      return form.setError('confirmPassword', {
        message: 'Confirm password not match',
      });
    }

    mutation.mutate(
      { token: token!, ...values },
      {
        onSuccess: () => {
          toast({
            title: 'Reset password success',
            variant: 'success',
          });
          navigate('/login');
        },
        onError: () => {
          toast({
            title: 'Reset password failed',
            variant: 'error',
          });
        },
        onSettled: () => {
          clearForm();
        },
      },
    );
  };

  return (
    <Dialog open>
      <DialogContent className='overflow-hidden bg-white p-0 text-black'>
        <DialogHeader className='px-6 pt-8'>
          <DialogTitle className='text-center text-2xl font-bold'>Reset your password</DialogTitle>
          <DialogDescription className='text-left text-zinc-500'>
            Provide new password for your profile. New password will be activated immediately
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-4 px-6'>
              <div className='flex flex-row gap-2'>
                <div className='flex-1'>
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type='password'
                            placeholder='New password'
                            autoComplete='current-password'
                            disabled={isLoading}
                            className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className='flex flex-row gap-2'>
                <div className='flex-1'>
                  <FormField
                    control={form.control}
                    name='confirmPassword'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                          Confirm password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type='password'
                            placeholder='Confirm your new password'
                            autoComplete='current-password'
                            disabled={isLoading}
                            className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
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
            <DialogFooter className='bg-gray-100 px-6 py-4 flex sm:items-center sm:justify-between'>
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

export default ResetPage;
