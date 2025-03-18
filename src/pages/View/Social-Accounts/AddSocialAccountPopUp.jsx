import React, { useState, useRef, useEffect } from "react";
import { userArray } from "../../../Data/Users";
import { defaultUserStructure } from "../../../Data/Users"

const AddSocialAccountPopup = ({ onClose }) => {
  const [showInstagramModal, setShowInstagramModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [credentialsSource, setCredentialsSource] = useState("");
  const [csvData, setCsvData] = useState(null);
  const fileInputRef = useRef(null);
  console.log(userArray)

  const downloadSampleCSV = () => {
    const csvContent = "username,password\nuser1,pass1\nuser2,pass2";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "sample_social_accounts.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Function to parse CSV content
  const parseCSV = (content) => {
    const lines = content.split("\n");
    const headers = lines[0].split(",");
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === "") continue;
      const values = lines[i].split(",");
      const entry = {};
      headers.forEach((header, index) => {
        entry[header.trim()] = values[index]?.trim();
      });
      data.push(entry);
    }

    return data;
  };

  // Function to handle CSV file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const parsedData = parseCSV(text);
        setCsvData(parsedData);
        console.log("CSV Data loaded:", parsedData);
      };
      reader.readAsText(file);
    }
  };

  // Function to handle drag and drop
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === "text/csv") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const parsedData = parseCSV(text);
        setCsvData(parsedData);
        console.log("CSV Data loaded:", parsedData);
      };
      reader.readAsText(file);
    }
  };

  const handlePlatformClick = (platformName) => {
    if (platformName === "Instagram") {
      setShowInstagramModal(true);
    }
  };

  const handleCsvCredentialsUse = () => {
    if (csvData && csvData.length > 0) {
      console.log("Using CSV credentials:", csvData);
      const usernames = csvData.map((entry) => entry.username);

      const newUsers = usernames.map((username) => ({
        ...defaultUserStructure(username),
        password: "",
      }));

      console.log("New users from CSV:", newUsers);

      userArray.push(...newUsers);
      const alertDiv = document.createElement('div');
      alertDiv.className = "bg-green-100 border-t border-b border-green-500 text-green-700 px-4 py-3 fixed top-4 right-4 z-50";
      alertDiv.innerHTML = `
        <p class="font-bold">Success!</p>
        <p class="text-sm">CSV credentials have been successfully stored.</p>
      `;
      document.body.appendChild(alertDiv);

      setTimeout(() => {
        alertDiv.remove();
      }, 3000);

      setShowInstagramModal(false);
    } else {
      alert("Please upload a CSV file first");
      setShowInstagramModal(false);
    }
  };


  const InstagramCredentialsModal = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 z-20">
      <div className="bg-secondary rounded-lg shadow-lg w-96 p-6">
        <h3 className="text-lg font-medium mb-4">Choose Credentials Source</h3>
        <div className="space-y-4">
          <button
            className="w-full p-3 border rounded-lg hover:bg-muted"
            onClick={() => {
              if (csvData) {
                handleCsvCredentialsUse();
              } else {
                alert("Please upload a CSV file first");
                setShowInstagramModal(false);
              }
            }}
          >
            Use credentials from CSV{" "}
            {csvData ? `(${csvData.length} accounts)` : ""}
          </button>
          <button
            className="w-full p-3 border rounded-lg hover:bg-muted"
            onClick={() => {
              setCredentialsSource("manual");
              setShowInstagramModal(false);
              setShowCredentialsModal(true);
            }}
          >
            Enter credentials manually
          </button>
        </div>
        <button
          className="mt-4 text-gray-500 hover:text-primary"
          onClick={() => setShowInstagramModal(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  const socialPlatforms = [
    {
      name: "Facebook",
      color: "bg-blue-600",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
        >
          <rect
            y="-0.00012207"
            width="80"
            height="80"
            rx="40"
            fill="url(#paint0_linear_2292_3387)"
          />
          <path
            d="M54.8014 50.4266L56.5743 38.8616H45.4799V31.3568C45.4799 28.194 47.0284 25.1106 51.9997 25.1106H57.0449V15.2665C57.0449 15.2665 52.4676 14.484 48.09 14.484C38.9518 14.484 32.9792 20.0216 32.9792 30.049V38.8616H22.8232V50.4266H32.9792V78.3801C35.0148 78.7002 37.1023 78.867 39.2309 78.867C41.3595 78.867 43.4443 78.7002 45.4826 78.3801V50.4266H54.8014Z"
            fill="white"
          />
          <defs>
            <linearGradient
              id="paint0_linear_2292_3387"
              x1="11.7141"
              y1="11.7873"
              x2="68.6272"
              y2="68.3561"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4676ED" />
              <stop offset="0.1854" stopColor="#436DE4" />
              <stop offset="0.487" stopColor="#3C55CD" />
              <stop offset="0.8651" stopColor="#302EA8" />
              <stop offset="1" stopColor="#2B1E99" />
            </linearGradient>
          </defs>
        </svg>
      ),
    },
    {
      name: "Instagram",
      color: "bg-pink-500",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="81"
          height="81"
          viewBox="0 0 81 81"
          fill="none"
        >
          <rect
            x="0.603516"
            y="0.619995"
            width="80"
            height="80"
            rx="40"
            fill="url(#paint0_linear_2292_3396)"
          />
          <path
            d="M53.5368 24.4042C52.0183 24.4042 50.7871 25.6354 50.7871 27.1538C50.7871 28.6723 52.0183 29.9035 53.5368 29.9035C55.0552 29.9035 56.2864 28.6723 56.2864 27.1538C56.2864 25.6354 55.0552 24.4042 53.5368 24.4042Z"
            fill="white"
          />
          <path
            d="M41.3091 27.9308C34.9398 27.9308 29.7578 33.1127 29.7578 39.4821C29.7578 45.8514 34.9398 51.0334 41.3091 51.0334C47.6785 51.0334 52.8604 45.8514 52.8604 39.4821C52.8604 33.1127 47.6785 27.9308 41.3091 27.9308ZM41.3091 46.8802C37.2298 46.8802 33.9083 43.5614 33.9083 39.4821C33.9083 35.4027 37.227 32.084 41.3091 32.084C45.3885 32.084 48.7072 35.4027 48.7072 39.4821C48.7099 43.5614 45.3912 46.8802 41.3091 46.8802Z"
            fill="white"
          />
          <path
            d="M50.4804 62.9322H31.7526C23.9852 62.9322 17.665 56.612 17.665 48.8446V30.1168C17.665 22.3467 23.9852 16.0293 31.7526 16.0293H50.4804C58.2478 16.0293 64.5706 22.3494 64.5706 30.1168V48.8446C64.5706 56.612 58.2505 62.9322 50.4804 62.9322ZM31.7553 20.4424C26.4202 20.4424 22.0782 24.7817 22.0782 30.1196V48.8473C22.0782 54.1825 26.4174 58.5245 31.7553 58.5245H50.4831C55.8183 58.5245 60.1602 54.1852 60.1602 48.8473V30.1196C60.1602 24.7844 55.8183 20.4424 50.4831 20.4424H31.7553Z"
            fill="white"
          />
          <defs>
            <linearGradient
              id="paint0_linear_2292_3396"
              x1="68.8886"
              y1="12.3355"
              x2="12.3184"
              y2="68.9056"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.0011" stopColor="#FBE18A" />
              <stop offset="0.2094" stopColor="#FCBB45" />
              <stop offset="0.3765" stopColor="#F75274" />
              <stop offset="0.5238" stopColor="#D53692" />
              <stop offset="0.7394" stopColor="#8F39CE" />
              <stop offset="1" stopColor="#5B4FE9" />
            </linearGradient>
          </defs>
        </svg>
      ),
    },
    {
      name: "Twitter/X",
      color: "bg-black",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="36"
          viewBox="0 0 40 36"
          fill="none"
        >
          <path
            d="M17.9489 23.23L7.20012 35.4587H1.60328L15.33 19.727L15.3997 19.6471L15.3353 19.5628L0.79862 0.541385H12.8226L21.3043 11.7465L21.4008 11.8741L21.5057 11.7533L31.2383 0.541385H36.8354L24.0458 15.2571L23.9767 15.3366L24.0402 15.4206L39.2043 35.4587H27.491L18.1495 23.2369L18.0534 23.1111L17.9489 23.23ZM28.9654 32.0714L29.0043 32.1224H29.0685H32.3516H32.6119L32.4553 31.9145L11.1928 3.69488L11.1539 3.6432H11.0892H7.49333H7.23078L7.39025 3.85178L28.9654 32.0714Z"
            fill="white"
            stroke="black"
            strokeWidth="0.259527"
          />
        </svg>
      ),
    }

  ];

  const ManualCredentialsModal = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const handleInputChange = (e, setter) => {
      e.preventDefault();
      setter(e.target.value);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const newUser = {
        ...defaultUserStructure(username),
      };

      userArray.push(newUser);
      console.log("New user added:", newUser);

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

      setUsername('');
      setPassword('');

    };

    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-gray-900 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-secondary rounded-lg shadow-lg w-96 p-6">
          {showSuccess && (
            <div className="bg-green-100 border-t border-b border-green-500 text-green-700 px-4 py-3 mb-4" role="alert">
              <p className="font-bold">Success!</p>
              <p className="text-sm">Instagram account has been successfully added.</p>
            </div>
          )}
          <h3 className="text-lg font-medium mb-4">
            Enter Instagram Credentials
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary text-start">
                Username
              </label>
              <input
                type="text"
                className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter username"
                value={username}
                onChange={(e) => handleInputChange(e, setUsername)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary text-start">
                Password
              </label>
              <input
                type="password"
                className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter password"
                value={password}
                onChange={(e) => handleInputChange(e, setPassword)}
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 text-gray-600 hover:text-primary"
                onClick={() => setShowCredentialsModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 opacity-75 z-50">
      <div className="bg-secondary rounded-lg shadow-lg w-2/3 max-w-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Add Social Account</h2>
          <button
            className="text-gray-500 hover:text-primary text-xl cursor-pointer"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-stretch">
            <p className="text-sm text-primary">Bulk Social Accounts</p>
            <button
              onClick={downloadSampleCSV}
              className="text-blue-500 text-sm hover:underline"
            >
              Download sample CSV
            </button>
          </div>

          <div
            className="mt-4 p-4 border-2 border-dashed border-neutral-400 rounded-md"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {csvData ? (
              <div className="text-center">
                <p className="text-green-600 font-medium">
                  CSV file uploaded successfully!
                </p>
                <p className="text-sm text-gray-600">
                  {csvData.length} accounts loaded
                </p>
                <button
                  onClick={() => setCsvData(null)}
                  className="mt-2 text-red-500 text-sm hover:underline"
                >
                  Remove CSV
                </button>
              </div>
            ) : (
              <>
                <p className="text-center text-gray-500">
                  Drag & Drop CSV file here
                </p>
                <p className="text-center text-sm text-blue-500">
                  Upload from your system,{" "}
                  <span className='hover:underline cursor-pointer' onClick={() => fileInputRef.current.click()}>
                    choose file
                  </span>
                </p>
              </>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".csv"
              onChange={handleFileUpload}
            />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4">
            {socialPlatforms.map((platform, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 border rounded-md hover:shadow-lg cursor-pointer"
                onClick={() => handlePlatformClick(platform.name)}
              >
                <div className="w-12 h-12 flex items-center justify-center">
                  {platform.icon}
                </div>
                <p className="mt-2 text-sm font-medium">{platform.name}</p>
                <p className="text-sm text-blue-500 hover:underline">
                  Learn more
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Render Modals */}
      {showInstagramModal && <InstagramCredentialsModal />}
      {showCredentialsModal && <ManualCredentialsModal />}
    </div>
  );
};

export default AddSocialAccountPopup;
