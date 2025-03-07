import { useRef } from "react"

export default function ImageModal({imagePath}:{imagePath:string}) {
    const imageRef=useRef<HTMLDialogElement>(null);

    const handleImageOpen=()=>{
        if (imageRef.current){
            // console.log(imagePath);
            imageRef.current.showModal();
        }
    }

    function handleClose(){
        if (imageRef.current){
            imageRef.current.close();
        }
    }
  return (
    <>
        <button onClick={handleImageOpen} className="h-10 w-10 rounded-full my-2 mx-auto bg-center bg-cover"
        style={{ backgroundImage: `url(${imagePath})` }} ></button>
        <dialog ref={imageRef} className="w-1/2 h-1/2">
        <div className="w-full h-full flex flex-col justify-center items-center">
            <img src={imagePath} alt="Preview Image" className="w-3/4 h-3/4 object-contain"/>
            <div className="mt-4">
                <button onClick={handleClose} className="border-2 border-slate-950 rounded-lg px-2 font-semibold">Close</button>
            </div>
        </div>
        </dialog>
    </>
  )
}
