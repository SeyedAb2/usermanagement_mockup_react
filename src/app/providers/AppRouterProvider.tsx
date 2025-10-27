import { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import NotFound from "../../shared/components/NotFound";

const MainLayout = lazy(()=>import('../../shared/components/layouts/MainLayout'))

const Dashboard = lazy(() => import("../../pages/dashboard/Dashboard"));
const Role = lazy(() => import("../../pages/Role/Role"));
const Menu = lazy(() => import("../../pages/Menu/Menu"));
const AddMenuCategory = lazy(() => import("../../pages/AddMenuCategory/AddMenuCategory"));
const AddMenuGroup = lazy(() => import("../../pages/AddMenuGroup/AddMenuGroup"));
const AddPersonnel = lazy(() => import("../../pages/AddPersonnel/AddPersonnel"));
const UserAccessManagement = lazy(() => import("../../pages/UserAccessManagement/UserAccessManagement"));
const CategoryPage = lazy(() => import("../../pages/CategoryPage/CategoryPage"));
const AddPage = lazy(() => import("../../pages/AddPage/AddPage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "role", element: <Role /> },
      { path: "menu", element: <Menu /> },
      { path: "menu-category", element: <AddMenuCategory /> },
      { path: "menu-group", element: <AddMenuGroup /> },
      { path: "add-personel", element: <AddPersonnel /> },
      { path: "access-role", element: <UserAccessManagement /> },
      { path: "category-page", element: <CategoryPage /> },
      { path: "add-page", element: <AddPage /> },
    ],
  },
]);

export default function AppRouterProvider() {
  return <RouterProvider router={router} />;
}
