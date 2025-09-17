import { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";

const MainLayout = lazy(()=>import('../../shared/components/layouts/MainLayout'))
const LandingPage = lazy(()=>import('../../pages/landing/LandingPage'))
const Login = lazy(()=>import('../../pages/auth/login/Login'))
const SingUp = lazy(()=>import('../../pages/auth/signup/SignUp'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <h3 className='text-center'>چیزی پیدا نکردیم…</h3>,
    children: [
      { index: true, element: <LandingPage /> }, 
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <SingUp /> },
    ],
  },
]);

export default function AppRouterProvider(){
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}