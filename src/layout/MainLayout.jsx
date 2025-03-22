import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "@/lib/firebase/config";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/auth/login');
      }
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, [navigate]);
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex w-full h-[calc(100vh-64px)] overflow-hidden">
        <div className="h-full"><Sidebar /></div>
        <div className="w-full h-full overflow-y-auto">
          <main className="w-full p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
