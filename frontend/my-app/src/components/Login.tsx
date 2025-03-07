import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { base_url } from "../constants/links";


export default function Login() {

  const navigate=useNavigate();
    const [data, setData]=useState({
        username: "",
        userPassword: ""
    });

    const handleValueChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
        const {name, value}=event.target;
        setData({...data, [name]:value});
    }

    const handleSubmit=async(event: React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        const formElement=event.currentTarget;
        const formData=new FormData(formElement);
        const username=formData.get("username");
        const password=formData.get("userPassword");
        try{
          const response=await axios.post(`${base_url}/login`, {username, password});
          localStorage.setItem("token", response.data.token);
          // console.log(response.data.data);
          if (response.data.role==="ADMIN"){
            navigate("/admin");
          }
          else if (response.data.role==="USER"){
            navigate("/user");
          }
          else{
            navigate("/");
          }
      }
      catch(error: any){
        const {data}=error.response;
          // console.log(data.message);
          toast.error(data.message);
      }
      finally{
        setData({
          username: "",
          userPassword: ""
      });
      }
    }
  return (
    <div className="w-1/2 border-2 border-slate-950 rounded-lg bg-slate-600 mx-auto">
    <div className="flex flex-col justify-center items-center w-full">
    <p className="text-2xl animate-pulse font-semibold py-4">Login</p>
      <form onSubmit={handleSubmit} id="userform" className="w-3/4">
        <div className="py-2">
          <p className="text-lg font-semibold">Enter username</p>
          <input type="text" placeholder='Enter Username' id="username" name="username" value={data.username} required autoComplete="off" onChange={handleValueChange} className="w-3/4 rounded-lg px-2 py-2 font-semibold"/>
        </div>
        <div className="py-2">
          <p className="text-lg font-semibold">Enter Password</p>
          <input type="password" name="userPassword" id="userPassword" value={data.userPassword} placeholder="Enter Password" required autoComplete="off" onChange={handleValueChange} className="w-3/4 rounded-lg px-2 py-2 font-semibold" />
        </div>
        <br />
        <button type='submit' className="bg-emerald-700 px-2 py-1 rounded-lg font-semibold">Submit</button>
      </form>
      <p className="font-semibold">New User? <Link to={"/sign-up"} className="text-blue-800 hover:underline">Sign-up</Link></p>
      <Link to={"/forgot-password"} className="text-slate-200 hover:underline font-semibold pb-4">Forgot Password?</Link>
    </div>
    </div>
  )
}
