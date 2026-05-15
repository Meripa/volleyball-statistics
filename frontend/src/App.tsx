import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate
} from 'react-router-dom'
import {
  SignedIn,
  SignedOut
} from '@clerk/clerk-react'

import MainLayout from './layouts/MainLayout'

import HomePage from './pages/HomePage'
import MatchPage from './pages/MatchPage'
import GamesPage from './pages/GamesPage'

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
        element={
          <>
            <SignedIn>
              <GamesPage />
            </SignedIn>

            <SignedOut>
              <Navigate to="/login" />
            </SignedOut>
          </>
        }
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

    </Route>
  )
)

const App = () => {
  return <RouterProvider router={router} />
}

export default App
