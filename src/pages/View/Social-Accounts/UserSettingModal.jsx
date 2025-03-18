import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { userArray } from "../../../Data/Users";
import { fetchSocialAccountStatistics, sendTemplateMessage } from "./Service/SocialAccount.service";

const UserSettingsModal = ({ username, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("Warmup");
  const [isAnimating, setIsAnimating] = useState(false);
  const isGlowDoggies = username === "glow.doggies";

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const chartData = [
    { day: "Mon", sent: 35 },
    { day: "Tue", sent: 28 },
    { day: "Wed", sent: 25 },
    { day: "Thu", sent: 32 },
    { day: "Fri", sent: 30 },
    { day: "Sat", sent: 27 },
    { day: "Sun", sent: 35 },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="text-sm">{`${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const TABS = {
    Warmup: {
      id: "Warmup",
      content: () => <WarmupContent chartData={chartData} CustomTooltip={CustomTooltip} username={username} />,
    },
    Settings: {
      id: "Settings",
      content: () => <SettingsContent username={username} onClose={onClose} />,
    },
    Statistics: {
      id: "Statistics",
      content: () => <StatisticsContent
        isGlowDoggies={isGlowDoggies}
        CustomTooltip={CustomTooltip}
      />,
    },
  };

  if (!isOpen && !isAnimating) return null;

  const handleTransitionEnd = () => {
    if (!isOpen) {
      setIsAnimating(false);
    }
  };

  const TabButton = ({ tabId }) => (
    <button
      className={`px-6 py-3 ${activeTab === tabId
          ? "border-b-2 border-blue-500 text-blue-500"
          : "text-primary"
        }`}
      onClick={() => setActiveTab(tabId)}
    >
      {tabId}
    </button>
  );

  const renderContent = () => {
    const TabContent = TABS[activeTab]?.content;
    return TabContent ? <TabContent /> : <div>Something went wrong</div>;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${isOpen ? "bg-opacity-10" : "bg-opacity-50 pointer-events-none"
          }`}
        onClick={onClose}
      />

      <div
        className={`w-1/2 bg-muted h-full shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        onTransitionEnd={handleTransitionEnd}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{username}</h2>
          <button onClick={onClose} className="text-primary hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b">
          {Object.keys(TABS).map((tabId) => (
            <TabButton key={tabId} tabId={tabId} />
          ))}
        </div>

        <div className="p-6 h-[calc(100vh-200px)] overflow-y-auto">
          {renderContent()}
        </div>

      </div>
    </div>
  );
};

const WarmupContent = ({ username }) => {
  const [loading, setLoading] = useState(true);
  const currentUser = userArray.find(user => user.username === username);
  const [warmupStatus, setWarmupStatus] = useState(currentUser?.warmupEnabled || false);
  const isGlowDoggies = username === "glow.doggies";

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const glowDoggiesData = {
    summary: {
      received: 0,
      sent: 2,
      spam: 0
    },
    chartData: [
      { date: "2025-01-13", value: 1 },
      { date: "2025-01-14", value: 1 },
      { date: "2025-01-15", value: 0 }
    ]
  };

  const updateWarmupStatus = (status) => {
    const userIndex = userArray.findIndex(user => user.username === username);
    if (userIndex !== -1) {
      userArray[userIndex].warmupEnabled = status;
      setWarmupStatus(status);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="text-sm">{`${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-300px)]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Started on Dec 06, 2024</span>
        </div>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 text-sm text-primary hover:bg-secondary rounded ${!warmupStatus && 'opacity-50 cursor-not-allowed'}`}
            onClick={() => updateWarmupStatus(false)}
            disabled={!warmupStatus}
          >
            Disable
          </button>
          <button
            className={`px-4 py-2 text-sm text-primary hover:bg-secondary rounded ${!warmupStatus && 'opacity-50 cursor-not-allowed'}`}
            onClick={() => updateWarmupStatus(false)}
            disabled={!warmupStatus}
          >
            Pause
          </button>
          <button
            className={`px-4 py-2 text-sm text-primary ${warmupStatus ? 'bg-neutral-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} rounded`}
            onClick={() => updateWarmupStatus(true)}
            disabled={warmupStatus}
          >
            Enable
          </button>
        </div>
      </div>

      {!isGlowDoggies && (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-400px)]">
          {warmupStatus ? (
            <div className="text-center">
              <p className="text-gray-600 text-lg font-medium">Warmup data will be available in 2 days</p>
              <p className="text-sm text-gray-500 mt-2">We're collecting your data</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 text-lg font-medium">Enable warmup to collect data</p>
              <p className="text-sm text-gray-500 mt-2">Turn on warmup to start collecting insights</p>
            </div>
          )}
        </div>
      )}

      {isGlowDoggies && (
        <>
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Summary for past week</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm">{glowDoggiesData.summary.received} warmup messages received</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">{glowDoggiesData.summary.sent} warmup messages sent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">{glowDoggiesData.summary.spam} saved from spam</span>
              </div>
            </div>
          </div>

          <div className="h-64">
            <h3 className="text-sm font-medium mb-4">Warmup Messages Sent</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={glowDoggiesData.chartData}>
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis ticks={[0, 1]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  fill={warmupStatus ? "#22c55e" : "#94a3b8"}
                  radius={[6, 6, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

const SettingsContent = ({ username, onClose }) => {
  // Find the specific user from userArray based on username
  const defaultUser = userArray.find(user => user.username === username) || userArray[0];

  const [formData, setFormData] = useState({
    first_name: defaultUser.settings.sendername.firstName,
    last_name: defaultUser.settings.sendername.lastname,
    message: defaultUser.settings.Sendermessage,
    follow_limit: defaultUser.settings.Daily_Friend_Request_Limit,
    like_limit: defaultUser.settings.Daily_Like_Limit,
    dm_limit: defaultUser.settings.Daily_Direct_Message_Limit,
    social_account_id: "67b878d7ee1dfdb84e89c55f",
  });

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    // Find and update the specific user in userArray
    // const userIndex = userArray.findIndex(user => user.username === username);
    // if (userIndex !== -1) {
    //   userArray[userIndex].settings = {
    //     ...userArray[userIndex].settings,
    //     sendername: {
    //       firstName: formData.firstName,
    //       lastname: formData.lastName
    //     },
    //     Sendermessage: formData.senderMessage,
    //     Daily_Friend_Request_Limit: Number(formData.friendRequestLimit),
    //     Daily_Like_Limit: Number(formData.likeLimit),
    //     Daily_Direct_Message_Limit: Number(formData.directMessageLimit)
    //   };
    // }
    // console.log('Settings saved for user:', username);
    formData.follow_limit = Number(formData.follow_limit);
    formData.like_limit = Number(formData.like_limit);
    formData.dm_limit = Number(formData.dm_limit);
    await sendTemplateMessage(formData)
  };

  if (!defaultUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">User settings not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-primary">Sender Name</h3>
        <div className="flex gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className="flex-1 p-2 border rounded border-primary"
            defaultValue={formData.first_name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className="flex-1 p-2 border rounded border-primary"
            defaultValue={formData.last_name}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="">
        <h3 className="text-sm font-medium text-primary">
          Sender Message & Signature
        </h3>
        <div className="border rounded-lg">
          <div className="flex gap-2 p-2 border-b">
            <button className="p-1 hover:bg-secondary rounded">
              <span className="font-bold">B</span>
            </button>
            <button className="p-1 hover:bg-secondary rounded">
              <span className="italic">I</span>
            </button>
            <button className="p-1 hover:bg-secondary rounded">
              <span className="underline">U</span>
            </button>
          </div>
          <textarea
            name="senderMessage"
            className="w-full p-2 min-h-[100px] resize-none border border-primary"
            defaultValue={formData.message}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-primary">Campaign Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-primary mb-1">
              Daily Friend Request Limit
            </label>
            <input
              type="number"
              name="friendRequestLimit"
              defaultValue={formData.follow_limit}
              onChange={handleInputChange}
              className="w-full p-2 border rounded border-primary"
            />
            <span className="text-xs text-primary">Recommended Limit is 30</span>
          </div>
          <div>
            <label className="block text-sm text-primary mb-1">
              Daily Like/Post Limit
            </label>
            <input
              type="number"
              name="likeLimit"
              defaultValue={formData.like_limit}
              onChange={handleInputChange}
              className="w-full p-2 border rounded border-primary"
            />
            <span className="text-xs text-primary">Recommended Limit is 30</span>
          </div>
          <div>
            <label className="block text-sm text-primary mb-1">
              Daily Direct Message Limit
            </label>
            <input
              type="number"
              name="dm_limit"
              defaultValue={formData.dm_limit}
              onChange={handleInputChange}
              className="w-full p-2 border rounded border-primary"
            />
            <span className="text-xs text-primary">Recommended Limit is 30</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex justify-end gap-2 p-4 border-t bg-secondary">
        <button
          onClick={onClose}
          className="px-4 py-2 text-primary hover:bg-gray-100 rounded"
        >
          DISCARD
        </button>
        <button className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>

  );
};

const StatisticsContent = ({ isGlowDoggies, CustomTooltip }) => {
  const { isPending, error, data } = useQuery({
    queryKey: ['SocialAccountStatistics'],
    queryFn: () => fetchSocialAccountStatistics(),
  })

  if (!isGlowDoggies) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-primary">Statistics will be available in 2 days</p>
          <p className="text-sm text-primary mt-2">We're collecting your data</p>
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-center">
        <div>
          <p className="text-red-500 font-medium">{error}</p>
          <p className="text-gray-500 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  // Function to check if the dataset is empty
  const isDataEmpty = (data) => {
    return !data || data.length === 0;
  };

  const StatChart = ({ data, title, color }) => {
    if (isDataEmpty(data)) {
      return (
        <div className="h-64 mb-8">
          <h3 className="text-sm font-medium mb-4">{title}</h3>
          <div className="flex items-center justify-center h-48 bg-gray-50 rounded border border-gray-200">
            <p className="text-gray-500">No data available</p>
          </div>
        </div>
      );
    }

    return (
      <div className="h-64 mb-8">
        <h3 className="text-sm font-medium mb-4">{title}</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis />
            <Tooltip
              content={<CustomTooltip />}
              formatter={(value) => [`${value}`, title.split(' ')[0]]}
            />
            <Bar
              dataKey="value"
              fill={color}
              radius={[6, 6, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <StatChart
        data={data.dmSent}
        title="Direct Messages Sent"
        color="#3b82f6"
      />
      <StatChart
        data={data.followsSent}
        title="Follows Sent"
        color="#22c55e"
      />
      <StatChart
        data={data.messagesSeen}
        title="Messages Seen"
        color="#eab308"
      />
      <StatChart
        data={data.likesDone}
        title="Likes Done"
        color="#ef4444"
      />
      <StatChart
        data={data.peopleReplied}
        title="People Replied"
        color="#8b5cf6"
      />
    </div>
  );
};

export default UserSettingsModal;