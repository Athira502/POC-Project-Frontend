import { useState } from "react";
import './ProcessHistory.css';
import NavBar from "../NavBar/NavBar";
import BreadCrumb from "../BreadCrumb/BreadCrumb";
import {  getJobLogHistory } from "../../services/api";

const ProcessHistory = () => {
  const breadcrumbPaths = ["HOME", "JOB LOG HISTORY"];
  const [JoblogData, setJoblogData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    date: "",
    sap_system_id:""
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
  
      if (!filters.date && !filters.sap_system_id) {
        setError("Please apply at least one filter before fetching logs.");
        setLoading(false);
        return;
      }
  
      const data = await getJobLogHistory(filters.date, filters.sap_system_id);
      console.log("API Response:", data); 
      setJoblogData(data.data || []);
    } catch (err) {
      setError("Failed to fetch logs. Please try again.");
      console.error("API Error:", err);
      setJoblogData([]);
    } finally {
      setLoading(false);
    }
  };
  
 


  return (
    <div className="log-page">
      <NavBar />
      <BreadCrumb paths={breadcrumbPaths} />

      <div className="content-container">
      <div className="filters-container">
  <div className="filters-left">
    <div className="filter-group">
      <label>DATE</label>
      <input type="date" name="date" value={filters.date} onChange={handleFilterChange} />
    </div>

    <div className="filter-group">
      <label>SAP SYSTEM ID</label>
      <input type="text" name="sap_system_id" value={filters.sap_system_id} onChange={handleFilterChange} />
    </div>

</div> 
  <div className="button-group">
  <button className="apply-button" onClick={fetchLogs}>SEARCH</button>
  </div>

</div>


        <div className="table-container">
          {loading ? (
            <div className="loading-message">Loading logs...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : JoblogData.length === 0 ? (
            <div className="no-data-message">No logs found for selected filters</div>
          ) : (
            <table className="log-table">
              <thead>
                <tr>
                  {/* <th>ID NO</th> */}
                  <th>FILE PROCESSED</th>
                  <th>SAP SYSTEM ID</th>
                  <th>FILE PATH</th>
                  <th>DATE</th>
                 
                </tr>
              </thead>
              <tbody>
                {JoblogData.map((row, index) => (
                  <tr key={index}>
                    {/* <td>{row.id}</td> */}
                    <td>{row.last_file_processed}</td>
                    <td>{row.sap_system_id}</td>
                    <td>{row.file_path}</td>
                    <td>{row.date}</td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessHistory;


















