import React, { useEffect, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useSidebar } from "../store/sidebarStore";
import CampaignLogo from '../assets/campaign.svg';
import SocialSearchLogo from '../assets/socialsearch.svg';
import SocialAccountLogo from '../assets/socialaccount.svg';


const routes = [
  {
    name: 'Social Accounts',
    path: '/Social-Accounts',
    icon: (
      <img src={SocialAccountLogo} alt="Campaigns" width={22} height={22} />
    )
  },
  {
    name: 'Social Search',
    path: '/Social-Search',
    icon: (
      <img src={SocialSearchLogo} alt="Campaigns" width={25} height={25} />
    )
  },
  {
    name: 'Campaigns',
    path: '/Campaigns',
    icon: (
      <img src={CampaignLogo} alt="Campaigns" width={25} height={25} />
    )
  },
  // {
  //   name: 'Messages',
  //   path: '/messages',
  //   icon: (
  //     <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
  //       <path fillRule="evenodd" clipRule="evenodd" d="M3.65931 16.6744C1.8711 14.994 0.753906 12.6079 0.753906 9.96299C0.753906 4.88037 4.88053 0.753754 9.96314 0.753754C15.046 0.753754 19.1724 4.88037 19.1724 9.96299C19.1724 12.6079 18.0555 14.994 16.2673 16.6744C14.619 18.223 12.4012 19.1722 9.96314 19.1722C7.52542 19.1722 5.30725 18.223 3.65931 16.6744ZM9.96314 13.024C9.15361 13.024 8.41717 12.7081 7.86962 12.1938C7.27522 11.6351 6.90243 10.8424 6.90243 9.96299C6.90243 9.28548 6.35224 8.73529 5.67444 8.73529C4.99693 8.73529 4.44674 9.28548 4.44674 9.96299C4.44674 11.5476 5.11658 12.9768 6.1878 13.9832C7.17503 14.9109 8.50322 15.4797 9.96314 15.4797C10.6409 15.4797 11.1911 14.9295 11.1911 14.2517C11.1911 13.5742 10.6409 13.024 9.96314 13.024ZM19.6607 16.4463L24.3905 21.1762C24.87 21.6559 24.87 22.4333 24.3905 22.9128L22.9094 24.3939C22.4296 24.8737 21.6522 24.8737 21.1728 24.3939L16.442 19.6632C16.9772 19.3048 17.4811 18.9035 17.9491 18.4641C18.5924 17.8594 19.1674 17.1824 19.6607 16.4463Z" fill="url(#paint0_linear_2885_1815)" />
  //       <defs>
  //         <linearGradient id="paint0_linear_2885_1815" x1="24.7501" y1="4.50375" x2="-2.91846" y2="13.6767" gradientUnits="userSpaceOnUse">
  //           <stop stopColor="#CB62FF" />
  //           <stop offset="0.729" stopColor="#4A5FFF" />
  //         </linearGradient>
  //       </defs>
  //     </svg>
  //   )
  // },
  // {
  //   name: 'How it Works',
  //   path: '/how-it-works',
  //   icon: (
  //     <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
  //       <path fillRule="evenodd" clipRule="evenodd" d="M3.65931 16.6744C1.8711 14.994 0.753906 12.6079 0.753906 9.96299C0.753906 4.88037 4.88053 0.753754 9.96314 0.753754C15.046 0.753754 19.1724 4.88037 19.1724 9.96299C19.1724 12.6079 18.0555 14.994 16.2673 16.6744C14.619 18.223 12.4012 19.1722 9.96314 19.1722C7.52542 19.1722 5.30725 18.223 3.65931 16.6744ZM9.96314 13.024C9.15361 13.024 8.41717 12.7081 7.86962 12.1938C7.27522 11.6351 6.90243 10.8424 6.90243 9.96299C6.90243 9.28548 6.35224 8.73529 5.67444 8.73529C4.99693 8.73529 4.44674 9.28548 4.44674 9.96299C4.44674 11.5476 5.11658 12.9768 6.1878 13.9832C7.17503 14.9109 8.50322 15.4797 9.96314 15.4797C10.6409 15.4797 11.1911 14.9295 11.1911 14.2517C11.1911 13.5742 10.6409 13.024 9.96314 13.024ZM19.6607 16.4463L24.3905 21.1762C24.87 21.6559 24.87 22.4333 24.3905 22.9128L22.9094 24.3939C22.4296 24.8737 21.6522 24.8737 21.1728 24.3939L16.442 19.6632C16.9772 19.3048 17.4811 18.9035 17.9491 18.4641C18.5924 17.8594 19.1674 17.1824 19.6607 16.4463Z" fill="url(#paint0_linear_2885_1815)" />
  //       <defs>
  //         <linearGradient id="paint0_linear_2885_1815" x1="24.7501" y1="4.50375" x2="-2.91846" y2="13.6767" gradientUnits="userSpaceOnUse">
  //           <stop stopColor="#CB62FF" />
  //           <stop offset="0.729" stopColor="#4A5FFF" />
  //         </linearGradient>
  //       </defs>
  //     </svg>
  //   )
  // }
];

const Sidebar = () => {
  const { isOpen, isCollapsed, isMobileScreen, closeSidebar } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the sidebar is open and the click is outside the sidebar's content
      if (isOpen &&
        isMobileScreen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        event.target.closest('aside')) {
        closeSidebar();
      }
    };

    // Add the event listener when the component mounts and sidebar is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener when the component unmounts or sidebar closes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isMobileScreen, closeSidebar]);

  const handleRouteChange = (path) => {
    navigate(path);
    if (isMobileScreen) {
      closeSidebar();
    }
  }

  return (
    <aside
      className={` ${isMobileScreen ? 'w-full' : isCollapsed ? 'sm:w-19' : 'sm:w-[20vw]'} h-full transition-all duration-300 sm:max-w-64
      ${isOpen ? 'translate-x-0 shadow-lg sm:shadow-none' : '-translate-x-full'} sm:translate-x-0 sm:block fixed sm:relative
      left-0 z-40 
      `
      }
      aria-label="Sidebar"
    >
      <div
        ref={sidebarRef}
        className="h-full overflow-y-auto bg-background max-w-64">
        <ul className="font-medium">
          {routes.map((route, index) => (
            <li key={index}>
              <Link
                to={route.path}
                onClick={() => handleRouteChange(route.path)}
                className={`flex items-center justify-start p-3 sm:p-5 hover:bg-indigo-400/20 dark:hover:bg-gray-700 group 
                  ${location.pathname === route.path ? 'bg-indigo-300/10 text-primary font-bold border-l-6 border-[#4A5FFF]' : 'ml-2 text-neutral-600 dark:text-neutral-400 hover:text-primary hover:dark:text-primary'}`}
              >
                {route.icon}
                {(!isCollapsed || isMobileScreen) && <span className="ml-3 text-start">{route.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;