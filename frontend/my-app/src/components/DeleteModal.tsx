import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRef } from "react"
import { toast } from "react-toastify";
import { base_url } from "../constants/links";

export default function DeleteModal({product_id}:{product_id:string}) {
    const queryClient=useQueryClient();
    const deleteProductDialog=useRef<HTMLDialogElement>(null);
    function handleClose(){
        if (deleteProductDialog.current){
            deleteProductDialog.current.close();
        }
    }

    const handleProductDelete=async()=>{
        try{
            const res=await axios.post(`${base_url}/delete-product`, {product_id});
            queryClient.invalidateQueries({queryKey: ["products"]});
            toast.success(res.data.message);
        }
        catch(error:any){
            const {data}=error.response;
            toast.error(data.message);
        }
        finally{
            handleClose();
        }
    }

    const openDeleteDialog=()=>{
        if (deleteProductDialog.current){
            deleteProductDialog.current.showModal();
        }
    }
  return (
    <>
        <button onClick={openDeleteDialog} className='px-4 py-1 rounded-lg text-slate-200 bg-rose-600 font-semibold'>Delete</button>
        <dialog ref={deleteProductDialog} className="py-10 px-8">
            <p className="font-semibold text-2xl">Are You sure you want to delete this product?</p>
            <div className="space-x-6 mt-4">
                <button onClick={handleProductDelete} className="px-2 py-1 rounded-lg border-2 border-slate-950 font-semibold bg-slate-950 text-slate-200">Confirm</button>
                <button onClick={handleClose} className="px-2 py-1 rounded-lg border-2 border-slate-950 font-semibold">Cancel</button>
            </div>
        </dialog>
    </>
  )
}
