import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; 
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getTCodeOnDate = async (startDate, endDate) => {
  try {
    const response = await api.get("/dashboard/tcode_onDate/", {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching T-Code data:", error);
    return [];
  }
};

export const getSystemIDOnDate = async (startDate, endDate) => {
  try {
    const response = await api.get("/dashboard/s_id_onDate/", {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching System ID data:", error);
    return [];
  }
};


export const getAuditClassesOnDate = async (startDate, endDate) => {
  try {
    const response = await api.get("/dashboard/auditclasses_onDate/", {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Audit Classes data:", error);
    return [];
  }
};

export const getCriticalityOnDate = async (startDate, endDate) => {
  try {
    const response = await api.get("/dashboard/criticality_onDate/", {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Criticality data:", error);
    return [];
  }
};
export const getTotalEventCount = async (startDate, endDate) => {
  try {
    const response = await api.get("/home/totaleventCount/", {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Total Event Count:", error);
    return { total_count: 0 };
  }
};

export const downloadCSV =async(start_date, end_date, t_code, program, criticality, user,sap_system_id)=>{
  try {
    const params = {};
    if (start_date) params.start_date = start_date; 
    if (end_date) params.end_date = end_date;
    if (t_code) params.t_code = t_code;
    if (program) params.program = program;
    if (criticality) params.criticality = criticality;
    if (user) params.user = user;
    if(sap_system_id) params.sap_system_id =sap_system_id;
    const response = await api.get("/logs/download/", {
      params,
      responseType: "blob", 
    });

    return response;
} catch (error) {
  console.error("Error fetching logs:", error);
  return [];
}
};

export const getLogswithParams = async (start_date, end_date, t_code, program, criticality, user,sap_system_id) => {
    try {
        const params = {};
        if (start_date) params.start_date = start_date; 
        if (end_date) params.end_date = end_date;
        if (t_code) params.t_code = t_code;
        if (program) params.program = program;
        if (criticality) params.criticality = criticality;
        if (user) params.user = user;
        if(sap_system_id) params.sap_system_id =sap_system_id;

        const response = await api.get("/logs/params/", { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching logs:", error);
        return [];
    }
};




export const posttoDB = async (folder) => {
  try {
    const formData = new FormData();
    formData.append('folder', folder);  // Or use 'sap_system_id' if backend expects that
    
    const response = await api.post("/process-folder/", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    
    return response;
  } catch (error) {
    console.error("Error processing system:", error);
    throw error;
  }
};

export const getSystemforPost = async () =>{
  try{
    const response = await api.get("/get-systems");
    return response;
  }catch (error) {
    console.error("Error fetching systems:", error);
    return [];
}
};

export const getJobSchedulingDetails = async () =>{
  try{
    const response = await api.get("/get-last-processed-files");
    return response;
  }catch (error) {
    console.error("Error fetching systems and details:", error);
    return [];
}
};



export const getJobLogHistory = async (date,sap_system_id) =>{
  try{
    const params = {};
    if (date) params.date = date; 
    if (sap_system_id) params.sap_system_id = sap_system_id;
    const response = await api.get("/job_history/", { params });
    console.log("new in api",response);
    return response;
  }catch (error) {
    console.error("Error fetching last logs:", error);
    return [];
}
}

