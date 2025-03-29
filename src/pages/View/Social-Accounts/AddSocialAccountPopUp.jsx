import React, { useState, useRef, useEffect } from "react";
import { X, Info } from "lucide-react";
import toast from "react-hot-toast";
import ManualCredentialsForm from "@/components/ManualCredentialsForm";
import { userArray } from "../../../Data/Users";
import { defaultUserStructure } from "../../../Data/Users"
import InstagramLogo from "../../../assets/instagram-icon.svg";
import FacebookLogo from "../../../assets/facebook-icon.svg";
import TwitterLogo from "../../../assets/twitter-x-icon.svg";
import TiktokLogo from "../../../assets/tiktok-icon.svg";
import CloudUpload from "../../../assets/cloud-upload.svg";
import { Input } from "@/components/ui/input";

const AddSocialAccountPopup = ({ onClose }) => {
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [credentialsSource, setCredentialsSource] = useState(false);
  const [csvData, setCsvData] = useState(null);
  const fileInputRef = useRef(null);
  const backgroundRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      // If the click is outside the backgroundRef element, close the modal
      if (backgroundRef.current && !backgroundRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleOutsideClick);

    // Clean up the event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose]);

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

  //function to parse CSV headers
  const parseCSVHeaders = (content) => {
    const lines = content.split("\n");
    const headers = lines[0].split(",").map(header => header.trim());

    // Define required headers
    const requiredHeaders = ["platform", "username", "password"];
    const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));

    if (missingHeaders.length > 0) {
      throw new Error(`Missing required headers: ${missingHeaders.join(", ")}`);
    }

    return headers;
  };

  // Function to parse CSV content
  const parseCSV = (content) => {
    const lines = content.split("\n");
    let headers;

    try {
      headers = parseCSVHeaders(content); // Validate headers
    } catch (error) {
      toast.error(error.message) // Show error if headers are missing
      fileInputRef.current.value = "";
      return [];
    }

    const requiredHeaders = ["platform", "username", "password"];
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === "") continue;
      const values = lines[i].split(",");

      const entry = {};
      requiredHeaders.forEach(header => {
        const index = headers.indexOf(header);
        entry[header] = values[index]?.trim() || ""; // Assign empty string if missing
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
        if (parsedData.length > 0) {
          setCsvData(parsedData);
          console.log("CSV Data loaded:", parsedData);
        }
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
        if (parsedData.length > 0) {
          setCsvData(parsedData);
          console.log("CSV Data loaded:", parsedData);
        }
      };
      reader.readAsText(file);
    }
  };

  const handlePlatformClick = (platformName) => {
    setSelectedPlatform(platformName);
    setCredentialsSource(true);
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

      setCredentialsSource(false);
    } else {
      alert("Please upload a CSV file first");
      setCredentialsSource(false);
    }
  };


  const InstagramCredentialsModal = () => (
    <div className="bg-background rounded-lg shadow-lg mx-auto max-w-80 sm:max-w-96 p-6">
      <h3 className="text-lg font-medium mb-4">Choose Credentials Source</h3>
      <div className="space-y-4">
        <button
          className="w-full p-3 border rounded-lg hover:bg-muted"
          onClick={() => {
            if (csvData) {
              handleCsvCredentialsUse();
            } else {
              alert("Please upload a CSV file first");
              setCredentialsSource(false);
            }
          }}
        >
          Use credentials from CSV{" "}
          {csvData ? `(${csvData.length} accounts)` : ""}
        </button>
        <button
          className="w-full p-3 border rounded-lg hover:bg-muted"
          onClick={() => {
            setCredentialsSource(false);
            setShowCredentialsModal(true);
          }}
        >
          Enter credentials manually
        </button>
      </div>
      <button
        className="mt-4 text-gray-500 hover:text-primary"
        onClick={() => setShowCredentialSource(false)}
      >
        Cancel
      </button>
    </div>
  );

  const socialPlatforms = [
    {
      name: "Facebook",
      color: "bg-blue-600",
      icon: FacebookLogo,
    },
    {
      name: "Instagram",
      color: "bg-pink-500",
      icon: InstagramLogo,
    },
    {
      name: "Twitter/X",
      color: "bg-white",
      icon: TwitterLogo,
    },
    {
      name: "TikTok",
      color: "bg-black",
      icon: TiktokLogo,
    }
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 dark:bg-neutral-500/10 z-50">
      <div
        ref={backgroundRef}
        className="w-fit">
        {!credentialsSource && !showCredentialsModal &&
          (<div className="bg-background rounded-lg mx-auto w-9/10 sm:w-full max-w-xl">
            <div className="flex items-start justify-between px-6 py-4">
              <h2 className="text-lg font-bold">Add Social Account</h2>
              <button
                className="text-gray-500 hover:text-red-500 text-xl cursor-pointer"
                onClick={onClose}
              >
                <X />
              </button>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-stretch">
                <p className="text-md text-primary">Bulk Social Accounts</p>
                <button
                  onClick={downloadSampleCSV}
                  className="text-sm underline cursor-pointer"
                >
                  Download sample CSV
                </button>
              </div>

              <div
                className="mt-6 rounded-md"
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
                      onClick={() => {
                        setCsvData(null)
                        fileInputRef.current.value = "";
                      }}
                      className="mt-2 text-red-500 text-sm hover:underline"
                    >
                      Remove CSV
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-3">
                    <img src={CloudUpload} alt="upload" />
                    <div className="flex flex-col items-start justify-center w-full space-y-1">
                      <p className="text-start text-sm font-semibold">
                        Drag & Drop CSV file here
                      </p>
                      <p className="text-start text-xs text-neutral-800 dark:text-neutral-400">
                        Upload from your system,{" "}
                        <span className='hover:underline cursor-pointer text-blue-500' onClick={() => fileInputRef.current.click()}>
                          choose file
                        </span>
                      </p>
                    </div>
                  </div>
                )}
                <Input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileUpload}
                />
              </div>

              <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {socialPlatforms.map((platform, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center"
                    onClick={() => handlePlatformClick(platform.name)}
                  >
                    <div className="flex items-center justify-center border rounded-md hover:shadow-lg hover:dark:shadow-gray-500/20 cursor-pointer mb-3 p-5">
                      <img src={platform.icon} alt={platform.name}
                        width="80"
                        height="80"
                        className={`${platform?.name === "Twitter/X" ? "bg-white rounded-full" : ''} `}
                      />
                    </div>
                    <p className="">{platform.name}</p>
                    <p className="text-xs text-neutral-500 flex items-center justify-center hover:underline">
                      <Info className="w-3 h-3 mr-1" />
                      Learn more
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>)}

        {/* Render Modals */}

        {credentialsSource && <InstagramCredentialsModal />}
        {showCredentialsModal && <ManualCredentialsForm platform={selectedPlatform.toUpperCase()} close={() => setShowCredentialsModal(false)} />}
      </div>
    </div>
  );
};

export default AddSocialAccountPopup;
