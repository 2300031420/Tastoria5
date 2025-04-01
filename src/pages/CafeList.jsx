import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
} from "@material-tailwind/react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export function CafeList() {
  const [cafes, setCafes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    // Set up authentication listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser); // Debug log
      setUser(currentUser);
    });

    fetchCafes();

    // Cleanup subscription
    return () => unsubscribe();
  }, [auth]);

  const fetchCafes = async () => {
    try {
      const mockCafes = [
        {
          id: "hangout-cafe",
          name: "Hangout Cafe",
          image: "/img/Hangout.jpg",
          description: "Authentic Italian pizzas and pasta",
          rating: 4.5,
          location: "Parbhani",
          availableSeats: 20
        },
        {
          id: "ttmm",
          name: "TTMM",
          image: "/img/ttmm.jpg",
          description: "Gourmet burgers and fries",
          rating: 4.3,
          location: "Parbhani",
          availableSeats: 15
        },
        {
          id: "cafe-house",
          name: "Cafe House",
          image: "/img/cafeHouse.jpg",
          description: "Fresh and authentic Japanese sushi",
          rating: 4.7,
          location: "Parbhani",
          availableSeats: 25
        },
        {
          id:"Golden-Bakery",
          name:"Golden-Bakery",
          image:"/img/golden.jpg",
          description:"Delicious pastries and coffee",
          rating:4.2,
          location:"Parbhani",
          availableSeats:10
        }
        // ... your existing cafes
      ];

      await new Promise(resolve => setTimeout(resolve, 500));
      setCafes(mockCafes);
    } catch (error) {
      console.error('Error fetching cafes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookTable = (cafeId) => {
    console.log("Current user:", user); // Debug log
    if (!user) {
      console.log("User not authenticated, redirecting to sign in"); // Debug log
      navigate('/sign-in', { 
        state: { returnUrl: `/book-slot/${cafeId}` }
      });
      return;
    }
    console.log("User authenticated, proceeding to booking"); // Debug log
    navigate(`/book-slot/${cafeId}`);
  };

  return (
    <div className="min-h-screen bg-gray-400 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Typography variant="h2" color="blue-gray" className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">
          Book a Table
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {cafes.map((cafe) => (
            <Card 
              key={cafe.id} 
              className="group relative overflow-hidden transform transition-all duration-500 ease-in-out
                         hover:scale-105 hover:-translate-y-2 hover:shadow-2xl
                         before:absolute before:inset-0 before:bg-black/0 before:transition-colors before:duration-500
                         hover:before:bg-black/5 cursor-pointer"
            >
              {/* Shine effect overlay */}
              {/* <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700
                            bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full
                            group-hover:translate-x-full transform transition-transform ease-in-out z-20"/> */}

              {/* Cafe Image with enhanced overlay */}
              <CardHeader 
                floated={false} 
                className="relative h-48 sm:h-56 m-0 rounded-b-none overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent 
                              opacity-60 group-hover:opacity-80 transition-opacity duration-500 z-10"/>
                <img
                  src={cafe.image}
                  alt={cafe.name}
                  className="w-full h-full object-cover transform transition-all duration-700 
                           group-hover:scale-110 group-hover:rotate-1"
                />
                <div className="absolute top-4 right-4 bg-white/95 px-3 py-1.5 rounded-full 
                               shadow-lg backdrop-blur-sm transform transition-all duration-500 
                               group-hover:scale-110 group-hover:rotate-3 group-hover:bg-white z-20
                               hover:scale-105 hover:shadow-xl">
                  <Typography className="flex items-center gap-1.5 font-medium">
                    <span className="text-yellow-600 transform group-hover:scale-110 transition-transform duration-500">★</span>
                    {cafe.rating}
                  </Typography>
                </div>
              </CardHeader>

              <CardBody className="p-6 sm:p-8 relative bg-white transition-colors duration-500 group-hover:bg-gray-50">
                {/* Cafe Details with enhanced animations */}
                <div className="space-y-4">
                  <Typography 
                    variant="h5" 
                    color="blue-gray" 
                    className="text-xl sm:text-2xl font-semibold transform transition-all duration-500 
                              group-hover:text-blue-600 group-hover:translate-x-1"
                  >
                    {cafe.name}
                  </Typography>
                  
                  <div className="space-y-3">
                    <Typography 
                      color="gray" 
                      className="flex items-center gap-2 text-sm sm:text-base transition-all duration-500 
                                group-hover:text-gray-700 group-hover:translate-x-1"
                    >
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      </svg>
                      {cafe.location}
                    </Typography>
                    
                    <Typography 
                      color="gray" 
                      className="flex items-center gap-2 text-sm sm:text-base transition-all duration-500 
                                group-hover:text-gray-700 group-hover:translate-x-1"
                    >
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                      </svg>
                      Available Seats: {cafe.availableSeats}
                    </Typography>
                  </div>

                  <Button
                    fullWidth
                    onClick={() => handleBookTable(cafe.id)}
                    className="mt-6 bg-blue-500 hover:bg-blue-600 transform transition-all duration-500
                              group-hover:shadow-lg relative overflow-hidden py-3 text-base"
                  >
                    <span className="relative z-10 font-medium">Book a Table</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
                  </Button>
                </div>

                {/* Corner decorative elements */}
                <div className="absolute bottom-0 right-0 w-24 h-24 transform translate-y-1/2 translate-x-1/2
                              bg-gradient-to-br from-blue-500/0 to-blue-500/20 rounded-full blur-2xl
                              opacity-0 group-hover:opacity-100 transition-all duration-700"/>
                <div className="absolute top-0 left-0 w-16 h-16 transform -translate-y-1/2 -translate-x-1/2
                              bg-gradient-to-br from-blue-500/0 to-blue-500/20 rounded-full blur-xl
                              opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100"/>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="min-h-[60vh] flex items-center justify-center">
            <Typography className="text-lg sm:text-xl">Loading cafes...</Typography>
          </div>
        )}
      </div>
    </div>
  );
}

export default CafeList; 