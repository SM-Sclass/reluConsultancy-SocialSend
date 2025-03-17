import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { BellIcon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { signOut } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from "@/lib/firebase/config";
import Logo from "../assets/Social Send.svg";
import { useTheme } from "./theme-provider";
import { useSidebar } from "./SidebarContext";

const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Team", href: "#", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { toggleSidebar, toggleCollapse } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  // Detect if we're on mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640); // 640px is sm breakpoint in Tailwind
    };

    // Check initially
    checkIsMobile();

    // Add resize listener
    window.addEventListener('resize', checkIsMobile);

    // Clean up
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleSidebarToggle = () => {
    if (isMobile) {
      toggleSidebar();
    } else {
      toggleCollapse();
    }
  };
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogOut = async() => {
    try {
      const user = auth.currentUser;
    
    if (user) {
      // Log logout event in Firestore
      await addDoc(collection(db, 'userLogs'), {
        userId: user.uid,
        email: user.email,
        event: 'logout',
        timestamp: serverTimestamp()
      });
    }
    
    // Sign out the user
    await signOut(auth);
    navigate('/auth/login')
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  return (
    <Disclosure as="nav" className="bg-muted border border-border">
      <div className="mx-auto max-w-full w-full px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
          
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-[open]:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-[open]:block"
              />
            </DisclosureButton>
          </div> */}
          <div className="flex gap-10 items-center justify-start sm:items-stretch sm:justify-start">
            <div className="flex items-center justify-start"
              onClick={handleSidebarToggle}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
                viewBox="0 0 18 18"
                fill="none"
                className="text-foreground"
                aria-label={isMobile ? "Toggle sidebar" : "Collapse sidebar"}
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
            </div>
            <div className="flex shrink-0 items-center">
              <img alt="Your Company" src={Logo} className="h-10 w-auto" />
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 ">
            {/* Theme toggle button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="relative rounded-full p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-background border-0"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">Toggle theme</span>
              {theme === "dark" ? (
                <SunIcon aria-hidden="true" className="size-6" />
              ) : (
                <MoonIcon aria-hidden="true" className="size-6" />
              )}
            </button>

            <button
              type="button"
              className="relative rounded-full p-1 ml-3 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-background border-0"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="size-6" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-accent text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 p-0 border-0">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt=""
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    className="size-8 rounded-full"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-popover py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-popover-foreground data-[focus]:bg-accent data-[focus]:outline-none"
                  >
                    Your Profile
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-popover-foreground data-[focus]:bg-accent data-[focus]:outline-none"
                  >
                    Settings
                  </a>
                </MenuItem>
                <MenuItem>
                  <div
                    className="block px-4 py-2 text-sm text-popover-foreground data-[focus]:bg-accent data-[focus]:outline-none"
                    onClick={handleLogOut}
                  >
                    Sign out
                  </div>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={classNames(
                item.current
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-secondary hover:text-secondary-foreground",
                "block rounded-md px-3 py-2 text-base font-medium border-0"
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
