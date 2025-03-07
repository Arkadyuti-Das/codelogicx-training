import { useEffect } from "react";
import Logout from "./Logout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { base_url } from "../constants/links";

export default function Admin() {
  const navigate=useNavigate();
  useEffect(()=>{
    async function getInfo(){
      try{
        const item=localStorage.getItem("token");
        const res=await axios.post(`${base_url}/verify-token`, {item});
        toast.success(`Welcome ${res.data.username}`);
      }
      catch(error:any){
        const {data}=error.response;
        toast.error(data.message);
        navigate("/");
      }
    }
    getInfo();
  },[])
  return (
    <div>
      <p>Welcome Admin</p>
      <Logout/>
    </div>
  )
}
