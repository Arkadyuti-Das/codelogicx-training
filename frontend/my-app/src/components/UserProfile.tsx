import { Link } from "react-router-dom";
import Logout from "./Logout";
import ProductWorkspace from "./ProductWorkspace";

export default function UserProfile(props:any) {
  return (
    <>
    <div className="flex">
      <div className="w-[20dvw] h-dvh bg-slate-950">
        <div className="border-b-2 border-slate-200 rounded-full h-fit py-6 flex flex-col justify-center items-center space-y-4">
          <p className="text-slate-200 font-semibold text-xl animate-pulse">Welcome</p>
          <p className="text-lime-600 font-semibold text-xl">{props.loggedIn}</p>
          <Logout className="text-slate-200 bg-indigo-600 px-2 py-1 rounded-lg font-semibold hover:shadow-lg hover:shadow-indigo-400"/>
          <button className="text-slate-200 bg-rose-600 px-2 py-1 rounded-lg font-semibold hover:shadow-lg hover:shadow-rose-400">
            <Link to={"/reset-password"}>Reset Password</Link>
          </button>
        </div>
      </div>
      <div className="w-[80dvw] h-dvh">
        {/* right div */}
        <ProductWorkspace/>
      </div>
    </div>
    </>
  )
}
