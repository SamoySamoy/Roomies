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
import { useRegisterMutation } from '@/hooks/mutations';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const RegisterPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useLoginForm();
  const mutation = useRegisterMutation();
  const isLoading = form.formState.isSubmitting || mutation.isPending;

  const onSubmit = async (values: LoginSchema) => {
    mutation.mutate(values, {
      onSuccess: () => {
        toast({
          title: 'Register ok',
        });
        navigate('/login');
      },
      onError: () => {
        toast({
          title: 'Register failed',
        });
      },
    });
  };

  return (
    <Form {...form}>
      <Link to='/login'>To Login</Link>
      <p>Register</p>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='email' {...field} disabled={isLoading} />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder='password' {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' variant='primary' disabled={isLoading}>
          Create
        </Button>
      </form>
    </Form>
  );
};

export default RegisterPage;
