import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import UserProfile from "./UserProfile";
import { base_url } from "../constants/links";

export default function User() {
  const [loginName, setLoginName]=useState<string>("");
  const [item, setItem]=useState<string|null>(localStorage.getItem("token"));
  const navigate=useNavigate();
  useEffect(()=>{
    async function getInfo(){
      try{
        // const item=localStorage.getItem("token");
        const res=await axios.post(`${base_url}/verify-token`, {item});
        setLoginName(res.data.username);
        setItem(localStorage.getItem("token"));
        // toast.success(`Welcome ${res.data.username}`);
      }
      catch(error:any){
        const {data}=error.response;
        setItem(null);
        toast.error(data.message);
        navigate("/");
      }
    }
    getInfo();
  },[item])
  return (
    <div>
      <div>
        <UserProfile loggedIn={loginName}/>
      </div>
    </div>
  )
}
