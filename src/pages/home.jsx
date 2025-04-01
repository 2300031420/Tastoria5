import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { FeatureCard } from "@/widgets/cards";
import { featuresData } from "@/data";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { 
  QrCodeIcon, 
  ShoppingCartIcon, 
  CalendarDaysIcon,
  BuildingStorefrontIcon 
} from "@heroicons/react/24/outline";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

export function Home() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const { isAuthenticated } = useAuth();

  // Updated navigation handlers with auth check
  const handlePreorderClick = () => {
    if (isAuthenticated) {
      navigate('/preorderModal');
      window.dispatchEvent(new CustomEvent('closeNavbar'));
    } else {
      toast.error("Please sign in to access pre-order");
      // Save the intended destination
      localStorage.setItem('redirectAfterLogin', '/preorderModal');
      navigate('/sign-in');
    }
  };

  const handleScanClick = () => {
    if (isAuthenticated) {
      navigate('/qr-scanner');
      window.dispatchEvent(new CustomEvent('closeNavbar'));
    } else {
      toast.error("Please sign in to use QR scanner");
      // Save the intended destination
      localStorage.setItem('redirectAfterLogin', '/qr-scanner');
      navigate('/sign-in');
    }
  };

  const handleOrderNow = (restaurantId, itemId) => {
    if (isAuthenticated) {
      navigate(`/preorder/${restaurantId}`, {
        state: { selectedItemId: itemId }
      });
      window.dispatchEvent(new CustomEvent('closeNavbar'));
    } else {
      toast.error("Please sign in to place an order");
      // Save the intended destination
      localStorage.setItem('redirectAfterLogin', `/preorder/${restaurantId}`);
      navigate('/sign-in');
    }
  };

  // Scroll handlers
  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    const scrollAmount = 400; // Adjust this value to control scroll distance
    
    if (container) {
      const targetScroll = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  const handleCafeClick = (e, cafeId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAuthenticated) {
      navigate(`/preorder/${cafeId}`);
      window.dispatchEvent(new CustomEvent('closeNavbar'));
    } else {
      toast.error("Please sign in to view menu");
      // Save the intended destination
      localStorage.setItem('redirectAfterLogin', `/preorder/${cafeId}`);
      navigate('/sign-in');
    }
  };

  const partneredCafes = [
    {
      id: "hangout-cafe",
      name: "Hangout Cafe",
      image: "/img/Hangout.jpg",
      description: "Authentic Italian pizzas and pasta",
      rating: 4.5,
      specialty: "Italian Cuisine",
      location: "Parbhani",
      menu: [
        {
          id: 1,
          name: "Margherita Pizza",
          price: 12.99,
          description: "Fresh tomatoes, mozzarella, and basil",
          image: "/img/pizza.jpg"
        },
      ]
    },
    {
      id: "ttmm",
      name: "TTmm",
      image: "/img/ttmm.jpg",
      description: "Gourmet burgers and fries",
      rating: 4.3,
      specialty: "American Cuisine",
      location: "Parbhani",
      menu: []
    },
    {
      id: "cafe-house",
      name: "Cafe House",
      image: "/img/cafeHouse.jpg",
      description: "Fresh and authentic Japanese sushi",
      rating: 4.7,
      specialty: "Japanese Cuisine",
      location: "Parbhani",
      menu: []
    },
    {
      id: "golden-bakery",
      name: "Golden Bakery",
      image: "/img/golden.jpg",
      description: "Authentic Indian cuisine",
      rating: 4.4,
      specialty: "Indian Cuisine",
      location: "Parbhani",
      menu: []
    }
  ];

  const features = [
   {
      title: "Scan QR Code",
      description: "Scan table QR code to place your order",
      icon: QrCodeIcon,
      path: "/qr-scanner",
      color: "blue"
    },
    {
      title: "Pre-order",
      description: "Order your food in advance",
      icon: ShoppingCartIcon,
      path: "/preorderModal",
      color: "green"
    },
    {
      title: "Book Table",
      description: "Reserve your table in advance",
      icon: CalendarDaysIcon,
      path: "/cafes",
      color: "purple"
    },
    {
      title: "Explore Menus",
      description: "Discover restaurants near you",
      icon: BuildingStorefrontIcon,
      path: "/preorderpage",
      color: "orange"
    }
  ].map(feature => ({
    ...feature,
    className: 'md:block hidden'
  }));

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative flex h-[45vh] sm:h-[45vh] md:h-[50vh] lg:h-[70vh] content-center items-center justify-center pt-24 pb-32">
        <div className="absolute top-0 h-full w-full bg-[url('/img/background-3.jpg')] bg-cover bg-center" />
        <div className="absolute top-0 h-full w-full bg-black/70 bg-cover bg-center" />
        <div className="max-w-8xl container relative mx-auto px-4">
          <div className="flex flex-wrap items-center">
            <div className="ml-auto mr-auto w-full px-4 text-center">
              <Typography
                variant="h1"
                color="white"
                className="mb-4 sm:mb-6 font-black text-4xl sm:text-5xl md:text-7xl lg:text-8xl"
              >
                Tastoria
              </Typography>
              <Typography 
                variant="lead" 
                color="white" 
                className="opacity-80 text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto mb-6 sm:mb-8"
              >
                Welcome to Tastoria - Where Every Meal Tells a Story. Discover a world
                of culinary delights, from local favorites to global cuisines.
              </Typography>
              
              <div className="flex justify-center gap-3 sm:gap-7">
                <Button
                  size="sm"
                  sm:size="lg"
                  color="white"
                  className="flex items-center gap-2 sm:gap-3 bg-white text-gray-900 hover:scale-105 transition-transform duration-300 text-sm sm:text-base"
                  onClick={handlePreorderClick}
                >
                  <ShoppingCartIcon strokeWidth={2} className="h-4 w-4 sm:h-5 sm:w-5" /> 
                  Pre-order Now
                </Button>
                <Button
                  size="sm"
                  sm:size="lg"
                  color="blue"
                  variant="gradient"
                  className="flex items-center gap-2 sm:gap-3 hover:scale-105 transition-transform duration-300 text-sm sm:text-base"
                  onClick={handleScanClick}
                >
                  <QrCodeIcon strokeWidth={2} className="h-4 w-4 sm:h-5 sm:w-5" />
                  Scan & Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="-mt-32 bg-transparent px-4 pb-20 pt-4">
        <div className="container mx-auto">
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
            {features.map(({ color, title, icon, description, path }) => (
              <Link to={path} key={title}>
                <div className={`bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg
                  hover:shadow-xl transition-all duration-300 transform hover:scale-105
                  border border-gray-200 h-full`}>
                  <div className={`rounded-full w-12 h-12 flex items-center justify-center mb-4
                    ${color === "blue" ? "bg-blue-100 text-blue-500" :
                      color === "green" ? "bg-green-100 text-green-500" :
                      color === "purple" ? "bg-purple-100 text-purple-500" :
                      "bg-orange-100 text-orange-500"}`}>
                    {React.createElement(icon, { className: "w-6 h-6" })}
                  </div>
                  <Typography variant="h5" className="mb-2 text-xl font-bold">
                    {title}
                  </Typography>
                  <Typography className="font-normal text-gray-600">
                    {description}
                  </Typography>
                </div>
              </Link>
            ))}
          </div>

          {/* Add mobile alternative */}
          <div className="md:hidden flex flex-col gap-4 px-2">
            <Typography variant="h4" className="text-center mb-4 font-playfair">
              Our Services
            </Typography>
            <div className="grid grid-cols-2 gap-4">
              {features.map(({ color, title, icon, path }) => (
                <Link to={path} key={title}>
                  <div className={`bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg
                    hover:shadow-xl transition-all duration-300 transform hover:scale-105
                    border border-gray-200 flex flex-col items-center`}>
                    <div className={`rounded-full w-10 h-10 flex items-center justify-center mb-2
                      ${color === "blue" ? "bg-blue-100 text-blue-500" :
                        color === "green" ? "bg-green-100 text-green-500" :
                        color === "purple" ? "bg-purple-100 text-purple-500" :
                        "bg-orange-100 text-orange-500"}`}>
                      {React.createElement(icon, { className: "w-5 h-5" })}
                    </div>
                    <Typography variant="h6" className="text-center text-sm font-bold">
                      {title}
                    </Typography>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pt-16 pb-20 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Typography 
              variant="h2" 
              color="blue-gray" 
              className="mb-3 text-3xl sm:text-4xl font-bold font-playfair"
            >
              Trending Items
            </Typography>
            <Typography 
              variant="lead" 
              className="text-blue-gray-500 font-lato"
            >
              Most loved dishes from our restaurants
            </Typography>
          </div>

          <div className="relative">
            <button 
              onClick={() => scroll('left')} 
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg hidden md:block"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            
            <button 
              onClick={() => scroll('right')} 
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg hidden md:block"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>

            <div 
              ref={scrollContainerRef}
              className="overflow-x-auto hide-scrollbar"
            >
              <div className="flex gap-6 pb-6 px-2 min-w-max md:px-4">
                {[
                  {
                    name: "Pizza",
                    restaurant: "Hangout Cafe",
                    price: "₹299",
                    image: "/img/pizza.jpg",
                    rating: 4.8,
                    orders: "1.2k+ orders this week",
                    restaurantId: "hangout-cafe",
                    itemId: "1"
                  },
                  {
                    name: "Chocolate Cake",
                    restaurant: "Golden Bakery",
                    price: "₹399",
                    image: "/img/cake.jpg",
                    rating: 4.9,
                    orders: "800+ orders this week",
                    restaurantId: "golden-bakery",
                    itemId: "4"
                  },
                  {
                    name: "Cappuccino",
                    restaurant: "Cafe House",
                    price: "₹149",
                    image: "/img/Cappuccino.jpg",
                    rating: 4.7,
                    orders: "950+ orders this week",
                    restaurantId: "cafe-house",
                    itemId: "2"
                  },
                  {
                    name: "Classic Burger",
                    restaurant: "TTmm",
                    price: "₹199",
                    image: "/img/burger.jpg",
                    rating: 4.6,
                    orders: "700+ orders this week",
                    restaurantId: "ttmm",
                    itemId: "2"
                  }
                ].map((item) => (
                  <Card 
                    key={item.name} 
                    className="w-[280px] flex-shrink-0 hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => handleOrderNow(item.restaurantId, item.itemId)}
                  >
                    <CardHeader floated={false} className="h-48">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </CardHeader>
                    <CardBody className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Typography variant="h5" color="blue-gray" className="font-bold">
                          {item.name}
                        </Typography>
                        <Typography variant="h6" color="blue-gray">
                          {item.price}
                        </Typography>
                      </div>
                      <Typography variant="small" className="text-gray-600 mb-2">
                        {item.restaurant}
                      </Typography>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-500">★</span>
                        <Typography variant="small">{item.rating}</Typography>
                        <Typography variant="small" className="text-gray-500">
                          • {item.orders}
                        </Typography>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 pt-16 pb-20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Typography variant="h2" color="blue-gray" className="mb-3 text-3xl sm:text-4xl font-bold">
              Our Partnered Restaurants
            </Typography>
            <Typography variant="lead" className="text-blue-gray-500">
              Explore our curated selection of top-rated restaurants
            </Typography>
          </div>

          <div className="relative">
            <div className="overflow-x-auto pb-6 hide-scrollbar">
              <div className="flex flex-nowrap gap-6 px-4 sm:px-0">
                {partneredCafes.map((cafe) => (
                  <Card 
                    key={cafe.id}
                    className="w-[280px] sm:w-[320px] lg:w-[400px] flex-shrink-0 hover:shadow-xl transition-all duration-300"
                  >
                    <CardHeader floated={false} className="h-48 sm:h-56">
                      <img
                        src={cafe.image}
                        alt={cafe.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full shadow-md">
                        <Typography className="flex items-center gap-1">
                          <span className="text-yellow-600">★</span>
                          {cafe.rating}
                        </Typography>
                      </div>
                    </CardHeader>
                    <CardBody className="p-6 hover:bg-gray-50 transition-colors duration-300">
                      <Typography variant="h5" color="blue-gray" className="mb-3 font-bold text-xl">
                        {cafe.name}
                      </Typography>
                      <Typography className="font-normal text-blue-gray-500 mb-3 text-lg">
                        {cafe.description}
                      </Typography>
                      <div className="flex flex-wrap gap-2 mt-4">
                        <span className="bg-blue-gray-50 px-4 py-2 rounded-full text-base hover:bg-blue-gray-100 transition-colors">
                          {cafe.specialty}
                        </span>
                        <span className="bg-blue-gray-50 px-4 py-2 rounded-full text-base hover:bg-blue-gray-100 transition-colors">
                          {cafe.location}
                        </span>
                      </div>
                      <button 
                        onClick={(e) => handleCafeClick(e, cafe.id)}
                        className="w-full mt-6 bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300 transform hover:scale-105 text-lg"
                      >
                        View Menu
                      </button>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="px-4 pt-16 pb-20 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Typography variant="h2" color="blue-gray" className="mb-3 text-3xl sm:text-4xl font-bold">
              New Launches
            </Typography>
            <Typography variant="lead" className="text-blue-gray-500">
              Exciting new additions to our menu
            </Typography>
          </div>

          <div className="relative">
            <div className="overflow-x-auto pb-6 hide-scrollbar">
              <div className="flex md:grid md:grid-cols-3 gap-6 min-w-max md:min-w-0">
                {[
                  {
                    name: "Pizza",
                    restaurant: "Hangout Cafe",
                    price: "₹299",
                    image: "/img/pizza.jpg",
                    tag: "New",
                    description: "Loaded with fresh vegetables and exotic herbs",
                    restaurantId: "hangout-cafe",
                    itemId: "1"
                  },
                  {
                    name: "Chocolate Cake",
                    restaurant: "Golden Bakery",
                    price: "₹399",
                    image: "/img/cake.jpg",
                    tag: "New",
                    description: "Rich and creamy with fresh blueberry topping",
                    restaurantId: "golden-bakery",
                    itemId: "4"
                  },
                  {
                    name: "Classic Burger",
                    restaurant: "TTmm",
                    price: "₹199",
                    image: "/img/burger.jpg",
                    tag: "Special",
                    description: "Juicy grilled chicken with special sauce",
                    restaurantId: "ttmm",
                    itemId: "2"
                  }
                ].map((item) => (
                  <Card 
                    key={item.name} 
                    className="w-72 md:w-auto overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    <CardHeader floated={false} className="h-56 relative">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
                      />
                      <div className="absolute top-2 left-2 bg-red-500 px-3 py-1 rounded-full">
                        <Typography className="text-white text-sm font-medium">
                          {item.tag}
                        </Typography>
                      </div>
                    </CardHeader>
                    <CardBody className="p-6 hover:bg-gray-50 transition-colors duration-300">
                      <Typography variant="h5" color="blue-gray" className="mb-1">
                        {item.name}
                      </Typography>
                      <Typography color="gray" className="mb-2 text-sm">
                        {item.restaurant}
                      </Typography>
                      <Typography color="gray" className="mb-3 text-sm">
                        {item.description}
                      </Typography>
                      <div className="flex justify-between items-center">
                        <Typography color="blue-gray" className="font-medium">
                          {item.price}
                        </Typography>
                        <Button 
                          size="sm" 
                          color="blue" 
                          className="rounded-full transform transition-all duration-300 hover:scale-105"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log(item.restaurantId);
                            handleOrderNow(item.restaurantId, item.itemId);
                          }}
                        >
                          Order Now
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <footer className="bg-[#1c1816] text-white pt-12 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <img src="/img/Tastoria.jpg" alt="Tastoria Logo" className="h-24 w-18 mb-4" />
              <p className="text-gray-400 mb-4">
                Tastoria - Where Every Meal Tells a Story. Experience the finest dining with our curated selection of restaurants.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/home" className="text-gray-400 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/preorder" className="text-gray-400 hover:text-white transition-colors">
                    Order Now
                  </Link>
                </li>
                
                
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
              <div className="space-y-2 text-gray-400">
                <p>Email: info@tastoria.com</p>
                <p>Phone: +91 8055221419</p>
                <p>Address: 123 Food Street, Cuisine City, FC 12345</p>
              </div>
              <div className="mt-4 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Tastoria. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
