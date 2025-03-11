// src/layouts/AuthLayout.jsx
import { Outlet } from 'react-router-dom';
import Logo from "../assets/Social Send.svg";
const AuthLayout = () => {
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
        <Outlet />
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