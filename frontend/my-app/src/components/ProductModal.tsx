import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ChangeEvent, FormEvent, Ref, useImperativeHandle, useRef, useState } from "react"
import { toast } from "react-toastify";
import { base_url } from "../constants/links";


export default function ProductModal({ref, buttonText, submitText, className, product_id, product_name, product_price, product_description}:{ref?:Ref<any>, buttonText?:string, submitText?:string, className?:string, product_id?:string, product_name?:string, product_price?:string, product_description?:string}) {
  const [data, setData]=useState({productName: "", productPrice: "", productDescription: ""});
  const [isNew, setIsNew]=useState(true);
  const productDialog=useRef<HTMLDialogElement|null>(null);

  const queryClient=useQueryClient();

  const handleChange=(event:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>{
    const {name, value}=event.target;
    setData((prev) => ({...prev, [name]:value}));
  }
  

  const handleSubmit=async(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    const formElement=event.currentTarget;
    const formData=new FormData(formElement);
    const productName=formData.get("productName");
    const productPrice=formData.get("productPrice");
    const productDescription=formData.get("productDescription");
    const productImage=formData.get("productImage");
    try{
      if (isNew){
        const res=await axios.post(`${base_url}/create-product`, {productName, productPrice, productDescription, productImage}, {
          headers:{
            "Content-Type": "multipart/form-data"
          }
        });
        queryClient.invalidateQueries({queryKey: ["products"]});
        toast.success(res.data.message);
      }
      else{
        const res=await axios.post(`${base_url}/update-product`, {product_id, productName, productPrice, productDescription, productImage},{
          headers:{
            "Content-Type":"multipart/form-data"
          }
        });
        queryClient.invalidateQueries({queryKey: ["products"]});
        toast.success(res.data.message);
      }
    }
    catch(error:any){
      const {data}=error.response;
      // console.log(data.message);
      toast.error(data.message);
    }
    finally{
      productDialog.current?.close();
      formElement.reset();
      setData({productName: "", productPrice: "", productDescription: ""});
    }
  }

  const handleModalOpenFromOwn=()=>{
    if (productDialog.current){
      setData({productName: product_name??"", productPrice: product_price?.toString()??"", productDescription: product_description??""});
      setIsNew(false);
      productDialog.current?.showModal();
      // console.log("own open")
      //set input values with the values passed as props
    }
  }

  const handleClose=()=>{
    if (productDialog.current){
      productDialog.current.close();
      setData({productName: "", productPrice: "", productDescription: ""});
    }
  }

  useImperativeHandle(ref, ()=>{
    return {
      handleParentOpen:()=>{
        if (productDialog.current){
          setData({productName: "", productPrice: "", productDescription: ""});
          productDialog.current.showModal();
          setIsNew(true);
          // console.log("Parent open")
        }
      }
    }
  })



  return (
      <div>
        <button onClick={handleModalOpenFromOwn} className={className}>{buttonText}</button>
        <dialog ref={productDialog} className="border-2 border-slate-950 rounded-xl px-4 py-4">     
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="flex flex-col justify-center items-center">
            <p className="font-semibold text-slate-800 text-xl">Product Name</p>
            <input placeholder="Enter Product Name" required autoComplete="off" name="productName" value={data.productName} onChange={handleChange} className="border-2 border-slate-900 rounded-xl px-2 py-2 font-semibold" />
          </div>
          <div className="flex flex-col justify-center items-center">
            <p className="font-semibold text-slate-800 text-xl">Price</p>
            <input type="text" placeholder="Enter Price" name="productPrice" required autoComplete="off" value={data.productPrice} onChange={handleChange} className="border-2 border-slate-900 rounded-xl px-2 py-2 font-semibold" />
          </div>
          <div className="col-span-2 col-start-1 flex flex-col justify-center items-center">
            <p className="font-semibold text-slate-800 text-xl">Product Description</p>
            <textarea name="productDescription" required autoComplete="off" rows={4} value={data.productDescription} onChange={handleChange} className="w-full border-2 border-slate-900 rounded-xl px-2 py-2 font-semibold"></textarea>
          </div>
          <div className="col-span-2 col-start-1 flex flex-col justify-center items-center">
            <p className="font-semibold text-slate-800 text-xl">Product Image</p>
            <input type="file" name="productImage" accept="image/png, image/jpeg, image/jpg" className="border-2 border-slate-900 rounded-xl" />
          </div>
          <div className="flex flex-col justify-center items-center col-span-2 col-start-1">
            <button type="submit" className="bg-blue-600 px-2 py-1 rounded-lg text-slate-200 font-semibold text-lg hover:shadow-lg hover:shadow-blue-500">{submitText}</button>
          </div>
        </form>
        <div className="flex flex-col justify-center items-center">
          <button onClick={handleClose} className="bg-rose-600 px-4 py-1 rounded-lg text-slate-200 font-semibold text-lg hover:shadow-lg hover:shadow-rose-500 my-4">Close</button>
        </div>
      </dialog>
      </div>
  )
}
