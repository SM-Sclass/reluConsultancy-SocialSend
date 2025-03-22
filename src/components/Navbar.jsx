import { useNavigate } from "react-router-dom";
import Avatar from "react-avatar";
import { ChevronDown, LogOut, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { signOut } from 'firebase/auth';
import { auth } from "@/lib/firebase/config";
import Logo from "../assets/Social Send.svg";
import LogoDrk from "../assets/Social Send Drk.svg";
import { useTheme } from "./theme-provider";
import { useSidebar } from "../store/sidebarStore";
import { Button } from "./ui/button";

export default function Navbar() {
  const user = auth.currentUser;
  const { theme, setTheme } = useTheme();
  const { isOpen, toggleSidebar, toggleCollapse, isMobileScreen, closeSidebar } = useSidebar();
  const navigate = useNavigate();
  // Detect if we're on mobile
  const handleSidebarToggle = () => {
    console.log('close sidebar1', isOpen, isMobileScreen)
    if (isMobileScreen && !isOpen) {

      toggleSidebar();
    }
    else if (isMobileScreen && isOpen) {
      console.log('close sidebar')
      closeSidebar();
    }
    else {
      toggleCollapse();
    }
  };
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogOut = async () => {
    try {
      // Sign out the user
      await signOut(auth);
      navigate('/auth/login')
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  return (
      <div className="mx-auto max-w-full w-full px-2 sm:px-4 ">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex gap-10 items-center justify-start sm:items-stretch sm:justify-start">
            <Button className="flex items-center justify-start cursor-pointer"
              onClick={handleSidebarToggle}
              variant="ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
                viewBox="0 0 18 18"
                fill="none"
                className="text-foreground"
                aria-label={isMobileScreen ? "Toggle sidebar" : "Collapse sidebar"}
              >
                <path d="M18 15.75H0V18H18V15.75Z" fill="currentColor" />
                <path d="M18 0H0V2.25H18V0Z" fill="currentColor" />
                <path
                  d="M18 5.28748H9.67505V7.53748H18V5.28748Z"
                  fill="currentColor"
                />
                <path
                  d="M18 10.4625H9.67505V12.7125H18V10.4625Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 4.5V13.3875L6.8625 8.8875L0 4.5Z"
                  fill="currentColor"
                />
              </svg>
            </Button>
            <div className="flex shrink-0 items-center ">
              <img alt="Your Company" src={theme === 'dark' ? LogoDrk : Logo} className="h-10 w-auto" />
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 ">
            {/* Theme toggle button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="relative rounded-full p-1 text-muted-foreground hover:text-foreground bg-background border-0"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">Toggle theme</span>
              {theme === "dark" ? (
                <SunIcon aria-hidden="true" className="size-6" />
              ) : (
                <MoonIcon aria-hidden="true" className="size-6" />
              )}
            </button>


            {/* Profile dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="gap-2 ml-2 p-2 cursor-pointer flex items-center">
                  {user?.photoURL ? (
                    <img
                      alt="User Avatar"
                      src={user.photoURL}
                      className="size-8 rounded-full"
                    />
                  ) : (
                    <Avatar
                      name={user?.displayName || "Social Send"}
                      size="32"
                      round={true}
                      className="size-8"
                    />
                  )}
                  <span className="hidden sm:inline">{user?.displayName || ''}</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/profile')}>
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500"
                  onClick={handleLogOut}
                >
                  <div className="flex items-center gap-2 cursor-pointer">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

  );
}
