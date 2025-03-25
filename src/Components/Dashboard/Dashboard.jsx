
import React,{useState} from "react";
import "./Dashboard.css";
import NavBar from "../NavBar/NavBar";
import BreadCrumb from "../BreadCrumb/BreadCrumb";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend } from "chart.js";
import { getAuditClassesOnDate,getCriticalityOnDate,getSystemIDOnDate,getTCodeOnDate } from "../../services/api";

Chart.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const breadcrumbPaths = ["HOME", "LOG ANALYTICS"];
  const [TCodeOnDate, setTCodeOnDate] = useState({ labels: [], datasets: [] });
  const [SystemIDOnDate, setSystemIDOnDate] = useState({ labels: [], datasets: [] });
  const [CriticalityOnDate, setCriticalityOnDate] = useState({ labels: [], datasets: [] });
  const [AuditClassesOnDate, setAuditClassesOnDate] = useState({ labels: [], datasets: [] });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const [filters, setFilters] = React.useState({
    start_date: "",
    end_date: "",
  });
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };



  
const formatChartData = (responseData, labelField, countField) => {
    if (!Array.isArray(responseData)) {
      console.warn("Invalid response:", responseData);
      return { labels: [], datasets: [] };
    }
  
    const colors = [
      "#ff6384", "#36a2eb", "#ffce56", "#e74c3c",
      "#f39c12", "#2ecc71", "#3498db", "#31c8a4",
      "#c6727d", "#0bb692", "#4d4c12", "#1e4970",
      "#985906", "#ba0b34", "#a957b9", "#3b7972",
    ];
  
    return {
      labels: responseData.map((item) => item[labelField] || "Unknown"),
      datasets: [{
        label:countField,
        data: responseData.map((item) => item[countField] || 0),
        backgroundColor: colors.slice(0, responseData.length),
      }]
    };
  };


const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
  
      if (!filters.start_date && !filters.end_date) {
        setError("Please apply at least one filter.");
        setLoading(false);
        return;
      }
  
      const [tCodeResponse, systemIDResponse, criticalityResponse, auditClassesResponse] = 
        await Promise.all([
          getTCodeOnDate(filters.start_date, filters.end_date),
          getSystemIDOnDate(filters.start_date, filters.end_date),
          getCriticalityOnDate(filters.start_date, filters.end_date),
          getAuditClassesOnDate(filters.start_date, filters.end_date),
        ]);
  
      setTCodeOnDate(formatChartData(tCodeResponse, "transaction_code", "log_count"));
      console.log("tcode setted",TCodeOnDate)
      setSystemIDOnDate(formatChartData(systemIDResponse, "sap_system_id", "log_count_forSystem_id"));
      console.log("systemid setted",SystemIDOnDate)

      setCriticalityOnDate(formatChartData(criticalityResponse, "criticality", "criticality_log_count"));
      console.log("criricality setted",CriticalityOnDate)

      setAuditClassesOnDate(formatChartData(auditClassesResponse, "audit_class", "audit_log_count"));
      console.log("audit calss setted",AuditClassesOnDate)

  
    } catch (err) {
      setError("Failed to fetch logs.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="dashboard-page">
      <NavBar/>
      <BreadCrumb paths={breadcrumbPaths} />

      <div className="content-container">
        <div className="filters-container">
          <div className="filter-group">
            <label>START DATE</label>
            <input type="date" name="start_date" value={filters.start_date} onChange={handleFilterChange} />
          </div>

          <div className="filter-group">
            <label>END DATE</label>
            <input type="date" name="end_date" value={filters.end_date} onChange={handleFilterChange} />
          </div>

          <button className="apply-button" onClick={fetchLogs}>
            SEARCH
          </button>
        </div>

           <div className="charts-grid">
          <div className="chart-card">
            <h3 className="chart-title">BASED ON SYSTEM ID</h3>
            <Bar data={SystemIDOnDate} />
          </div>

          <div className="chart-card">
            <h3 className="chart-title">BASED ON AUDIT CLASSES</h3>
            <Line data={AuditClassesOnDate} />
          </div>

          <div className="chart-card">
            <h3 className="chart-title">BASED ON CRITICALITY</h3>
            <Doughnut className="mock-donut-chart" data={CriticalityOnDate} />
          </div>

          <div className="chart-card">
            <h3 className="chart-title">BASED ONMOST USED TCODES</h3>
            <Bar data={TCodeOnDate} />
          </div>
        </div> 


      </div>
    </div>
  );
};

export default Dashboard;







