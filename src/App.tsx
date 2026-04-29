import { Routes, Route } from 'react-router-dom';
import ThemeInitializer from '@/components/layout/ThemeInitializer';
import LandingPage from '@/pages/LandingPage';
import AuthLayout from '@/components/layout/AuthLayout';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import DashboardHome from '@/pages/dashboard/DashboardHome';

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-dark-200 border border-gray-200 dark:border-dark-400">
        <span className="text-2xl">🚧</span>
      </div>
      <h1 className="mt-6 font-display text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
      <p className="mt-2 text-sm text-muted">This page will be built in the next step.</p>
    </div>
  );
}

export default function App() {
  return (
    <>
      <ThemeInitializer />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/listings" element={<PlaceholderPage title="My Listings" />} />
          <Route path="/dashboard/listings/new" element={<PlaceholderPage title="Create Listing" />} />
          <Route path="/dashboard/saved" element={<PlaceholderPage title="Saved Properties" />} />
          <Route path="/dashboard/escrow" element={<PlaceholderPage title="Escrow Transactions" />} />
          <Route path="/dashboard/messages" element={<PlaceholderPage title="Messages" />} />
          <Route path="/dashboard/notifications" element={<PlaceholderPage title="Notifications" />} />
          <Route path="/dashboard/subscription" element={<PlaceholderPage title="Subscription Plans" />} />
          <Route path="/dashboard/verification" element={<PlaceholderPage title="Get Verified" />} />
          <Route path="/dashboard/boost" element={<PlaceholderPage title="Boost Listings" />} />
          <Route path="/dashboard/settings" element={<PlaceholderPage title="Account Settings" />} />
        </Route>
        <Route path="/listings" element={<PlaceholderPage title="Browse All Listings" />} />
        <Route path="/pricing" element={<PlaceholderPage title="Pricing" />} />
        <Route path="/about" element={<PlaceholderPage title="About TetherNG" />} />
        <Route path="/contact" element={<PlaceholderPage title="Contact Us" />} />
        <Route path="/privacy" element={<PlaceholderPage title="Privacy Policy" />} />
        <Route path="/terms" element={<PlaceholderPage title="Terms of Service" />} />
        <Route path="/refund" element={<PlaceholderPage title="Refund Policy" />} />
      </Routes>
    </>
  );
}
