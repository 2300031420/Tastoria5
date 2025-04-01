import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    // Check authentication
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/sign-in');
        return;
      }
      
      // Load cart items from localStorage
      const savedCart = localStorage.getItem(`cart_${user.uid}`);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cartItems.map(item => {
      if (item.id === itemId) {
        // Show toast only once with a consistent ID
        toast.success(`Updated ${item.name} quantity to ${newQuantity}`, {
          id: `cart-update-${itemId}`,
          duration: 2000
        });
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    setCartItems(updatedCart);
    localStorage.setItem(`cart_${auth.currentUser.uid}`, JSON.stringify(updatedCart));
  };

  const removeItem = (itemId) => {
    const itemToRemove = cartItems.find(item => item.id === itemId);
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    
    setCartItems(updatedCart);
    localStorage.setItem(`cart_${auth.currentUser.uid}`, JSON.stringify(updatedCart));
    
    // Show toast with consistent ID
    toast.success(`Removed ${itemToRemove.name} from cart`, {
      id: `cart-remove-${itemId}`,
      duration: 2000
    });
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#d0b290]">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#d0b290] pb-16 sm:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo - Hidden on mobile and tablet, visible on md and up */}
        <div className="hidden lg:block absolute top-7 left-8">
          <img 
            src="/img/Tastoria.jpg"
            alt="Tastoria Logo"
            className="h-28 w-44"
          />
        </div>

        <div className="pt-16 sm:pt-24 lg:pt-40">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Your Cart</h1>
          
          {cartItems.length === 0 ? (
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 sm:p-8 text-center">
                <div className="mb-4">
                  <svg 
                    className="mx-auto h-16 w-16 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-sm sm:text-base text-gray-500 mb-6">
                  Looks like you haven't added any items to your cart yet.
                </p>
                <button 
                  onClick={() => navigate('/preorder')}
                  className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent 
                    text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 
                    transition-colors duration-200 ease-in-out"
                >
                  Browse Restaurants
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden mb-20">
              {/* Cart Items */}
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-3 xs:p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row gap-3 xs:gap-4 sm:gap-6">
                      {/* Item Image - Adjusted size for better proportions */}
                      <div className="sm:w-1/4 flex-shrink-0">
                        <img 
                          src={item.image}
                          alt={item.name}
                          className="w-full xs:w-3/4 sm:w-full h-40 xs:h-44 sm:h-32 object-cover rounded-lg mx-auto sm:mx-0"
                        />
                      </div>
                      
                      {/* Item Details - Better spacing and layout */}
                      <div className="flex-grow space-y-2 xs:space-y-3 sm:space-y-4">
                        <div>
                          <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800">{item.name}</h3>
                          <p className="text-gray-600 text-xs xs:text-sm sm:text-base mt-1">{item.description}</p>
                        </div>

                        <div className="flex flex-col xs:flex-row sm:items-center justify-between gap-2 xs:gap-3 pt-2">
                          {/* Quantity Controls - Enhanced styling */}
                          <div className="flex items-center gap-3 xs:gap-4">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="bg-gray-100 hover:bg-gray-200 p-1.5 xs:p-2 rounded-md transition-colors"
                            >
                              <span className="text-base xs:text-lg">-</span>
                            </button>
                            <span className="text-base xs:text-lg font-medium w-6 xs:w-8 text-center">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="bg-gray-100 hover:bg-gray-200 p-1.5 xs:p-2 rounded-md transition-colors"
                            >
                              <span className="text-base xs:text-lg">+</span>
                            </button>
                          </div>

                          {/* Price and Remove - Enhanced styling */}
                          <div className="flex items-center justify-between xs:justify-end gap-3 xs:gap-4 sm:gap-6">
                            <span className="text-base xs:text-lg sm:text-xl font-semibold text-gray-900">
                              ₹{item.price * item.quantity}
                            </span>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700 text-xs xs:text-sm sm:text-base 
                                hover:underline transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary - Adjusted margins for better mobile spacing */}
              <div className="p-4 xs:p-6 sm:p-8 bg-gray-50 border-t border-gray-200">
                <div className="max-w-2xl mx-auto">
                  <div className="flex justify-between items-center mb-4 xs:mb-6">
                    <span className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800">Total Amount</span>
                    <span className="text-base xs:text-lg sm:text-xl font-bold text-gray-900">₹{calculateTotal()}</span>
                  </div>
                  
                  <button 
                    onClick={() => navigate('/home')}
                    className="w-full bg-green-500 text-white py-2 xs:py-3 sm:py-4 rounded-lg text-sm xs:text-base 
                      sm:text-lg font-semibold hover:bg-green-600 transition-colors shadow-md hover:shadow-lg"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart; 