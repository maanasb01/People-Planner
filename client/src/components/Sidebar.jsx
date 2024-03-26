import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLoading } from "../contexts/LoadingContext";
import { HOST } from "../config/config";
import menuIcon from "../assets/menu.svg";
import userDummyImg from "../assets/user.svg";

export default function Sidebar() {
  const { user, setUser } = useAuth();
  const { fetchWithLoader } = useLoading();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  async function handleLogout() {
    try {
      const response = await fetchWithLoader(`${HOST}/auth/logout`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) {
        if (data.success) {
          setUser(null);
          navigate("/login", { replace: true });
        }
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("An error occurred while logging out:", error.message);
    }
  }
  return (
    <>
      <div
        className={`w-3/6 text-center rounded-lg space-y-2 lg:w-1/6 h-screen flex flex-col bg-slate-700 p-4 duration-300 absolute z-10 ${
          isSidebarOpen ? " translate-x-0" : " -translate-x-full"
        }`}
      >
       {/* Sidebar Closing Button */}
        <button
          className="h-6 w-6 absolute right-2 top-2 cursor-pointer"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <img src={menuIcon} alt="X" />
        </button>
        <div className=" rounded-full border h-28 w-28 mx-auto">
          <img src={userDummyImg} alt="" className="rounded-full" />
        </div>
        <div className="mx-auto text-base  mt-2 flex flex-col">
          <p>{user.name}</p>
          <p>{user.email}</p>
        </div>
        <div>
          <p className={`${user?.isActive?"text-teal-400":"text-red-500"}`}>{user?.isActive?"Active":"Not Active"}</p>
        </div>
        <div className=" mt-4">
          <button
            onClick={handleLogout}
            className=" bg-purple-600 hover:bg-purple-700 active:bg-purple-500 px-2 py-1 rounded-md"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Sidebar Closing Button */}
      <div
        className={`h-6 w-6 absolute top-2 left-2 cursor-pointer opacity-0 scale-0 transition-all duration-300  ${
          !isSidebarOpen ? "opacity-100 scale-100" : ""
        }`}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <img src={menuIcon} alt="X" />
      </div>
    </>
  );
}
