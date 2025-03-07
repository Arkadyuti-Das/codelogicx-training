import axios from "axios";
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify";
import { base_url } from "../constants/links";

export default function Logout(props?:any) {
    const navigate=useNavigate();
    const handleLogout=async()=>{
        await axios.post(`${base_url}/logout`, {});
        localStorage.removeItem("token");
        // localStorage.removeItem("role");
        toast.success("You have been logged out");
        navigate("/");
    }
  return (
    <div>
      <button className={props.className} onClick={handleLogout}>Logout</button>
    </div>
  )
}
