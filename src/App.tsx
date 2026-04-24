import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/features/auth/AuthContext'
import { useUIStore } from '@/store/useUIStore'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// Lazy loaded components
const LoginPage = lazy(() => import('@/features/auth/LoginPage'))
const DashboardLayout = lazy(() => import('@/layouts/DashboardLayout'))
const DashboardHome = lazy(() => import('@/features/dashboard/DashboardHome'))
const AnalyticsPage = lazy(() => import('@/features/analytics/AnalyticsPage'))
const UserManagement = lazy(() => import('@/features/users/UserManagement'))
const SettingsPage = lazy(() => import('@/features/settings/SettingsPage'))
const NotFoundPage = lazy(() => import('@/components/NotFoundPage'))

// Route Progress Wrapper
const RouteProgress = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    NProgress.start()
    return () => {
      NProgress.done()
    }
  }, [])
  return <>{children}</>
}

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (allowedRoles && user && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />

  return <>{children}</>
}

function AppRoutes() {
  const { theme } = useUIStore()

  useEffect(() => {
    // Initial theme setup
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center">Loading Application...</div>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={
            <RouteProgress>
              <DashboardHome />
            </RouteProgress>
          } />
          <Route path="analytics" element={
            <RouteProgress>
              <AnalyticsPage />
            </RouteProgress>
          } />
          <Route path="users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <RouteProgress>
                <UserManagement />
              </RouteProgress>
            </ProtectedRoute>
          } />
          <Route path="settings" element={
            <RouteProgress>
              <SettingsPage />
            </RouteProgress>
          } />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
