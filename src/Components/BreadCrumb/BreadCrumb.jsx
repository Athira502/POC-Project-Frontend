
import { useNavigate } from "react-router-dom"
import "./BreadCrumb.css"

const BreadCrumb = ({ paths }) => {
  const navigate = useNavigate() 

  return (
    <div className="breadcrumb">
      {paths.map((path, index) => (
        <span 
          key={index} 
          className="breadcrumb-item" 
          onClick={() => navigate(path === "HOME" ? "/" : `/${path.toLowerCase()}`)}
          style={{ cursor: "pointer", color: "black" }} 
        >
        
          {path}
         { index < paths.length - 1 && <span className="breadcrumb-separator">{">"}</span>}
        </span>
      ))}
    </div>
  )
}

export default BreadCrumb

