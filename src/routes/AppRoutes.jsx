import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { AuthLayout } from "../components/layout/AuthLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/Dashboard";
import RestaurantsPage from "../pages/RestaurantsPage";
import RestaurantDetailPage from "../pages/RestaurantDetailPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import OrdersPage from "../pages/OrdersPage";
import OrderDetailPage from "../pages/OrderDetailPage";
import AssistantPage from "../pages/AssistantPage";
import NotFound from "../pages/NotFound";
import OwnerOverviewPage from "../pages/owner/OwnerOverviewPage";
import RestaurantFormPage from "../pages/owner/RestaurantFormPage";
import RestaurantWorkspacePage from "../pages/owner/RestaurantWorkspacePage";
import AdminOverviewPage from "../pages/admin/AdminOverviewPage";
import { ROLES } from "../constants/roles";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/restaurants", element: <RestaurantsPage /> },
      { path: "/restaurants/:id", element: <RestaurantDetailPage /> },
      {
        element: <ProtectedRoute />,
        children: [{ path: "/dashboard", element: <Dashboard /> }],
      },
      {
        // Cart/checkout/orders/assistant are customer-only on the backend
        // (require_role(UserRole.customer)), so the route is gated the same way.
        element: <ProtectedRoute roles={[ROLES.CUSTOMER]} />,
        children: [
          { path: "/cart", element: <CartPage /> },
          { path: "/checkout", element: <CheckoutPage /> },
          { path: "/orders", element: <OrdersPage /> },
          { path: "/orders/:id", element: <OrderDetailPage /> },
          { path: "/assistant", element: <AssistantPage /> },
        ],
      },
      {
        // Owner dashboard: restaurant CRUD, menu management, incoming orders,
        // analytics — gated the same way the backend gates restaurant_owner routes.
        element: <ProtectedRoute roles={[ROLES.RESTAURANT_OWNER]} />,
        children: [
          { path: "/owner", element: <OwnerOverviewPage /> },
          { path: "/owner/restaurants/new", element: <RestaurantFormPage /> },
          { path: "/owner/restaurants/:id/edit", element: <RestaurantFormPage /> },
          { path: "/owner/restaurants/:id", element: <RestaurantWorkspacePage /> },
        ],
      },
      {
        // Admin dashboard — restaurant approval queue.
        element: <ProtectedRoute roles={[ROLES.ADMIN]} />,
        children: [{ path: "/admin", element: <AdminOverviewPage /> }],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
