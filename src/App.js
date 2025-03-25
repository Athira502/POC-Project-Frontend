import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./App.css"
import HomePage from "./Components/HomePage/HomePage"
import LogPage from "./Components/LogPage/LogPage"
import Dashboard from "./Components/Dashboard/Dashboard"
import ProcessHistory from "./Components/ProcessHistory/ProcessHistory"
import JobSchedular from "./Components/JobSchedular/JobSchedular"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/log" element={<LogPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/schedular" element={<JobSchedular />} />
        <Route path="/loghistory" element={<ProcessHistory/>} />
      </Routes>
    </Router>
  )
}

export default App


