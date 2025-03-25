
import React, { useState, useEffect } from "react";
import { getSystemforPost, posttoDB, getJobSchedulingDetails } from "../../services/api";
import "./JobSchedular.css";
import NavBar from "../NavBar/NavBar";
import BreadCrumb from "../BreadCrumb/BreadCrumb";

const JobSchedular = () => {
  const breadcrumbPaths = ["HOME", "JOB SCHEDULAR"];
  const [systems, setSystems] = useState([]);
  const [loadingId, setLoadingId] = useState(null); 
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSystems();
  }, []);

  const fetchSystems = async () => {
    try {
      setLoadingId(true); 
      
      const systemsResponse = await getSystemforPost();
      const lastProcessedResponse = await getJobSchedulingDetails();

      console.log("Systems API Response:", systemsResponse.data);
      console.log("Last Processed API Response:", lastProcessedResponse.data);

      const lastProcessedMap = {};
      if (lastProcessedResponse.data && lastProcessedResponse.data.length > 0) {
        lastProcessedResponse.data.forEach((item) => {
          lastProcessedMap[item.sap_system_id] = {
            file_name: item.file_name || "N/A",
            date_processed: item.date_processed || "N/A",
          };
        });
      }

      const getFolderName = (filePath) => {
        if (!filePath) return "N/A"; 
      
        const normalizedPath = filePath.replace(/\\/g, "/");
      
        const parts = normalizedPath.split("/").filter(Boolean);
        return parts.length > 0 ? parts.pop() : "N/A";
      };

      const combinedData = systemsResponse.data.map((system) => ({
        sap_system_id: system.sap_system_id,
        folder_name: getFolderName(system.file_path),
        file_name: lastProcessedMap[system.sap_system_id]?.file_name || "N/A", 
        date_processed: lastProcessedMap[system.sap_system_id]?.date_processed || "N/A", 
      }));

      console.log("Final Merged Data:", combinedData);
      setSystems(combinedData);
      setError("");
    } catch (error) {
      console.error("Error fetching systems:", error);
      setError("Failed to load systems.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleProcessFolder = async (row) => {
    if (!row.folder_name) {
      setMessage("Please select a system to process");
      return;
    }

    setLoadingId(row.sap_system_id); 
    setMessage("");
    setError("");

    try {
      const response = await posttoDB(row.folder_name);
      
      await fetchSystems();
      
      setMessage(response?.data?.message || "Processing completed successfully!");
    } catch (error) {
      console.error("Error processing folder:", error);
      setError(error.response?.data?.detail || "Failed to process system.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="job-schedular">
      <NavBar />
      <BreadCrumb paths={breadcrumbPaths} />
      <div className="job-scheduler-container">
        <div className="table-container">
          <table className="log-table">
            <thead>
              <tr>
                <th>SAP SYSTEM ID</th>
                <th>FOLDER NAME</th>
                <th>LAST FILE PROCESSED</th>
                <th>LAST PROCESSED TIME</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {systems.map((row, index) => (
                <tr key={index}>
                  <td>{row.sap_system_id}</td>
                  <td>{row.folder_name}</td>
                  <td>{row.file_name}</td>
                  <td>{row.date_processed}</td>
                  <td>
                    <button
                      onClick={() => handleProcessFolder(row)}
                      disabled={loadingId === row.sap_system_id} // Disable only the clicked button
                      className="process-button"
                    >
                      {loadingId === row.sap_system_id ? "PROCESSING..." : "RUN NOW"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loadingId && <div className="loading">Loading...</div>}
        {message && <div className="message-box">{message}</div>}
        {error && <div className="error-box">{error}</div>}
      </div>
    </div>
  );
};

export default JobSchedular;




















// import React, { useState, useEffect } from "react";
// import { getSystemforPost, posttoDB, getJobSchedulingDetails } from "../../services/api";
// import "./JobSchedular.css";
// import NavBar from "../NavBar/NavBar";
// import BreadCrumb from "../BreadCrumb/BreadCrumb";

// const JobSchedular = () => {
//   const breadcrumbPaths = ["HOME", "JOB SCHEDULAR"];
//   const [systems, setSystems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchSystems();
//   }, []);

//   const fetchSystems = async () => {
//     try {
//       setLoading(true);
      
//       const systemsResponse = await getSystemforPost();
//       const lastProcessedResponse = await getJobSchedulingDetails();

//       console.log("Systems API Response:", systemsResponse.data);
//       console.log("Last Processed API Response:", lastProcessedResponse.data);

//       const lastProcessedMap = {};
//       if (lastProcessedResponse.data && lastProcessedResponse.data.length > 0) {
//         lastProcessedResponse.data.forEach((item) => {
//           lastProcessedMap[item.sap_system_id] = {
//             file_name: item.file_name || "N/A",
//             date_processed: item.date_processed || "N/A",
//           };
//         });
//       }
//       const getFolderName = (filePath) => {
//         if (!filePath) return "N/A"; 
      
//         const normalizedPath = filePath.replace(/\\/g, "/");
      
//         const parts = normalizedPath.split("/").filter(Boolean);
//         return parts.length > 0 ? parts.pop() : "N/A";
//       };


//       const combinedData = systemsResponse.data.map((system) => ({
//         sap_system_id: system.sap_system_id,
//         folder_name: getFolderName(system.file_path),
//         file_name: lastProcessedMap[system.sap_system_id]?.file_name || "N/A", 
//         date_processed: lastProcessedMap[system.sap_system_id]?.date_processed || "N/A", 
//       }));

//       console.log("Final Merged Data:", combinedData);
//       setSystems(combinedData);
//       setError("");
//     } catch (error) {
//       console.error("Error fetching systems:", error);
//       setError("Failed to load systems.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleProcessFolder = async (row) => {
//     if (!row.folder_name) {
//       setMessage("Please select a system to process");
//       return;
//     }

//     setLoading(true);
//     setMessage("");
//     setError("");

//     try {
//       const response = await posttoDB(row.folder_name);
      
//       await fetchSystems();
      
//       setMessage(response?.data?.message || "Processing completed successfully!");
//     } catch (error) {
//       console.error("Error processing folder:", error);
//       setError(error.response?.data?.detail || "Failed to process system.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="job-schedular">
//       <NavBar />
//       <BreadCrumb paths={breadcrumbPaths} />
//       <div className="job-scheduler-container">
//         <div className="table-container">
//           <table className="log-table">
//             <thead>
//               <tr>
//                 <th>SAP SYSTEM ID</th>
//                 <th>FOLDER NAME</th>
//                 <th>LAST FILE PROCESSED</th>
//                 <th>LAST PROCESSED TIME</th>
//                 <th>ACTION</th>
//               </tr>
//             </thead>
//             <tbody>
//               {systems.map((row, index) => (
//                 <tr key={index}>
//                   <td>{row.sap_system_id}</td>
//                   <td>{row.folder_name}</td>
//                   <td>{row.file_name}</td>
//                   <td>{row.date_processed}</td>
//                   <td>
//                     <button
//                       onClick={() => handleProcessFolder(row)}
//                       disabled={loading}
//                       className="process-button"
//                     >
//                       {loading ? "PROCESSING..." : "RUN NOW"}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         {loading && <div className="loading">Loading...</div>}
//         {message && <div className="message-box">{message}</div>}
//         {error && <div className="error-box">{error}</div>}
//       </div>
//     </div>
//   );
// };

// export default JobSchedular;