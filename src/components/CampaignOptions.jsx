import { auth, db } from "@/lib/firebase/config";
import {
  createOptions,
  getCampaignOptions,
} from "@/pages/View/Campaigns/Service/Campaign.service";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, getDoc } from "@firebase/firestore";

function CampaignOptions() {
  const [accountAdded, setAccountAdded] = useState(false);
  const [accountValue, setAccountValue] = useState("");
  const [stopOnReply, setStopOnReply] = useState(false);
  const [trackOpens, setTrackOpens] = useState(false);
  const [linkTracking, setLinkTracking] = useState(false);
  const [disableOpenTracking, setDisableOpenTracking] = useState(false);
  const [textOnly, setTextOnly] = useState(false);
  const user = auth.currentUser;

  const { id } = useParams(); // Assuming you're using react-router-dom for routing
  const navigate = useNavigate(); // Assuming you're using react-router-dom for navigation

  const newOptionsMutation = useMutation({
    mutationFn: createOptions,
    onSuccess: () => {
      toast.success("Options saved successfully!");
      navigate(`/Campaigns`); // Redirect to the campaign page after saving options
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const formSchema = z.object({
    social_account: z
      .array(z.string())
      .min(1, "Please add at least one account"),
    message_on_reply_flag: z.boolean().optional(),
  });

  const onSubmit = async () => {
    if (!accountValue) {
      return toast.error("Please add at least one account.");
    }
    try {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists() && !userDoc.data().user_id) {
        toast.error("Authorization error. Please try again later.");
        return;
      }
      // data.user_id = userDoc.data().user_id;
      toast.promise(
        newOptionsMutation.mutateAsync({
          campaign_id: id,
          user_id: userDoc.data().user_id,
          social_accounts: accountValue.split(","),
          message_on_reply_flag: stopOnReply,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const GetDefaultData = async () => {
    const data = await getCampaignOptions(id);
    if (data?.social_accounts?.length > 0) {
      setAccountValue(data?.social_accounts.join(", "));
    }
  };

  useEffect(() => {
    GetDefaultData();
  }, []);

  return (
    <div className="w-full p-4 = rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Section */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-medium mb-4">Account to use</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={accountValue}
              onChange={(e) => setAccountValue(e.target.value)}
              placeholder="Add at least 1 account"
              className="flex-grow p-2 border rounded-md"
            />

            {/* {!accountAdded ? (
                  <>
                    <input
                      type="text"
                      placeholder="Add at least 1 account"
                      className="flex-grow p-2 border rounded-md"
                    />
                    <button className="text-blue-600 font-medium">
                      Add Account
                    </button>
                  </>
                ) : (
                  <div className="flex justify-between w-full">
                    <span>account@example.com</span>
                    <button className="text-red-500">Remove</button>
                  </div>
                )} */}
          </div>
        </div>

        {/* Stop Sending Message Section */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-medium mb-4">
            Stop sending message on reply
          </h2>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Stop sending message to a lead if a reply has received
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={stopOnReply}
                onChange={() => setStopOnReply(!stopOnReply)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
        </div>

        {/* Open Tracking Section */}
        <div className="border rounded-lg p-4 hidden">
          <h2 className="text-lg font-medium mb-4">Open tracking</h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Track message opens</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={trackOpens}
                  onChange={() => setTrackOpens(!trackOpens)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Link tracking</span>
              <input
                type="checkbox"
                checked={linkTracking}
                onChange={() => setLinkTracking(!linkTracking)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Delivery Optimization Section */}
        <div className="border rounded-lg p-4 hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Delivery Optimization</h2>
            <span className="text-xs px-2 py-1 bg-pink-100 text-pink-500 rounded">
              Recommended
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">Disable open tracking</span>
              <input
                type="checkbox"
                checked={disableOpenTracking}
                onChange={() => setDisableOpenTracking(!disableOpenTracking)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">
                Send messages as text-only (no HTML)
              </span>
              <input
                type="checkbox"
                checked={textOnly}
                onChange={() => setTextOnly(!textOnly)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex justify-end mt-8 gap-4">
        <button
          onClick={() => onSubmit()}
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Save
        </button>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Launch
        </button>
      </div>
    </div>
  );
}

export default CampaignOptions;
