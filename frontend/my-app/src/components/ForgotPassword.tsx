import axios from "axios";
import { useState } from "react"
import { base_url } from "../constants/links";

export default function ForgotPassword() {
  const [mail, setMail]=useState("");
  const handleChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
    setMail(event.target.value);
  }

  const handleSubmit=async(event:React.FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    const formElement=event.currentTarget;
    const formData=new FormData(formElement);
    const email=formData.get("user-mail");
    const res=await axios.post(`${base_url}/reset-password`,{email});
    if (res.status!==200){
      alert("Invalid email");
    }
    else{}
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <p>Enter your registered email</p>
        <input type="email" name="user-email" id="user-mail" value={mail} onChange={handleChange} />
        <br />
        <button>Send Reset Email</button>
      </form>
    </div>
  )
}
