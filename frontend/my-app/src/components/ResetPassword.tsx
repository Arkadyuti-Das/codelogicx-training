import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify";
import { base_url } from "../constants/links";

export default function ResetPassword() {
    const navigate=useNavigate();
    const [data, setData]=useState({
        entry: "",
        confirmEntry:"",
        username:"",
        currentPassword:""
    });

    useEffect(()=>{
        async function getInfo(){
            // const item=localStorage.getItem("token");
            // if (item===null){
            //   navigate("/");
            // }
            // else{
            //   const res=await axios.post("http://localhost:3000/api/verify-token", {item});
            // //   console.log(res.data.username);
            //   if (res.status!==200){
            //     navigate("/");
            //   }
            //   else{
            //     setData((prevData)=>({...prevData, username: res.data.username}));
            //   }
            // }
            try{
              const item=localStorage.getItem("token");
              const res=await axios.post("http://localhost:3000/api/verify-token", {item});
              setData((prevData)=>({...prevData, username: res.data.username}));
            }
            catch(error:any){
              const {data}=error.response;
              toast.error(data.message);
              navigate("/");
            }
          }
          getInfo();
    },[]);

    useEffect(()=>{
        // console.log(data);
    },[data]);

    const handleChange=(event:ChangeEvent<HTMLInputElement>)=>{
        const {name, value}=event.target;
        setData({...data, [name]:value});
    }

    const handleSubmit=async(event:React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        const formElement=event.currentTarget;
        const formData=new FormData(formElement);
        const currentPassword=formData.get("currentPassword");
        const entry=formData.get("entry");
        const confirmEntry=formData.get("confirmEntry");
        try{
          if (currentPassword===""||entry===""||confirmEntry===""){
            toast.error("One or more fields cannot be empty");
          }
          else{
            const passResponse=await axios.post(`${base_url}/reset-password`, {currentPassword, username:data.username, entry, confirmEntry});
            toast.success(passResponse.data.message);
            navigate("/user");
          }
        }
        catch(error:any){
          const {data}=error.response;
          toast.error(data.message);
        }
        finally{
          setData({
            entry: "",
            confirmEntry:"",
            username:"",
            currentPassword:""
          });
        }
    }
  return (
    <div className="w-1/2 border-2 border-slate-950 rounded-lg bg-slate-600 mx-auto">
      <div className="flex flex-col justify-center items-center w-full">
        <form onSubmit={handleSubmit} id="confirmForm" className="w-3/4">
          <div className="py-2">
            <p className="text-lg font-semibold">Enter current password</p>
            <input type="password" name="currentPassword" value={data.currentPassword} onChange={handleChange} placeholder="Enter current password" className="w-3/4 rounded-lg px-2 py-2 font-semibold" />
          </div>
          <div className="py-2">
            <p className="text-lg font-semibold">Enter New Password</p>
            <input type="password" name="entry" value={data.entry} onChange={handleChange} placeholder="Enter new password" className="w-3/4 rounded-lg px-2 py-2 font-semibold" />
          </div>
          <div className="py-2">
            <p className="text-lg font-semibold">Confirm New Password</p>
            <input type="password" name="confirmEntry" value={data.confirmEntry} onChange={handleChange} placeholder="Confirm new password" className="w-3/4 rounded-lg px-2 py-2 font-semibold" />
          </div>
          <br />
          <div className="flex justify-start space-x-6">
            <button type="submit" className="px-2 py- rounded-lg text-slate-950 bg-gradient-to-r from-slate-200 to-blue-500 font-semibold">Save Changes</button>
          </div>
        </form>
        <div className="w-3/4 flex justify-start py-4">
          <button onClick={()=>navigate("/user")} className="px-2 py- rounded-lg text-slate-950 bg-gradient-to-r from-slate-200 to-blue-500 font-semibold">Go Back</button>
        </div>
        <br />
      </div>
    </div>
  )
}
