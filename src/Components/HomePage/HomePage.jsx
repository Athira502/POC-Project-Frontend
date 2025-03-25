import { useState, useEffect } from "react";
import axios from "axios";
import "./HomePage.css";
import NavBar from "../NavBar/NavBar";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../BreadCrumb/BreadCrumb";
import { getCriticalityOnDate, getTotalEventCount,getSystemforPost,posttoDB } from "../../services/api";

const EventCard = ({ title, count, type }) => {
  const getColorClass = () => {
    switch (type) {
      case "critical":
        return "critical-card";
      case "medium risk":
        return "warning-card";
      case "low":
        return "low-card";
      default:
        return "total-card";
    }
  };

  return (
    <div className={`event-card ${getColorClass()}`}>
      <div className="event-title">{title}</div>
      <div className="event-count">{count !== null ? count : "Loading..."}</div>
    </div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const breadcrumbPaths = ["HOME"];



  const [systems, setSystems] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [loading2, setLoading2] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedSystemId, setSelectedSystemId] = useState(null);


   useEffect(() => {
    fetchSystems();
  }, []);

  const fetchSystems = async () => {
    try {
      const response = await getSystemforPost();
      const systemsWithFolders = response.data.map(system => ({
        ...system,
        folder_name: system.file_path.split('/').filter(Boolean).pop()
      }));
      console.log("systembefore set",systemsWithFolders);
      setSystems(systemsWithFolders);
     
    } catch (error) {
      console.error("Error fetching systems:", error);
      setMessage("Failed to load systems.");
    }
  };
  useEffect(() => {
    console.log("system updated:", systems);
  }, [systems]);
 


  const handleProcessFolder = async () => {
    if (!selectedFolder) {
      setMessage("Please select a system to process");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await posttoDB(selectedFolder);
      setMessage(response?.data?.message || "Processing initiated successfully!");
    } catch (error) {
      console.error("Error processing folder:", error);
      setMessage(error.response?.data?.detail || "Failed to process system.");
    } finally {
      setLoading(false);
    }
  };

    
  const [totaleventsToday, setTotaleventsToday] = useState(0);
  const [totaleventslastWeek, setTotaleventslastWeek] = useState(0);
  const [totaleventslastMonth, setTotaleventslastMonth] = useState(0);
  const [criticalToday, setCriticalToday] = useState(0);
  const [criticalLastWeek, setCriticalLastWeek] = useState(0);
  const [criticalLastMonth, setCriticalLastMonth] = useState(0);
  const [mediumToday, setMediumToday] = useState(0);
  const [mediumLastWeek, setMediumLastWeek] = useState(0);
  const [mediumLastMonth, setMediumLastMonth] = useState(0);
  const [lowToday, setLowToday] = useState(0);
  const [lowLastWeek, setLowLastWeek] = useState(0);
  const [lowLastMonth, setLowLastMonth] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleNavigation = (path) => {
    navigate(path);
  };

    const getDateRanges = () => {
    const today = new Date();
    
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(today.getDate() - 7);
    const lastWeekStartStr = `${lastWeekStart.getFullYear()}-${String(lastWeekStart.getMonth() + 1).padStart(2, '0')}-${String(lastWeekStart.getDate()).padStart(2, '0')}`;
    
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const lastMonth = currentMonth - 1;
    const yearOfLastMonth = lastMonth < 0 ? currentYear - 1 : currentYear;
    const actualLastMonth = lastMonth < 0 ? 11 : lastMonth;
    
    const lastMonthStart = new Date(yearOfLastMonth, actualLastMonth, 1);
    const lastMonthStartStr = `${lastMonthStart.getFullYear()}-${String(lastMonthStart.getMonth() + 1).padStart(2, '0')}-01`;
    
    const lastDayOfMonth = new Date(yearOfLastMonth, actualLastMonth + 1, 0).getDate();
    const lastMonthEndStr = `${yearOfLastMonth}-${String(actualLastMonth + 1).padStart(2, '0')}-${String(lastDayOfMonth).padStart(2, '0')}`;
    
    console.log("Today is:", today.toDateString());
    console.log("Current month:", currentMonth);
    console.log("Last month:", actualLastMonth);
    console.log("Last month year:", yearOfLastMonth);
    console.log("Last day of last month:", lastDayOfMonth);
    
    console.log("today", todayStr);
    console.log("lstweek", lastWeekStartStr);
    console.log("lastmonth start", lastMonthStartStr);
    console.log("last month end", lastMonthEndStr);
  
    return { todayStr, lastWeekStartStr, lastMonthStartStr, lastMonthEndStr };
  }

    const processCriticalityData = (data) => {
    const result = {
      critical: 0,
      medium: 0,
      low: 0
    };
    
    if (Array.isArray(data)) {
      data.forEach(item => {
        if (item.criticality === "H") {
          result.critical = item.criticality_log_count;
        } else if (item.criticality === "M") {
          result.medium = item.criticality_log_count;
        } else if (item.criticality === "L") {
          result.low = item.criticality_log_count;
        }
      });
    }
    
    return result;
  };

  const fetchData = async () => {
    try {
      setError(null);
      const { todayStr, lastWeekStartStr, lastMonthStartStr, lastMonthEndStr } = getDateRanges();
  
      const [
        totalTodayData,
        totalLastWeekData,
        totalLastMonthData,
        criticalTodayData,
        criticalLastWeekData,
        criticalLastMonthData,
      ] = await Promise.all([
        getTotalEventCount(todayStr, todayStr),
        getTotalEventCount(lastWeekStartStr, todayStr),
        getTotalEventCount(lastMonthStartStr, lastMonthEndStr),
        getCriticalityOnDate(todayStr, todayStr),
        getCriticalityOnDate(lastWeekStartStr, todayStr),
        getCriticalityOnDate(lastMonthStartStr, lastMonthEndStr),
      ]);
  
      const totalToday = totalTodayData?.total_count ?? 0;
      const totalLastWeek = totalLastWeekData?.total_count ?? 0;
      const totalLastMonth = totalLastMonthData?.total_count ?? 0;
  
      setTotaleventsToday(totalToday);
      setTotaleventslastWeek(totalLastWeek);
      setTotaleventslastMonth(totalLastMonth);
  
      console.log("Total Today:", totalLastMonth);
  
      const todayCriticality = processCriticalityData(criticalTodayData);
      const lastWeekCriticality = processCriticalityData(criticalLastWeekData);
      const lastMonthCriticality = processCriticalityData(criticalLastMonthData);
      setCriticalToday(todayCriticality.critical);
      setCriticalLastWeek(lastWeekCriticality.critical);
      setCriticalLastMonth(lastMonthCriticality.critical);
  
      setMediumToday(todayCriticality.medium);
      setMediumLastWeek(lastWeekCriticality.medium);
      setMediumLastMonth(lastMonthCriticality.medium);
  
      setLowToday(todayCriticality.low);
      setLowLastWeek(lastWeekCriticality.low);
      setLowLastMonth(lastMonthCriticality.low);
  
    } catch (err) {
      setError("Failed to fetch logs.");
      console.error(err);
    }
  };
  

    
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="home-page">
      <NavBar />
      <BreadCrumb paths={breadcrumbPaths} />

      <div className="content-container">
        <div className="nav-tool">
          <h1 className="page-title">EVENTS ANALYSIS AND MONITORING</h1>

          <div className="monitoring-cards">
            <div className="monitoring-card" onClick={() => handleNavigation("/log")}>
              <div className="card-content">
                <h3>LOG MONITORING</h3>
              </div>
            </div>
            <div className="monitoring-card" onClick={() => handleNavigation("/dashboard")}>
              <div className="card-content">
                <h3>LOG ANALYTICS</h3>
              </div>
            </div>
          </div>
          </div>




        <div className="nav-tool">
          <h1 className="page-title">JOB MANAGEMENT</h1>

          <div className="monitoring-cards">
            <div className="monitoring-card" onClick={() => handleNavigation("/schedular")}>
              <div className="card-content">
                <h3>JOB SCHEDULAR</h3>
              </div>
            </div>
            <div className="monitoring-card" onClick={() => handleNavigation("/loghistory")}>
              <div className="card-content">
                <h3>JOB LOG HISTORY</h3>
              </div>
            </div>
          </div>


  {/* <h1 className="page-title">SELECT A SYSTEM TO PROCESS</h1>
<div className="system-cards-container">
  {systems.map((system) => (
    <div 
      key={system.id} 
      className={`system-card ${selectedFolder === system.folder_name ? 'selected' : ''}`}
      onClick={() => setSelectedFolder(system.folder_name)}
    >
      <div className="card-content">
        <h3>{system.sap_system_id}</h3>
        <div className="system-details">
          <p>Folder: {system.folder_name}</p>
        </div>
      </div>
    </div>
  ))}
</div>
<button 
  onClick={handleProcessFolder}
  disabled={loading || !selectedFolder}
  className="process-button"
>
  {loading ? "Processing..." : `Process ${selectedFolder || "Folder"}`}
</button>

  {message && <div className="status-message">{message}</div>} */}

        </div>

        <div className="event-classification">
          <h1 className="page-title">EVENTS DETAILS</h1>

          {error ? <div className="error">{error}</div> : null}

          <div className="events-section">
            <h2 className="section-title">EVENTS: TODAY</h2>
            <div className="events-cards">
              <EventCard title="TOTAL EVENTS" count={totaleventsToday} type="total" />
              <EventCard title="CRITICAL EVENTS" count={criticalToday} type="critical" />
              <EventCard title="MEDIUM RISK EVENTS" count={mediumToday} type="medium risk" />
              <EventCard title="LOW RISK EVENTS" count={lowToday} type="low" />
            </div>
          </div>

          <div className="events-section">
            <h2 className="section-title">EVENTS: LAST WEEK</h2>
            <div className="events-cards">
              <EventCard title="TOTAL EVENTS" count={totaleventslastWeek} type="total" />
              <EventCard title="CRITICAL EVENTS" count={criticalLastWeek} type="critical" />
              <EventCard title="MEDIUM RISK EVENTS" count={mediumLastWeek} type="medium risk" />
              <EventCard title="LOW RISK EVENTS" count={lowLastWeek} type="low" />
            </div>
          </div>

          <div className="events-section">
            <h2 className="section-title">EVENTS: LAST MONTH</h2>
            <div className="events-cards">
              <EventCard title="TOTAL EVENTS" count={totaleventslastMonth} type="total" />
              <EventCard title="CRITICAL EVENTS" count={criticalLastMonth} type="critical" />
              <EventCard title="MEDIUM RISK EVENTS" count={mediumLastMonth} type="medium risk" />
              <EventCard title="LOW RISK EVENTS" count={lowLastMonth} type="low" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;



















