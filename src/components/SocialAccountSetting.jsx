import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import toast from 'react-hot-toast'
import { auth, db } from '@/lib/firebase/config';
import { sendTemplateMessage } from '@/pages/View/Social-Accounts/Service/SocialAccount.service';
import { Form, FormField, FormLabel, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button';
import { getTemplateMessage } from '@/pages/View/Social-Accounts/Service/SocialAccount.service';

const templateMessageSchema = z.object({
  first_name: z.string().nonempty(),
  last_name: z.string().nonempty(),
  message: z.string().nonempty(),
  follow_limit: z.number().default(0),
  like_limit: z.number().default(0),
  dm_limit: z.number().default(0),
})

function SocialAccountSetting({ onClose, data, isPending }) {
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(templateMessageSchema),
    defaultValues: {
      first_name: data?.first_name || '',
      last_name: data?.last_name || '',
      message: data?.campaign_message || '',
      follow_limit: data?.daily_connections || 0,
      like_limit: data?.daily_likes || 0,
      dm_limit: data?.daily_messages || 0,
      comment_limit : data?.daily_comments || 1,
    }
  })

  const socialAccountSettingMutation = useMutation({
    mutationFn: sendTemplateMessage,
    onSuccess: (result) => {
      // setTimeout(() => {
      //   console.log("result")
      // }, 3000)
      queryClient.invalidateQueries({ queryKey: ['TemplateMessage'] })
    },
    onError: (error) => {
      console.error('Error fetching filtered users:', error);
    }
  });

  const onSubmit = async (data) => {
    try {
      data.social_account_id = "67b878d7ee1dfdb84e89c55f"
      // console.log(data)
      toast.promise(socialAccountSettingMutation.mutateAsync(data), {
        loading: 'Updating Template setting...',
        success: 'Template Updated successfully!',
        error: 'An error occurred while updating Template'
      })

    } catch (error) {
      console.error('Error fetching filtered users:', error);
    }
  }

  return (
    <div className='h-[calc(100vh-250px)]'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-7'>
          <div className='flex flex-col space-y-2'>
            <h2 className='text-start font-semibold'>Sender Message</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        value={ field.value}
                        onChange={field.onChange}
                        placeholder="First Name"
                      />
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Last Name"
                      />
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sender Message & Signature</FormLabel>
                <FormControl>
                  <Textarea
                    rows={9}
                    value={ field.value}
                    onChange={field.onChange}
                    placeholder="Type your message here..."
                  />
                </FormControl>
                <FormMessage className="text-start" />
              </FormItem>
            )}
          />
          <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3'>
            <FormField
              control={form.control}
              name="follow_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex flex-col items-start justify-center">
                    <span className='text-start text-sm'>Daily Friend Request Limit</span>
                    <span className='text-start text-xs'>Recommended Limit is 30</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value))
                      }
                      placeholder="Request Limit"
                    />
                  </FormControl>
                  <FormMessage className="text-start" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="like_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex flex-col items-start justify-center">
                    <span className='text-start text-sm'>Daily Liked Post Limit</span>
                    <span className='text-start text-xs'>Recommended Limit is 30</span>

                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value))
                      }
                      placeholder="Like Limit"
                    />
                  </FormControl>
                  <FormMessage className="text-start" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dm_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex flex-col items-start justify-center">
                    <span className='text-start text-sm'>Daily Direct Message Limit</span>
                    <span className='text-start text-xs'>Recommended Limit is 30</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value))
                      }
                      placeholder="DM Limit"
                    />
                  </FormControl>
                  <FormMessage className="text-start" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex flex-col items-start justify-center">
                    <span className='text-start text-sm'>Daily Direct Comment Limit</span>
                    <span className='text-start text-xs'>Recommended Limit is 30</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value))
                      }
                      placeholder="DComment Limit"
                    />
                  </FormControl>
                  <FormMessage className="text-start" />
                </FormItem>
              )}
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex justify-end gap-2 p-4 border-t bg-background">
            <Button
              onClick={onClose}
              variant="outline"
              className="px-4 py-2 text-primary rounded"
              disabled={isPending}
            >
              DISCARD
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded"
              disabled={isPending}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default SocialAccountSetting