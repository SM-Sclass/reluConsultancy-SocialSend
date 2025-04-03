import React, { useRef, useState } from "react";
import Papa from "papaparse";
import csv from "../../assets/csv.svg";

const CsvUploader = () => {
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState(null);
  const [csvData, setCsvData] = useState([]);

  const handleDivClick = () => {
    fileInputRef.current?.click(); // Opens file input when div is clicked
  };

  const handleFileUpload = (event) => {
    setError(""); // Reset error state

    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is a CSV
    if (!file.name.endsWith(".csv")) {
      setError("Please upload a valid CSV file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = ({ target }) => {
      if (!target?.result) return;

      const csv = target.result;
      setFileName(file.name);

      Papa.parse(csv, {
        header: true, // Treat first row as headers
        skipEmptyLines: true,
        complete: (result) => {
          const headers = result.meta.fields || [];
          const rows = result.data;

          // Required columns
          const requiredHeaders = ["username", "platform"];
          const missingHeaders = requiredHeaders.filter(
            (header) => !headers.includes(header)
          );

          if (missingHeaders.length > 0) {
            setError(`Missing columns: ${missingHeaders.join(", ")}`);
          } else {
            alert("CSV file is valid! ✅");
            setCsvData([
              headers,
              ...rows.map((row) => headers.map((h) => row[h] || "")),
            ]);
            setShowModal(true);
          }
        },
        error: () => {
          setError("Error parsing CSV file.");
        },
      });
    };

    reader.readAsText(file);
  };

  return (
    <div className="p-4">
      <div onClick={handleDivClick} className="flex items-center ">
        <img src={csv} alt="" className="w-10 h-10 bg-cover" />
        <span className="font-medium">
          {fileName ? fileName : "Upload CSV"}{" "}
        </span>
        <input
          className="hidden"
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* Modal to Show CSV Data */}
      {showModal && (
        <div className="fixed h-[100vh] w-[100vw] inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
            <h2 className="text-lg font-semibold mb-4">CSV Preview</h2>
            <div className="overflow-auto max-h-80">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    {csvData[0]?.map((header, index) => (
                      <th
                        key={index}
                        className="border border-gray-300 px-4 py-2"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-100">
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="border border-gray-300 px-4 py-2"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white cursor-pointer rounded"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CsvUploader;
