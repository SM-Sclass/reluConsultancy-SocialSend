import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase/config';
import CampaignLogo from '../assets/campaign.svg';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { createCampaign } from '@/pages/View/Campaigns/Service/Campaign.service';

const campaignSchema = z.object({
  campaign_name: z.string().min(3, 'Enter at least 3 characters'),
})

const CreateCampaign = ({ close }) => {
  const user = auth.currentUser
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      campaignName: '',
    }
  })

  const newCampaignMutation = useMutation({
    mutationFn:createCampaign,
    onSuccess: (result) => {
      navigate("/Campaigns/newCampaign")
      close()
    },
    onError: (error) => {
      console.error(error)
    }
  })


  console.log(user)

  const onSubmit = async (data) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      // const userDoc = await getDoc(userRef);
      // if(!userDoc.exists() && !userDoc?.data()?.user_id) {
      //   toast.error('Authorization error. Please try again later.')
      //   return;
      // }
      // data.user_id = userDoc.data().user_id
      toast.promise(newCampaignMutation.mutateAsync({
        // user_id: user.uid,
        user_id: "67dbcd214597acae7bdf3f6c",
        campaign_name: data.campaign_name
      }), {
        loading: 'Creating campaign...',
        success: 'Campaign created successfully',
        error: 'Failed to create campaign'
      })
    } catch (error) {
      console.error(error)
    }
  }

  // const onSubmit = async (data) => {
  //   try {
  //     const userRef = doc(db, 'users', user.uid);
  //     const userDoc = await getDoc(userRef);
  //     if(!userDoc.exists() && !userDoc?.data()?.user_id) {
  //       toast.error('Authorization error. Please try again later.')
  //       return;
  //     }
  //     data.user_id = userDoc.data().user_id
  //     toast.promise(newCampaignMutation.mutateAsync(data), {
  //       loading: 'Creating campaign...',
  //       success: 'Campaign created successfully',
  //       error: 'Failed to create campaign'
  //     })
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  return (
    <div className="w-full p-4">
      <div className="flex items-start mb-8">
        <Button
        variant="ghost"
          className="flex items-center text-blue-600 font-medium"
          onClick={close}
          // onClick={navigate("/Campaigns")}
        >
          <ArrowLeft className="w-5 h-5" />
          Go Back
        </Button>
      </div>
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <img src={CampaignLogo} alt="Campaigns" width={40} height={40} />
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Let's create a new campaign!</h1>
          <p className="text-gray-600 text-start">What would you like to name it?</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="campaign_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Test Campaign"
                      className="h-10"
                    />
                  </FormControl>
                  <FormMessage className="text-start" />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Button
                variant="outline"
                className="py-3 px-4 border h-10 border-gray-300 rounded-md text-primary font-medium hover:bg-muted"
                onClick={close}
              >
                Cancel
              </Button>
              <Button
                className="py-3 px-4 h-10 bg-indigo-500 text-white rounded-md font-medium hover:bg-indigo-600"
              >
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateCampaign;