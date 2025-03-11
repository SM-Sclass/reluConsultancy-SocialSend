import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './components/theme-provider';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const AppWrapper = () => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
      <App />
    </ThemeProvider>
    </QueryClientProvider>
  )
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWrapper/>
  </React.StrictMode>
);
