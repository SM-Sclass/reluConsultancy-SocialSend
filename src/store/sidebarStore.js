import {useState, useEffect} from 'react';
import { Store,useStore } from '@tanstack/react-store';

const isMobileDevice = () => window.innerWidth < 768;
// Define the initial state
const initialState = {
  isOpen: false,
  isCollapsed: false, // Initialize based on screen size
  isMobile: isMobileDevice(),
};

// Create the store
export const sidebarStore = new Store(initialState);

// Define actions to update the store
export const toggleSidebar = () => {
  sidebarStore.setState((state) => ({ ...state, isOpen: !state.isOpen }));
};

export const toggleCollapse = () => {
  sidebarStore.setState((state) => ({ ...state, isCollapsed: !state.isCollapsed }));
};

export const closeSidebar = () => {
  sidebarStore.setState((state) => ({ ...state, isOpen: false }));
}

// Create a custom hook to access the store
export const useSidebar = () => {
  const {isOpen, isMobile, isCollapsed} = useStore(sidebarStore);
  const [isMobileScreen, setIsMobileScreen] = useState(isMobile);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(isMobileDevice());
      sidebarStore.setState((state) => ({ ...state, isCollapsed: isMobileDevice() })); // Update store on resize
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    isOpen,
    isCollapsed,
    isMobileScreen,
    toggleSidebar,
    toggleCollapse,
    closeSidebar
  };
};