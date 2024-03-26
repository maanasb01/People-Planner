import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar';


export default function LandingPage() {

    useEffect(() => {
        document.body.classList.add("bg-gray-900");
    
        return () => {
          document.body.classList.remove("bg-gray-900");
        };
      });
  return (
    <>

        <Navbar />

        <Outlet/>
      
    </>
  )
}
