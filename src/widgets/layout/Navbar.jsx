import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { userRoutes } from "../../routes";
import {
  Navbar as MTNavbar,
  Collapse,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/context/AuthContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import QRScanner from "@/components/QRScanner";
import { toast } from "react-hot-toast";

const routes = userRoutes.filter(route => route.name);

export function Navbar({ brandName, routes = [], action }) {
  const [openNav, setOpenNav] = React.useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const auth = getAuth();
  const [cartQuantity, setCartQuantity] = useState(0);

  const hideNavigationRoutes = [
    '/cafes',
    '/preorder',
    '/qr-scanner',
    '/sign-in',
    '/sign-up',
    '/profile',
    '/admin-login',
    '/admin',
    '/slot-booking',
    '/scanner',
    '/orders',
    '/cart',
    '/menu',
    '/payment',
    '/booking'
  ];

  // Update the shouldHideNavbar check
  const shouldHideNavbar = hideNavigationRoutes.some(route => 
    // Check if the current path starts with any of the hide routes
    location.pathname.startsWith(route) ||
    // Handle wildcard routes
    (route.endsWith('*') && location.pathname.startsWith(route.slice(0, -1)))
  );

  // Define isHomePage based on current location
  const isHomePage = location.pathname === "/";

  // Consolidate profile data loading into a single useEffect
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        if (auth.currentUser) {
          // Your profile loading logic here
          setProfileError(null); // Clear any existing errors
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setProfileError('Failed to load profile data');
        // Show single toast notification with a unique ID
        toast.error('Failed to load profile data', {
          id: 'profile-error', // Unique ID to prevent duplicate toasts
        });
      }
    };

    if (isAuthenticated) {
      loadProfileData();
    }
  }, [auth.currentUser, isAuthenticated]);

  // Update cart quantity whenever localStorage changes
  useEffect(() => {
    const updateCartQuantity = () => {
      if (auth.currentUser) {
        const cartKey = `cart_${auth.currentUser.uid}`;
        const savedCart = localStorage.getItem(cartKey);
        
        if (savedCart) {
          try {
            const cartItems = JSON.parse(savedCart);
            const totalQuantity = cartItems.reduce((total, item) => {
              return total + (parseInt(item.quantity) || 0);
            }, 0);
            setCartQuantity(totalQuantity);
          } catch (error) {
            console.error('Error parsing cart:', error);
            setCartQuantity(0);
          }
        } else {
          setCartQuantity(0);
        }
      }
    };

    // Update initially
    updateCartQuantity();

    // Listen for cart updates
    window.addEventListener('cartUpdated', updateCartQuantity);

    return () => {
      window.removeEventListener('cartUpdated', updateCartQuantity);
    };
  }, [auth.currentUser]);

  const handleQRScan = (data) => {
    try {
      // Assuming the QR code contains a valid URL or path
      if (data.startsWith('http')) {
        window.location.href = data;
      } else {
        navigate(data);
      }
    } catch (error) {
      console.error("Error handling QR scan:", error);
      toast.error("Invalid QR code", {
        id: 'qr-scan-error', // Unique ID to prevent duplicate toasts
      });
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/sign-in');
    } catch (error) {
      console.error("Logout error:", error);
      // Still navigate to sign-in since we've cleared local state
      navigate('/sign-in');
    }
  };

  // Filter routes based on authentication
  const availableRoutes = routes.filter(route => {
    // Add routes that should always be visible
    const publicRoutes = ['/home', '/about', '/contact'];
    if (publicRoutes.includes(route.path)) return true;
    
    // Only show protected routes if authenticated
    return isAuthenticated;
  });

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 text-inherit lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {availableRoutes.map(({ name, path, icon, href, target }, index) => (
        <Typography
          key={`nav-${name}-${index}`}
          as="li"
          variant="small"
          color="inherit"
          className="capitalize"
        >
          {href ? (
            <a
              href={href}
              target={target}
              className="flex items-center gap-1 p-1 font-bold"
            >
              {icon && React.createElement(icon, {
                className: "w-[18px] h-[18px] opacity-75 mr-1",
              })}
              {name}
            </a>
          ) : (
            <Link
              to={path}
              target={target}
              className="flex items-center gap-1 p-1 font-bold"
            >
              {icon && React.createElement(icon, {
                className: "w-[18px] h-[18px] opacity-75 mr-1",
              })}
              {name}
            </Link>
          )}
        </Typography>
      ))}
      {isAuthenticated && user?.email && (
        <Typography
          key="user-email-nav"
          as="li"
          variant="small"
          color="inherit"
          className="capitalize"
        >
          <span className="p-1 font-bold">
           {/*Welcome, {user.email}*/}
          </span>
        </Typography>
      )}
    </ul>
  );

  // Add event listener for navbar closing
  React.useEffect(() => {
    const handleCloseNavbar = () => {
      setOpenNav(false);
    };

    window.addEventListener('closeNavbar', handleCloseNavbar);

    // Cleanup
    return () => {
      window.removeEventListener('closeNavbar', handleCloseNavbar);
    };
  }, []);

  // Also close navbar when route changes
  React.useEffect(() => {
    setOpenNav(false);
  }, [location.pathname]);

  // Return null if navbar should be hidden
  if (shouldHideNavbar) {
    return null;
  }

  return (
    <MTNavbar color="transparent" className="p-3">
      <div className="container mx-auto flex items-center justify-between text-white">
        {isHomePage && (
          <Link to="/">
            {brandName}
          </Link>
        )}
        <div className="hidden lg:flex items-center ml-auto">{navList}</div>
        
        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <Link to="/cart" className="relative inline-block">
              <ShoppingCartIcon className="h-6 w-6 text-white" />
              {cartQuantity > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white 
                  rounded-full h-5 w-5 flex items-center justify-center text-xs 
                  font-bold transform scale-100">
                  {cartQuantity}
                </div>
              )}
            </Link>
          )}

          {isAuthenticated ? (
            <Menu>
              <MenuHandler>
                <Button
                  variant="text"
                  color="blue-gray"
                  className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
                >
                  <div className="flex items-center gap-2">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.name || "user"}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                        {user?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                    <Typography variant="small" className="font-normal text-white">
                      {user?.name || user?.displayName || "User"}
                    </Typography>
                  </div>
                </Button>
              </MenuHandler>
              <MenuList>
                <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
                <MenuItem onClick={() => navigate("/orders")}>Orders</MenuItem>
                <MenuItem onClick={handleLogout} className="text-red-500">
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/sign-in">
                <Button 
                  variant="text" 
                  size="sm"
                  className="text-white hover:bg-white/10 transition-colors"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button 
                  variant="text" 
                  size="sm"
                  className="text-white hover:bg-white/10 transition-colors"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
        <IconButton
          variant="text"
          size="sm"
          color="white"
          className="ml-auto text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <div className="container mx-auto bg-white/90 rounded-xl mt-4 p-4">
          <div className="flex flex-col gap-4">
            <ul className="flex flex-col gap-2">
              {routes.map(({ name, path, icon }, index) => (
                <Typography
                  key={`mobile-${name}-${index}`}
                  as="li"
                  variant="small"
                  color="blue-gray"
                  className="p-1 font-normal"
                >
                  <Link to={path} className="flex items-center">
                    {icon && React.createElement(icon, {
                      className: "w-5 h-5 mr-2",
                      key: `mobile-icon-${name}-${index}`
                    })}
                    {name}
                  </Link>
                </Typography>
              ))}
            </ul>
            {isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Link to="/cart" className="flex items-center gap-2">
                  <ShoppingCartIcon className="h-6 w-6" />
                  <Typography color="blue-gray">Cart ({cartQuantity})</Typography>
                </Link>
                <Button 
                  variant="text" 
                  size="sm" 
                  color="blue-gray"
                  onClick={handleLogout}
                  fullWidth
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/sign-in">
                  <Button variant="text" size="sm" color="blue-gray" fullWidth>
                    Sign In
                  </Button>
                </Link>
                {action}
              </div>
            )}
          </div>
        </div>
      </Collapse>

      {/* QR Scanner Dialog */}
      {isQRScannerOpen && (
        <QRScanner
          onClose={() => setIsQRScannerOpen(false)}
          onScan={handleQRScan}
        />
      )}
    </MTNavbar>
  );
}

Navbar.defaultProps = {
  brandName: <img src="/img/Tastoria.jpg" alt="Tastoria Logo" className="h-8" />,
  action: (
    <Link to="/sign-up">
      <Button variant="gradient" size="sm" fullWidth>
        Sign Up
      </Button>
    </Link>
  ),
  routes: [],
};

Navbar.propTypes = {
  brandName: PropTypes.node,
  routes: PropTypes.arrayOf(PropTypes.object),
  action: PropTypes.node,
};

Navbar.displayName = "/src/widgets/layout/navbar.jsx";

export default Navbar;