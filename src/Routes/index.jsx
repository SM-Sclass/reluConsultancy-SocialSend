import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
// import ProtectedRoute from './ProtectedRoute'
import MainLayout from '../layout/MainLayout'
import SocialAccounts from '@/pages/View/Social-Accounts/SocialAccounts'
import SocialSearch from '@/pages/View/Social-Search/SocialSearch'
import CampaignPage from '@/pages/View/Campaigns/CampaignPage'
import { CampaignProvider } from '@/pages/View/Campaigns/CampaignContext'
import AuthLayout from '../layout/AuthLayout'
import LoginForm from '@/components/Login'
import SignupForm from '@/components/Signup'
import { FilterProvider } from '@/pages/View/Social-Search/FilterContext'

const AppRouter = () => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleCloseToast = () => {
    setToast(null);
  };
  return (
    <Routes>
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginForm />} />
        <Route path="signup" element={<SignupForm />} />
      </Route>
      <Route path="/" element={
        // <ProtectedRoute>
        <MainLayout />
        // {/* </ProtectedRoute> */}
      }>
        <Route path="Social-Accounts" element={<SocialAccounts />} />
        <Route path="Social-Search" element={
          <FilterProvider showToast={showToast} >
            <SocialSearch handleCloseToast={handleCloseToast} toast={toast}/>
          </FilterProvider>
        } />
        <Route path="Campaigns" element={
          <CampaignProvider>
            <CampaignPage />
          </CampaignProvider>
        } />
      </Route>
    </Routes>
  )
}

export default AppRouter