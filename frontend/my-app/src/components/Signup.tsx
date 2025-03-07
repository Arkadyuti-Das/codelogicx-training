import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { base_url } from "../constants/links";

export default function Signup() {
    const navigate=useNavigate();
    const [data, setData]=useState({
        username: "",
        userPassword: "",
        useremail: ""
    });

    const handleValueChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
        const {name, value}=event.target;
        setData({...data, [name]:value});
    }

    const handleSubmit=async(event: React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        setData({
            username: "",
            userPassword: "",
            useremail: ""
        });
        const formElement=event.currentTarget;
        const formData=new FormData(formElement);
        const username=formData.get("username");
        const password=formData.get("userPassword");
        const email=formData.get("useremail");
        try{
            const checkOkay=await axios.post(`${base_url}/signup`, {username, password, email});
            toast.success(checkOkay.data.message);
            if (checkOkay.status===200){
                const response=await axios.post(`${base_url}/login`, {username, password});
                localStorage.setItem("token", response.data.token);
                navigate("/user");
            }
            else{
                alert(checkOkay.data.message);
            }
        }
        catch(error:any){
            const {data}=error.response;
            // console.log(data.message);
            toast.error(data.message);
        }
    }
  return (
    <div className="w-1/2 border-2 border-slate-950 rounded-lg bg-slate-600 mx-auto">
        <div className="flex flex-col justify-center items-center w-full">
            <p className="text-2xl animate-pulse font-semibold py-4">Sign up</p>
            <form onSubmit={handleSubmit} id="userform" className="w-3/4">
                <div className="py-2">
                    <p className="text-lg font-semibold">Enter username</p>
                    <input type="text" placeholder='Enter Username' id="username" name="username" value={data.username} onChange={handleValueChange} className="w-3/4 rounded-lg px-2 py-2 font-semibold" required autoComplete="off"/>
                </div>
                <div className="py-2">
                    <p className="text-lg font-semibold">Enter Password</p>
                    <input type="password" name="userPassword" id="userPassword" value={data.userPassword} placeholder="Enter Password" onChange={handleValueChange} className="w-3/4 rounded-lg px-2 py-2 font-semibold" required autoComplete="off"/>
                </div>
                <div className="py-2">
                    <p className="text-lg font-semibold">Enter Email</p>
                    <input type="email" name="useremail" id="useremail" placeholder="Enter Password" value={data.useremail} onChange={handleValueChange} className="w-3/4 rounded-lg px-2 py-2 font-semibold" required autoComplete="off"/>
                </div>
                <br />
                <button type='submit' className="bg-emerald-700 px-2 py-1 rounded-lg font-semibold">Submit</button>
            </form>
        <p className="pb-4 font-semibold">Existing User? <Link to={"/"} className="text-violet-950 hover:underline">Login</Link></p>
        </div>
    </div>
  )
}
