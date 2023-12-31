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
import { LoginSchema, useLoginForm } from '@/hooks/forms';
import { useLoginMutation } from '@/hooks/mutations';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Lock } from 'lucide-react';
import bg from '@/assets/bg.jpg';

const LoginPage = () => {
  const { setAuth } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useLoginForm();
  const mutation = useLoginMutation();
  const isLoading = form.formState.isSubmitting || mutation.isPending;

  const onSubmit = async (values: LoginSchema) => {
    mutation.mutate(values, {
      onSuccess: data => {
        setAuth(data.accessToken);
        // toast({
        //   title: 'Login ok',
        // });
      },
      onError: () => {
        toast({
          title: 'Login failed',
        });
      },
    });
  };

  return (
    <Form {...form}>
      <div
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
        }}
        className='h-full'
      >
        <div className='flex justify-center pt-20'>
          <div className='w-full shadow-md py-12 px-4 sm:px-6 lg:px-8  max-w-md space-y-8 blur-bg'>
            <div>
              <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-emerald-400'>
                Login
              </h2>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className='mt-8 space-y-6'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-white'>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Email'
                        className='shad-input'
                        {...field}
                        disabled={isLoading}
                        autoComplete='email'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='shad-form_label text-white'>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Password'
                        className='shad-input'
                        {...field}
                        disabled={isLoading}
                        autoComplete='current-password'
                        type='password'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex items-center justify-between'>
                <Link to='/' className='text-sm font-medium text-slate-200 hover:text-indigo-400'>
                  To landing page
                </Link>
                <Link
                  to='/forgot'
                  className='text-sm font-medium text-slate-200 hover:text-indigo-400'
                >
                  Forgot your password?
                </Link>
              </div>

              <Button
                className='group relative flex w-full justify-center rounded-md border border-transparent bg-emerald-400 py-2 px-4 text-sm font-medium text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2'
                type='submit'
                variant='primary'
                disabled={isLoading}
              >
                <Lock className='absolute w-7 h-7 opacity-40 inset-y-1 left-0 flex items-center pl-3' />
                Submit
              </Button>

              <Link to='/register'>
                <p className='text-lg text-center mt-4 text-slate-200 hover:text-indigo-400 hover:scale-110 transition-all duration-300'>
                  Create an account?
                </p>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default LoginPage;
