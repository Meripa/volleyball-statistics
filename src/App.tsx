import {Route, createBrowserRouter, createRoutesFromElements, RouterProvider} from 'react-router-dom'
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import NewMatch from './pages/NewMatch';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout />}>
      <Route index element={<HomePage />}/>
      <Route path='newmatch' element={<NewMatch />}/>
    </Route>
    )
)

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;