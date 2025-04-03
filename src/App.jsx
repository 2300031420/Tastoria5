import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import { Navbar } from "@/widgets/layout";
import routes from "@/routes";
import { Home } from "./pages/home";
import QRScanner from "./components/QRScanner";
import PreorderPage from "./pages/preorderpage";
import { CafeList } from "./pages/CafeList";
import { SlotBooking } from "./pages/SlotBooking";
import { SignIn } from './pages/sign-in';
import { SignUp } from './pages/sign-up';
import { Profile } from './pages/Profile';
import PreorderModal from './pages/preorderModal';
import Cart from "./pages/cart";
import { ChatBot } from './components/ChatBot';
import { AdminLogin } from "./pages/admin-login";
import { AdminPortal } from "./pages/admin-portal";
import { MenuManagement } from "./pages/admin/MenuManagement";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function App() {
  return (
    <>
      <ThemeProvider>
        <div className="container absolute left-2/4 z-10 mx-auto -translate-x-2/4 p-4">
          <Navbar routes={routes} />
        </div>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/qr-scanner" element={<QRScanner />} />
          <Route path="/preorderpage" element={<PreorderPage />} />
          <Route path="/preorderModal" element={<PreorderModal />} />
          <Route path="/cafes" element={<CafeList />} />
          <Route path="/book-slot/:cafeId" element={<SlotBooking />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/preorder/:cafeId" element={<PreorderPage />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-portal" element={<AdminPortal />} />
          <Route path="/admin/menu" element={<MenuManagement />} />
          {/* Add a catch-all route for 404 */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
        <ChatBot />
      </ThemeProvider>
    </>
  );
}

export default App;