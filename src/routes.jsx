import {
  HomeIcon,
  UserCircleIcon,
  ShoppingCartIcon,
  QrCodeIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/solid";
import { Home } from "@/pages/home";
import { Profile } from "@/pages/Profile";
import { SignIn } from "@/pages/sign-in";
import { SignUp } from "@/pages/sign-up";
import QRScanner from "@/components/QRScanner";
import PreorderPage from "@/pages/preorderpage";
import { CafeList } from "@/pages/CafeList";

import { AdminLogin } from "./pages/admin-login";
import { AdminPortal } from "./pages/admin-portal";
import { MenuManagement } from "./pages/admin/MenuManagement";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Regular user routes
export const userRoutes = [
  {
    icon: HomeIcon,
    name: "home",
    path: "/home",
    element: <Home />,
  },
  {
    icon: UserCircleIcon,
    name: "profile",
    path: "/profile",
    element: <ProtectedRoute><Profile /></ProtectedRoute>,
  },
  {
    icon: QrCodeIcon,
    name: "qr scanner",
    path: "/qr-scanner",
    element: <QRScanner />,
  },
  {
    icon: BuildingStorefrontIcon,
    name: "Slot Booking",
    path: "/cafes",
    element: <CafeList />,
  },
  {/*{
    icon: UserCircleIcon,
    name: "Profile",
    path: "/profile",
    element: <Profile />,
  },*/}
];

// Admin routes (these won't show in the navigation)
export const adminRoutes = [
  {
    path: "/admin-login",
    element: <AdminLogin />,
  },
  {
    path: "/admin-portal",
    element: <AdminPortal />,
  },
  {
    path: "/admin/menu",
    element: <MenuManagement />,
  },
];

// Combine all routes for the router
export const routes = [
  ...userRoutes,
  ...adminRoutes,
  // Add auth pages directly here instead of through authRoutes
  {
    path: "/sign-in",
    element: <SignIn />,
    showInNav: false, // This ensures it won't show in navigation
  },
  {
    path: "/sign-up",
    element: <SignUp />,
    showInNav: false, // This ensures it won't show in navigation
  },
];

export default routes;