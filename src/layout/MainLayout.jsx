import React, {useState, useEffect} from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "@/lib/firebase/config";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { SidebarProvider } from "@/components/SidebarContext";

const MainLayout = () => {
  const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          navigate('/auth/login');
        }
        setLoading(false);
      });
      
      // Clean up the listener on unmount
      return () => unsubscribe();
    }, [navigate]);
  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen overflow-hidden">
        <Navbar />
        <div className="flex w-full h-[calc(100vh-64px)] overflow-hidden">
          <div className="h-full"><Sidebar /></div>
          <div className="w-full h-full overflow-y-auto">
            <main className="w-full p-4">
              { loading ? (
                <Skeleton className="h-32 w-full" />
              ) : <Outlet /> }
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
