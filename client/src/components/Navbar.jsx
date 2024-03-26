import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const navlinksStyle = ({ isActive }) =>
    `  ${isActive ? "text-white font-bold" : "text-gray-300"} block py-2 px-3 md:p-0 `;
  return (
    <>
   
      <nav className="bg-gray-900 border-gray-700">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            to={'/'}
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <span className="self-center text-2xl font-semibold font-sans whitespace-nowrap text-white">
              People Planner
            </span>
          </Link>
          
          <div
            className="hidden w-full md:block md:w-auto"
            id="navbar-multi-level"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border  rounded-lg  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0  bg-gray-800 md:bg-gray-900 border-gray-700">
              <li>
                <NavLink
                  to={'/login'}
                 className={navlinksStyle}
                >
                  Login
                </NavLink>
              </li>
              
              <li>
                <NavLink
                  to={"/signup"}
                  className={navlinksStyle}
                >
                  Sign Up
                </NavLink>
              </li>
              
              
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
