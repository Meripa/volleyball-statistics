import {Route, createBrowserRouter, createRoutesFromElements, RouterProvider} from 'react-router-dom'
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import NewMatch from './pages/NewMatch';
import TestPage from './pages/TestPage';
import GamesPage from './pages/GamesPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout />}>
      <Route index element={<HomePage />}/>
      <Route path='newmatch' element={<NewMatch />}/>
      <Route path='test' element={<TestPage />}/>
      <Route path='games' element={<GamesPage />}/>

      {/* Specific game opening */}
      <Route path='games/:id' element={<NewMatch/>}/>
    </Route>
    )
)

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;