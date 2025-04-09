import { auth, db } from "@/lib/firebase/config";
import { deleteCampaign } from "@/pages/View/Campaigns/Service/Campaign.service";
import { doc, getDoc } from "@firebase/firestore";
import { DialogPanel } from "@headlessui/react";
import { Dialog } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const DeleteModal = ({
  openDeleteModal,
  setOpenDeleteModal,
  selectedRowData,
  setSelectedRowData,
  getCampaigns
}) => {

    const user = auth.currentUser;
    const navigate = useNavigate();

    const newCampaignMutation = useMutation({
        mutationFn: deleteCampaign,
        onSuccess: (result) => {
          console.log('i am inside success section', undefined);
          
          getCampaigns();
          navigate("/Campaigns");
          setSelectedRowData(null)
          setOpenEditModal(false);
        //   close();
        },
        onError: (error) => {
          console.error(error);
        },
      });

    const handleDelete = async (data) => {
      console.log(selectedRowData)
      try {
        toast.promise(
          newCampaignMutation.mutateAsync({
            campaign_id: selectedRowData
          }),
          {
            loading: "Deleting campaign...",
            success: "Campaign deleted successfully",
            error: "Failed to delete campaign",
          }
        )
      } catch (error) {
        console.error(error);
      }
    }
    
  


  return (
    <>
      <Dialog
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        className="relative z-50"
      >
        <div className="fixed z-50 inset-0 bg-black/50 flex w-screen items-center justify-center p-4">
          <div className="max-w-lg space-y-4 border rounded-md bg-white p-12 ">
            <div>
              <div className="h-[50px] w-[300px] rounded-md">
                <p className="font-semibold text-md">
                  Are you sure want to delete the data ?
                </p>
                <div className="flex gap-2 mt-5 justify-end">
                  <button
                    onClick={() => setOpenDeleteModal(false)}
                    variant="outline"
                    className="bg-red-200 py-2 px-5 rounded-md cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setOpenDeleteModal(false);
                      handleDelete(selectedRowData);
                    }}
                    className="bg-red-200 py-2 px-5 rounded-md cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default DeleteModal;
