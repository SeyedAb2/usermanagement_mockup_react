import { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import NotFound from "../../shared/components/NotFound";

const MainLayout = lazy(()=>import('../../shared/components/layouts/MainLayout'))
const LandingPage = lazy(()=>import('../../pages/landing/LandingPage'))
const Login = lazy(()=>import('../../pages/auth/login/Login'))
const AboutUs = lazy(()=>import('../../pages/about-us/AboutUs'))
const SingUp = lazy(()=>import('../../pages/auth/signup/SignUp'))
const Users = lazy(()=>import('../../pages/users/Users'))
const SignleUserPage = lazy(()=>import('../../pages/users/single-user/SingleUser'))
const Products = lazy(()=>import('../../pages/Products/Products'))
const ProductDetailPage = lazy(()=>import('../../pages/Products/single-product/SingleProduct'))
const Dashboard = lazy(() => import("../../pages/dashboard/Dashboard"));
const Info = lazy(() => import("../../pages/dashboard/info/Info"));
const MyProducts = lazy(() => import("../../pages/dashboard/my-products/MyProducts"));
const ResetPass = lazy(() => import("../../pages/dashboard/reset-pass/ResetPass"));
const ProductForm = lazy(() => import("../../pages/dashboard/my-products/make-product/MakeProduct"));


const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <LandingPage /> }, 
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <SingUp /> },
      { path: 'users', element: <Users /> },
      { path: 'users', element: <Users /> },
      { path: 'users/:userId', element: <SignleUserPage /> },
      { path: 'about-us', element: <AboutUs /> },
      { path: 'products', element: <Products />},
      { path: 'products/:productId', element: <ProductDetailPage /> },
      {
        path: "/dashboard",
        element: <Dashboard />,
        children: [
          { index: true, element: <Info /> },    
          { path: "info", element: <Info /> },
          { path: "my-products", element: <MyProducts /> },
          { path: "my-products/create", element: <ProductForm ACTION="ADD"/> },
          { path: "my-products/:productId/edit", element: <ProductForm ACTION="EDIT"/> },
          { path: "reset-pass", element: <ResetPass /> },
        ],
      }
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