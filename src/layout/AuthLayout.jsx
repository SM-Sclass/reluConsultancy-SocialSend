// src/layouts/AuthLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { Skeleton } from '@/components/ui/skeleton';
import Logo from "../assets/Social Send.svg";
import { auth } from '@/lib/firebase/config';


const AuthLayout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/Social-Accounts');
      }
      setLoading(false);
    });
    
    // Clean up the listener on unmount
    return () => unsubscribe();
  }, [navigate]);
  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <header className="py-4 bg-secondary shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="flex items-center">
              <img src={Logo} alt="Social Send Logo" className="h-10" />
            </div>
          </div>
        </div>
      </header>

      
      <main className="flex-1 flex items-center justify-center p-4">
        {loading ? (
          <div className="h-32 space-y-3">
            <Skeleton className="h-32 w-full" />
            <div className='space-y-2'>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
        ) 
        : (<Outlet />)}
      </main>

   
      <footer className="py-4 bg-white border-t">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Social Send. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;