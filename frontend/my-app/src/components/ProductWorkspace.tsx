import { useRef } from "react";
import DataTable from "./DataTable";
import ProductModal from "./ProductModal";

export default function ProductWorkspace() {
  const modalRef=useRef<HTMLDialogElement|null|any>(null);
  const handleModalOpen=()=>{
    if (modalRef.current){
      modalRef.current?.handleParentOpen();
    }
  }
  return (
    <div className="w-full h-full">
      <div className="flex justify-around">
        <p className="text-slate-900 font-semibold text-center text-4xl py-2">Products Info</p>
        <div className="flex flex-col justify-center items-center relative">
          <div className="absolute invisible">
            <ProductModal ref={modalRef} submitText="Create Product"/>
          </div>
        <button className="bg-slate-200 text-slate-950 font-semibold px-2 py-1 rounded-lg hover:shadow-lg hover:shadow-slate-400" onClick={handleModalOpen}>Create Product</button>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center">
        <DataTable/>
      </div>
    </div>
  )
}
