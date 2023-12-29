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
import { LockClosedIcon } from '@heroicons/react/24/solid';
import bg from '@/assets/bg.jpg'

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
        toast({
          title: 'Login ok',
        });
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
      <div style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
      }}
        className='h-full'>
      <div className="flex justify-center mt-5 py-12">
        <div className="w-full shadow-md py-12 px-4 sm:px-6 lg:px-8  max-w-md space-y-8 blur-bg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in
            </h2>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-6">
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='email' className="shad-input" {...field} disabled={isLoading} />
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
                  <FormLabel className="shad-form_label">Password</FormLabel>
                  <FormControl>
                    <Input placeholder='password' className="shad-input" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <div className="flex">
              <div className="text-sm ml-auto">
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              type='submit' variant='primary' disabled={isLoading}
            >
              <LockClosedIcon className="absolute w-7 h-7 opacity-40 inset-y-1 left-0 flex items-center pl-3" />
              Log in
            </Button>

            <p className="text-small-regular text-light-2 text-center mt-2">
              <Link
                to='/register'
                className=" text-blue-600 hover:text-blue-500">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
      </div>
    </Form>
  );
};

export default LoginPage;
