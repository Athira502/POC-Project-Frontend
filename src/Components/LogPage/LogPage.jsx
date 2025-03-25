import { useState } from "react";
import "./LogPage.css";
import NavBar from "../NavBar/NavBar";
import BreadCrumb from "../BreadCrumb/BreadCrumb";
import { getLogswithParams,downloadCSV } from "../../services/api";

const LogPage = () => {
  const breadcrumbPaths = ["HOME", "LOG MONITORING"];
  const [logData, setLogData] = useState([]);
  const[count,setCount]=useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    t_code: "",
    program: "",
    criticality: "",
    user: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!filters.start_date && !filters.end_date && !filters.t_code && !filters.program && !filters.criticality && !filters.user) {
        setError("Please apply at least one filter before fetching logs.");
        setLoading(false);
        return;
      }

      const data = await getLogswithParams(
        filters.start_date,
        filters.end_date,
        filters.t_code,
        filters.program,
        filters.criticality,
        filters.user,
        filters.sap_system_id
      );
      setCount(data.total_logs);
      setLogData(data.logs);
    } catch (err) {
      setError("Failed to fetch logs. Please try again.");
      console.error("API Error:", err);
      setLogData([]);
    } finally {
      setLoading(false);
    }
  };
  const download = async () => {
    try {
      const response = await downloadCSV(
        filters.start_date,
        filters.end_date,
        filters.t_code,
        filters.program,
        filters.criticality,
        filters.user,
        filters.sap_system_id
      );
  
      if (!response || response.status !== 200) {
        throw new Error(`Failed to download logs: ${response.statusText}`);
      }
  
      const blob = await response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
  
      a.href = url;
      a.download = "logs.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message || "Error downloading logs. Please try again.");
      console.error("Download Error:", err);
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
      <label>START DATE</label>
      <input type="date" name="start_date" value={filters.start_date} onChange={handleFilterChange} />
    </div>

    <div className="filter-group">
      <label>END DATE</label>
      <input type="date" name="end_date" value={filters.end_date} onChange={handleFilterChange} />
    </div>

    <div className="filter-group">
      <label>TCODE</label>
      <input type="text" name="t_code" value={filters.t_code} onChange={handleFilterChange} />
    </div>

    <div className="filter-group">
      <label>PROGRAM</label>
      <input type="text" name="program" value={filters.program} onChange={handleFilterChange} />
    </div>

    <div className="filter-group2">
      <label>CRITICALITY</label>
      <select name="criticality" value={filters.criticality} onChange={handleFilterChange}>
        <option value="">All</option>
        <option value="H">Critical</option>
        <option value="M">Warning</option>
        <option value="L">Low</option>
      </select>
    </div>

    <div className="filter-group2">
      <label>USER</label>
      <input type="text" name="user" value={filters.user} onChange={handleFilterChange} />
    </div>
    <div className="filter-group2">
      <label>SAP SYSTEM ID</label>
      <input type="text" name="sap_system_id" value={filters.sap_system_id} onChange={handleFilterChange} />
    </div>
    <div className="filter-group2">
      <label>ENTRY COUNT</label>
      <input type="text" value={count} />
    </div> 
    
  
</div> 
<div className="button-group">
 <button className="apply-button" onClick={download}>DOWNLOAD</button>
  <button className="apply-button" onClick={fetchLogs}>SEARCH</button>
  </div>
</div>


        <div className="table-container">
          {loading ? (
            <div className="loading-message">Loading logs...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : logData.length === 0 ? (
            <div className="no-data-message">No logs found for selected filters</div>
          ) : (
            <table className="log-table">
              <thead>
                <tr>
                  {/* <th>ID NO</th> */}
                  <th>SAP SYSTEM ID</th>
                  <th>APP SERVER INSTANCE</th>
                  <th>MESSAGE IDENTIFIER</th>
                  <th>MESSAGE GROUP</th>
                  <th>SUB CLASS</th>
                  <th>DATE</th>
                  <th>TIME</th>
                  <th>OS NUMBER</th>
                  <th>SAP PROCESS</th>
                  <th>CLIENT</th>
                  <th>FILE NUMBER</th>
                  <th>SHORT TERMINAL NAME</th>
                  <th>USER</th>
                  <th>T CODE</th>
                  <th>PROGRAM</th>
                  <th>LONG TERMINAL NAME</th>
                  <th>LAST ADDRESS ROUTED</th>
                  <th>FIRST VARIABLE</th>
                  <th>SECOND VARIABLE</th>
                  <th>THIRD VARIABLE</th>
                  <th>AUDIT LOG MSG</th>
                  <th>AUDIT CLASS</th>
                  <th>MSG SEVERITY</th>
                  <th>CRITICALITY</th>
                  <th>OTHER VARIABLE VALUES</th>
                </tr>
              </thead>
              <tbody>
                {logData.map((row, index) => (
                  <tr key={index}>
                    {/* <td>{row.id}</td> */}
                    <td>{row.sap_system_id}</td>
                    <td>{row.app_server_instance}</td>
                    <td>{row.message_identifier}</td>
                    <td>{row.syslog_msg_group}</td>
                    <td>{row.sub_name}</td>
                    <td>{row.date}</td>
                    <td>{row.time}</td>
                    <td>{row.operating_system_number}</td>
                    <td>{row.sap_process}</td>
                    <td>{row.client}</td>
                    <td>{row.file_number}</td>
                    <td>{row.short_terminal_name}</td>
                    <td>{row.user}</td>
                    <td>{row.transaction_code}</td>
                    <td>{row.program}</td>
                    <td>{row.long_terminal_name}</td>
                    <td>{row.last_address_routed_no_of_variables}</td>
                    <td>{row.first_variable_value}</td>
                    <td>{row.second_variable_value}</td>
                    <td>{row.third_variable_value}</td>
                    <td>{row.audit_log_msg_text}</td>
                    <td>{row.audit_class}</td>
                    <td>{row.message_severity}</td>
                    <td>{row.criticality}</td>
                    <td>{row.other_variable_values}</td>
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

export default LogPage;


















