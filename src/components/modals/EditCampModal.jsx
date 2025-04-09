import { auth, db } from "@/lib/firebase/config";
import {
  createCampaign,
  deleteCampaign,
  editCampaign,
} from "@/pages/View/Campaigns/Service/Campaign.service";
import { doc, getDoc } from "@firebase/firestore";
import { DialogPanel } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const campaignSchema = z.object({
  campaign_name: z.string().min(3, "Enter at least 3 characters"),
});

const EditCampModal = ({
  openEditModal,
  setOpenEditModal,
  selectedRowData,
  getCampaigns,
  setSelectedRowData,
}) => {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      campaignName: "",
    },
  });

  const newCampaignMutation = useMutation({
    mutationFn: editCampaign,
    onSuccess: (result) => {
      getCampaigns();
      navigate("/Campaigns");
      setSelectedRowData(null);
      setOpenEditModal(false);
      //   close();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit = async (data) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists() && !userDoc.data().user_id) {
        toast.error("Authorization error. Please try again later.");
        return;
      }
      data.user_id = userDoc.data().user_id;
      toast.promise(
        newCampaignMutation.mutateAsync({
          user_id: userDoc.data().user_id,
          campaign_name: data.campaign_name,
          campaign_id: selectedRowData?._id,
        }),
        {
          loading: "Updating campaign...",
          success: "Campaign Updated successfully",
          error: "Failed to update campaign",
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedRowData) {
      form.reset({
        campaign_name: selectedRowData.name || "",
      });
    }
  }, [selectedRowData, form]);

  return (
    <>
      <Dialog
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        className="relative z-50"
      >
        <div className="fixed z-50 inset-0 bg-black/50 flex w-screen items-center justify-center p-4">
          <div className="max-w-lg space-y-4 border rounded-md bg-white p-12 ">
            <div>
              <div className="h-[150px] w-[300px] rounded-md">
                <p className="font-semibold text-md mb-7">Edit Campaign</p>
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
                              placeholder={selectedRowData?.name}
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
                        onClick={() => {
                          setOpenEditModal(false);
                          setSelectedRowData(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button className="py-3 px-4 h-10 bg-indigo-500 text-white rounded-md font-medium hover:bg-indigo-600">
                        Continue
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default EditCampModal;
