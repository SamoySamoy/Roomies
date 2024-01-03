import { useEffect, useState } from 'react';
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
import FileUploadZone, { FileUpload } from '@/components/FileUploadZone';
import { useModal } from '@/hooks/useModal';
import { ChangeProfilePasswordSchema, useChangeProfilePasswordForm } from '@/hooks/forms';
import {
  useUploadProfileImageMutation,
  useChangeProfilePasswordMutation,
  useDeleteProfileImageMutation,
} from '@/hooks/mutations';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Check } from 'lucide-react';
import { Badge } from '../ui/badge';

const ProfileModal = () => {
  const { isOpen, modalType, closeModal } = useModal();
  const { toast } = useToast();
  const { auth } = useAuth();

  const imageMutation = useUploadProfileImageMutation();
  const deleteImageMutation = useDeleteProfileImageMutation();
  const passwordForm = useChangeProfilePasswordForm();
  const passwordMutation = useChangeProfilePasswordMutation();

  const defaultImage: FileUpload | null = auth.imageUrl
    ? { type: 'online', fileUrl: auth.imageUrl }
    : null;
  const [profileImage, setProfileImage] = useState<FileUpload | null>(defaultImage);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const isLoading =
    imageMutation.isPending || passwordForm.formState.isSubmitting || passwordMutation.isPending;

  const isNoProfileImageChange = defaultImage && !profileImage; // Xóa ảnh cũ và không để image
  const isUpdateProfileImageChange =
    defaultImage && profileImage && defaultImage.type !== profileImage.type; // Xóa ảnh cũ và thay ảnh mới
  const isNewProfileImageChange =
    !defaultImage && profileImage !== null && profileImage.type === 'offline'; // Ban đầu không có ảnh và đã set ảnh mới

  const isImageChanged =
    isNoProfileImageChange || isUpdateProfileImageChange || isNewProfileImageChange;

  const clearImageForm = () => {
    imageMutation.reset();
  };

  const clearPasswordForm = () => {
    passwordForm.reset();
    passwordMutation.reset();
  };

  const onChangePassword = async (values: ChangeProfilePasswordSchema) => {
    const { confirmNewPassword, newPassword } = passwordForm.getValues();
    if (confirmNewPassword !== newPassword) {
      return passwordForm.setError('confirmNewPassword', {
        message: 'Confirm new password not match',
      });
    }

    passwordMutation.mutate(values, {
      onSuccess: () => {
        toast({
          title: 'Change password successfully',
          variant: 'success',
        });
        setIsChangingPassword(false);
      },
      onError: () => {
        toast({
          title: 'Change password failed',
          variant: 'error',
        });
      },
      onSettled: () => {
        clearPasswordForm();
      },
    });
  };

  const onImageChange = async () => {
    if (isNoProfileImageChange) {
      deleteImageMutation.mutate(undefined, {
        onSuccess: () => {
          toast({
            title: 'Delete profile image successfully',
            variant: 'success',
          });
        },
        onError: () => {
          toast({
            title: 'Delete profile image failed',
            variant: 'error',
          });
        },
        onSettled: () => {
          clearImageForm();
        },
      });
      return;
    }
    const formData = new FormData();
    if (profileImage && profileImage.type === 'offline') {
      formData.append('profileImage', profileImage.file);
    }
    imageMutation.mutate(formData, {
      onSuccess: () => {
        toast({
          title: 'Change profile image successfully',
          variant: 'success',
        });
      },
      onError: () => {
        toast({
          title: 'Change profile image failed',
          variant: 'error',
        });
      },
      onSettled: () => {
        clearImageForm();
      },
    });
  };

  useEffect(() => {
    setProfileImage(auth.imageUrl ? { type: 'online', fileUrl: auth.imageUrl } : null);
  }, [auth.imageUrl]);

  return (
    <Dialog
      open={isOpen && modalType === 'profile'}
      onOpenChange={() => {
        closeModal();
        clearImageForm();
      }}
    >
      <DialogContent className='overflow-hidden bg-white p-0 text-black'>
        <DialogHeader className='px-6 pt-8'>
          <DialogTitle className='text-center text-2xl font-bold'>Profile</DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Customize your personal profile
          </DialogDescription>
        </DialogHeader>
        <div className='flex items-center justify-center'>
          <FileUploadZone
            onChange={setProfileImage}
            value={profileImage}
            accept={{
              'image/*': [],
            }}
          />
        </div>
        <Form {...passwordForm}>
          <form className='space-y-8' onSubmit={passwordForm.handleSubmit(onChangePassword)}>
            <div className='space-y-4 px-6'>
              <FormField
                name=''
                render={() => (
                  <FormItem>
                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                      Email
                    </FormLabel>
                    <div className='flex items-center justify-between'>
                      <p className='text-black text-md font-bold'>{auth.email}</p>
                      <Badge
                        variant={'public'}
                        className='font-bold text-xs flex items-center gap-x-1 py-1 px-2'
                      >
                        Verified
                        <Check className='text-white w-4 h-4 stroke-[3]' />
                      </Badge>
                    </div>
                  </FormItem>
                )}
              />

              {isChangingPassword && (
                <FormField
                  control={passwordForm.control}
                  name='currentPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                        Current Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='Current Password'
                          autoComplete='current-password'
                          className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {isChangingPassword && (
                <FormField
                  control={passwordForm.control}
                  name='newPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                        New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='New Password'
                          autoComplete='new-password'
                          className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {isChangingPassword && (
                <FormField
                  control={passwordForm.control}
                  name='confirmNewPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                        Confirm New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='Confirm New Password'
                          autoComplete='confirm-password'
                          className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <DialogFooter className='bg-gray-100 px-6 py-4'>
              {isImageChanged && (
                <Button
                  disabled={isLoading}
                  type='button'
                  variant={isNoProfileImageChange ? 'destructive' : 'primary'}
                  onClick={onImageChange}
                >
                  {isNoProfileImageChange && 'Delete Avatar'}
                  {isUpdateProfileImageChange && 'Update Avatar'}
                  {isNewProfileImageChange && 'Upload Avatar'}
                </Button>
              )}
              {!isImageChanged && !isChangingPassword && (
                <Button
                  disabled={isLoading}
                  type='button'
                  variant='primary'
                  onClick={() => setIsChangingPassword(true)}
                >
                  Change Password
                </Button>
              )}
              {isChangingPassword && (
                <div className='flex items-center gap-x-2'>
                  <Button
                    disabled={isLoading}
                    type='button'
                    variant='destructive'
                    onClick={() => {
                      clearPasswordForm();
                      setIsChangingPassword(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button disabled={isLoading} type='submit' variant='primary'>
                    Submit
                  </Button>
                </div>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
