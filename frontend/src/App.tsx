import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate
} from 'react-router-dom'
import {
  AuthenticateWithRedirectCallback,
  SignedIn,
  SignedOut
} from '@clerk/clerk-react'

import MainLayout from './layouts/MainLayout'

import HomePage from './pages/HomePage'
import MatchPage from './pages/MatchPage'
import GamesPage from './pages/GamesPage'
import AdminGamesPage from './pages/AdminGamesPage'
import DemoPage from './pages/DemoPage'
import HowItWorksPage from './pages/HowItWorksPage'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'

const router = createBrowserRouter(
  createRoutesFromElements(

    <Route path='/' element={<MainLayout />}>

      {/* PUBLIC ROUTES */}
      <Route index element={<HomePage />} />

      <Route path='login' element={<LoginPage />} />
      <Route path='register' element={<RegisterPage />} />
      <Route
        path='sso-callback'
        element={
          <AuthenticateWithRedirectCallback />
        }
      />
      <Route path='demo' element={<DemoPage />} />
      <Route path='how-it-works' element={<HowItWorksPage />} />

      {/* PROTECTED ROUTES */}
      <Route
        path='dashboard'
        element={
          <>
            <SignedIn>
              <DashboardPage />
            </SignedIn>

            <SignedOut>
              <Navigate to="/login" />
            </SignedOut>
          </>
        }
      />

      <Route
        path='games'
        element={<GamesPage />}
      />

      <Route
        path='matchpage'
        element={
          <>
            <SignedIn>
              <MatchPage />
            </SignedIn>

            <SignedOut>
              <Navigate to="/login" />
            </SignedOut>
          </>
        }
      />

      <Route
        path='games/:id'
        element={<MatchPage />}
      />

      <Route
        path='admin/games'
        element={
          <>
            <SignedIn>
              <AdminGamesPage />
            </SignedIn>

            <SignedOut>
              <Navigate to="/login" />
            </SignedOut>
          </>
        }
      />

    </Route>
  )
)

const App = () => {
  return <RouterProvider router={router} />
}

export default App
