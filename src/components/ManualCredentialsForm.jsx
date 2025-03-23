import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from "lucide-react";
import { doc, getDoc } from 'firebase/firestore'
import toast from 'react-hot-toast'
import { addSocialAccount } from '@/pages/View/Social-Accounts/Service/SocialAccount.service';
import { auth, db } from '@/lib/firebase/config';
import { Form, FormField, FormLabel, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const credentialsSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long").nonempty(),
  password: z.string().nonempty(),
})

export default function ManualCredentialsForm({ platform, close }) {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const user = auth.currentUser
  
  const form = useForm({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const socialAccountMutation = useMutation({
    mutationFn: addSocialAccount,
    onSuccess: (result) => {
      setTimeout(() => {
        console.log("result")
      },3000)
    },
    onError: (error) => {
      console.error('Error fetching filtered users:', error);
    }
  });

  const onSubmit = async (data) => {
    try {
      data.platform = platform
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists() || !userDoc.data().user_id) {
        return;
      }
      data.user_id = userDoc.data().user_id

      console.log(data)
      toast.promise(socialAccountMutation.mutateAsync(data), {
        loading: 'Adding social account...',
        success: 'Social account added successfully!',
        error: 'An error occurred while adding social account'
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="bg-background rounded-lg shadow-lg mx-auto w-80 sm:max-w-96 p-6 space-y-4">
      <p className='text-lg font-bold text-center'>Enter {platform} Credentials</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter username"
                  />
                </FormControl>
                <FormMessage className="text-start" />
              </FormItem>
            )}
          />
          <FormField
            contorl={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter password"
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-1 top-5 text-primary bg-transparent hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </Button>
                <FormMessage className="text-start" />
              </FormItem>
            )}
          />
          <div className='flex items-center justify-end space-x-3'>
            <Button
              type="button"
              onClick={close}
              variant="ghost"
              disabled={socialAccountMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700"
              disabled={socialAccountMutation.isPending}
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}