import React from 'react'
import { Routes, Route } from 'react-router-dom'
// import ProtectedRoute from './ProtectedRoute'
import MainLayout from '../layout/MainLayout'
import SocialAccounts from '@/pages/View/Social-Accounts/SocialAccounts'
import SocialFilterInterface from '@/pages/View/Social-Search/SocialSearch'
import CampaignPage from '@/pages/View/Campaigns/CampaignPage'
import { CampaignProvider } from '@/pages/View/Campaigns/CampaignContext'
import AuthLayout from '../layout/AuthLayout'
import LoginForm from '@/components/Login'
import SignupForm from '@/components/Signup'
const AppRouter = () => {
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
        <Route index element={<SocialAccounts />} />
        <Route path="Social-Accounts" element={<SocialAccounts />} />
        <Route path="Social-Search" element={<SocialFilterInterface />} />
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