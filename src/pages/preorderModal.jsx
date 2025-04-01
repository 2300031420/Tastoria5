import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { useCallback } from 'react';
import { motion } from 'framer-motion';

const restaurants = [
  {
    id: "hangout-cafe",
    name: "Hangout Cafe",
    image: "/img/Hangout.jpg",
    description: "Experience authentic Italian cuisine in a cozy atmosphere. Known for our wood-fired pizzas and homemade pasta dishes.",
    rating: 4.5,
    reviews: 128,
    cuisine: "Italian • Pizza • Pasta",
    priceRange: "₹₹",
    deliveryTime: "30-45 min"
  },
  {
    id: "ttmm",
    name: "TTMM",
    image: "/img/ttmm.jpg",
    description: "Gourmet burgers and artisanal fries in a modern setting. Our signature sauces and locally-sourced ingredients make every bite special.",
    rating: 4.3,
    reviews: 95,
    cuisine: "Burgers • American • Fries",
    priceRange: "₹₹₹",
    deliveryTime: "25-35 min"
  },
  {
    id: "cafe-house",
    name: "Cafe House",
    image: "/img/cafeHouse.jpg",
    description: "A perfect blend of traditional and contemporary Japanese cuisine. Fresh sushi, sashimi, and innovative fusion dishes.",
    rating: 4.7,
    reviews: 156,
    cuisine: "Japanese • Sushi • Asian",
    priceRange: "₹₹₹₹",
    deliveryTime: "35-50 min"
  },
  {
  id:"Golden-bakery",
  name:"Golden Bakery",
  image: "/img/golden.jpg",
  description:"A popular place where enjoy there meals and also has wide food ranges",
  rating:4.8,
  reviews:100,
  cuisine:"Bakery • Cakes • Pastries",
  priceRange:"₹₹₹",
  deliveryTime:"20-30 min"
  }
];

function PreorderModal() {
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [authStatus, setAuthStatus] = useState('checking');
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  const navigateWithTransition = useCallback((to) => {
    if (typeof window.requestIdleCallback === 'function') {
      requestIdleCallback(() => navigate(to, { replace: true }));
    } else {
      setTimeout(() => navigate(to, { replace: true }), 0);
    }
  }, [navigate]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthStatus('authenticated');
        setShowLoginPopup(true);
        setTimeout(() => setShowLoginPopup(false), 3000);
      } else {
        setAuthStatus('unauthenticated');
        localStorage.setItem('redirectAfterLogin', '/preorderpage');
        navigateWithTransition('/sign-in');
      }
    });

    return () => unsubscribe();
  }, [auth, navigateWithTransition]);

  const handleRestaurantClick = (restaurantId) => {
    if (authStatus === 'authenticated') {
      navigate('/preorderpage', {
        state: { restaurantId: restaurantId }
      });
    } else {
      localStorage.setItem('redirectAfterLogin', '/preorderpage');
      navigate('/sign-in');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (authStatus === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#d0b290] to-[#e5d5bf]">
        <div className="animate-pulse text-2xl font-semibold text-gray-700">
          Loading amazing restaurants...
        </div>
      </div>
    );
  }

  if (authStatus === 'authenticated') {
    return (
      <div className={`min-h-screen flex flex-col bg-gradient-to-br from-[#d0b290] to-[#e5d5bf] ${isModalOpen ? '' : 'hidden'}`}>
        {showLoginPopup && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-30"
          >
            <div className="bg-green-100 text-green-700 px-6 py-3 rounded-lg shadow-lg flex items-center">
              <span className="text-xl mr-2">✓</span>
              <span className="font-medium">Successfully logged in!</span>
            </div>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed top-4 left-4 sm:top-7 sm:left-10 z-20"
        >
          <img 
            src="/img/Tastoria.jpg"
            alt="Tastoria Logo"
            className="h-20 w-32 sm:h-34 sm:w-48 mt-1 rounded-lg shadow-md"
          />
        </motion.div>

        <div className="flex-1 px-4 sm:px-8 pt-32 sm:pt-40 pb-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-2xl max-w-5xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-800 text-center">
              Discover Our Partner Restaurants
            </h2>
            
            <div className="space-y-6 sm:space-y-8">
              {restaurants.map((restaurant) => (
                <motion.div 
                  key={restaurant.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300
                    ${selectedRestaurant === restaurant.id ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-64 h-64 relative overflow-hidden">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 sm:hidden">
                        <h3 className="text-white text-xl font-bold">{restaurant.name}</h3>
                      </div>
                    </div>

                    <div className="flex-grow p-6">
                      <div className="hidden sm:block">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{restaurant.name}</h3>
                      </div>

                      <div className="flex flex-wrap gap-3 mb-4">
                        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                          {restaurant.cuisine}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                          {restaurant.priceRange}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                          {restaurant.deliveryTime}
                        </span>
                      </div>

                      <div className="flex items-center mb-4">
                        <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-full">
                          <span className="text-yellow-500 text-xl">★</span>
                          <span className="ml-1 font-semibold">{restaurant.rating}</span>
                          <span className="text-gray-500 text-sm ml-1">
                            ({restaurant.reviews} reviews)
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 leading-relaxed mb-6">
                        {restaurant.description}
                      </p>

                      <button
                        onClick={() => handleRestaurantClick(restaurant.id)}
                        className="w-full sm:w-auto bg-blue-500 text-white py-3 px-8 rounded-lg
                          font-semibold hover:bg-blue-600 transition-all duration-300 
                          hover:shadow-lg active:transform active:scale-95 
                          flex items-center justify-center gap-2"
                      >
                        <span>Browse Menu</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
}

export default PreorderModal;
