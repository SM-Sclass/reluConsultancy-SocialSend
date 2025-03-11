import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/SidebarContext";

const MainLayout = () => {
  return (
    <SidebarProvider>
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
    </SidebarProvider>
  );
};

export default MainLayout;
