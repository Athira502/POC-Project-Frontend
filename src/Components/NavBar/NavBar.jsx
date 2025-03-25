import "./NavBar.css"
import tarentoLogo from "../../assets/Tarento.svg"

const NavBar = ({ currentPage }) => {
  return (
    <div className="navbar">
      <div className="logo-container">
        <img src={tarentoLogo || "/placeholder.svg"} alt="Tarento Logo" className="logo" />
      </div>
     
      <div className="user-profile">
        <div className="profile-icon"></div>
      </div>
    </div>
  )
}

export default NavBar

