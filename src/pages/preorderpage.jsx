import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { 
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { MagnifyingGlassIcon, XMarkIcon, ShoppingCartIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

function PreorderPage() {
  const { restaurantId } = useParams();
  const location = useLocation();
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [addedItemName, setAddedItemName] = useState('');
  const [quantities, setQuantities] = useState({});
  const [itemsInCart, setItemsInCart] = useState({});
  const navigate = useNavigate();
  const auth = getAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalQuantity, setModalQuantity] = useState(1);
  const scrollContainerRef = useRef(null);

  const categories = [
    { id: 'all', name: 'All Items', icon: '🍽️' },
    { id: 'breakfast', name: 'Breakfast', icon: '🍳' },
    { id: 'lunch', name: 'Lunch', icon: '🍱' },
    { id: 'dinner', name: 'Dinner', icon: '🍖' },
    { id: 'beverages', name: 'Beverages', icon: '🥤' },
    { id: 'desserts', name: 'Desserts', icon: '🍰' },
    { id: 'snacks', name: 'Snacks', icon: '🍟' },
  ];

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/menu');
        if (!response.ok) {
          throw new Error('Failed to fetch menu');
        }
        const data = await response.json();
        setMenu(data);
        setFilteredMenu(data);
      } catch (error) {
        console.error('Error fetching menu:', error);
        // Fallback to dummy data in case of error
        const dummyMenu = [
          { 
            id: 1, 
            name: 'Pizza', 
            price: 299, 
            description: 'Delicious Italian pizza with fresh toppings',
            category: 'lunch',
            image: '/img/pizza.jpg',
            detailedDescription: 'Hand-tossed pizza with a perfect blend of mozzarella cheese, fresh vegetables, and our secret sauce',
            ingredients: ['Mozzarella Cheese', 'Fresh Tomatoes', 'Bell Peppers', 'Olive Oil', 'Italian Herbs'],
            nutritionalInfo: {
              calories: '266 kcal',
              protein: '12g',
              carbs: '30g',
              fat: '10g'
            },
            preparationTime: '20-25 mins',
            spicyLevel: 'Medium',
            isVegetarian: true,
            allergens: ['Dairy', 'Gluten'],
            servingSize: '8 inches',
            rating: 4.8
          },
          { 
            id: 2, 
            name: 'Classic Burger', 
            price: 199, 
            description: 'Juicy beef burger with cheese and veggies',
            category: 'snacks',
            image: '/img/burger.jpg',
            detailedDescription: 'Premium beef patty with melted cheese, fresh lettuce, tomatoes, and our special sauce',
            ingredients: ['Beef Patty', 'Cheese', 'Lettuce', 'Tomatoes', 'Special Sauce'],
            nutritionalInfo: {
              calories: '350 kcal',
              protein: '20g',
              carbs: '25g',
              fat: '15g'
            },
            preparationTime: '15-20 mins',
            spicyLevel: 'Mild',
            isVegetarian: true,
            allergens: ['Dairy', 'Gluten', 'Soy'],
            servingSize: '1 piece',
            rating: 4.6
          },
          { 
            id: 3, 
            name: 'Cappuccino', 
            price: 149, 
            description: 'Rich and creamy Italian coffee',
            category: 'beverages',
            image: '/img/Cappuccino.jpg',
            detailedDescription: 'Premium coffee beans brewed to perfection with steamed milk and foam',
            ingredients: ['Espresso', 'Steamed Milk', 'Milk Foam'],
            nutritionalInfo: {
              calories: '120 kcal',
              protein: '8g',
              carbs: '12g',
              fat: '4g'
            },
            preparationTime: '5-7 mins',
            spicyLevel: 'None',
            isVegetarian: true,
            allergens: ['Dairy'],
            servingSize: '240ml',
            rating: 4.7
          },
          {
            id: 4,
            name: 'Chocolate Cake',
            price: 399,
            description: 'Decadent chocolate cake with rich frosting',
            category: 'desserts',
            image: '/img/cake.jpg',
            detailedDescription: 'Three layers of moist chocolate cake with rich chocolate ganache and whipped cream',
            ingredients: ['Dark Chocolate', 'Flour', 'Eggs', 'Butter', 'Sugar', 'Whipped Cream'],
            nutritionalInfo: {
              calories: '380 kcal',
              protein: '5g',
              carbs: '45g',
              fat: '18g'
            },
            preparationTime: '10-15 mins',
            spicyLevel: 'None',
            isVegetarian: true,
            allergens: ['Dairy', 'Eggs', 'Gluten'],
            servingSize: '1 slice',
            rating: 4.9
          },
          {
            id: 5,
            name: 'Ice Cream',
            price: 150,
            description: 'Creamy ice cream with a variety of flavors',
            category: 'desserts',
            image: '/img/icecream.jpg',
            detailedDescription: 'Smooth and creamy ice cream made with fresh ingredients and natural flavors',
            ingredients: ['Cream', 'Milk', 'Sugar', 'Natural Flavors'],
            nutritionalInfo: {
              calories: '200 kcal',
              protein: '4g',
              carbs: '25g',
              fat: '10g'
            },
            preparationTime: '2-3 mins',
            spicyLevel: 'None',
            isVegetarian: true,
            allergens: ['Dairy'],
            servingSize: '2 scoops',
            rating: 4.5
          },
          {
            id: 6,
            name: 'Pasta',
            price: 200,
            description: 'Creamy pasta with a variety of sauces',
            category: 'breakfast',
            image: '/img/pasta.jpg',
            detailedDescription: 'Al dente pasta tossed in creamy sauce with fresh herbs and parmesan',
            ingredients: ['Pasta', 'Cream Sauce', 'Parmesan', 'Fresh Herbs', 'Olive Oil'],
            nutritionalInfo: {
              calories: '320 kcal',
              protein: '12g',
              carbs: '40g',
              fat: '14g'
            },
            preparationTime: '15-20 mins',
            spicyLevel: 'Mild',
            isVegetarian: true,
            allergens: ['Dairy', 'Gluten'],
            servingSize: '300g',
            rating: 4.7
          }
        ];
        setMenu(dummyMenu);
        setFilteredMenu(dummyMenu);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [restaurantId]);

  // Enhanced search and filter functionality
  useEffect(() => {
    let filtered = menu;

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => 
        item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMenu(filtered);
  }, [searchQuery, selectedCategory, menu]);

  useEffect(() => {
    if (auth.currentUser) {
      const savedCart = localStorage.getItem(`cart_${auth.currentUser.uid}`);
      if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        const cartQuantities = cartItems.reduce((acc, item) => {
          acc[item.id] = item.quantity;
          return acc;
        }, {});
        setQuantities(prev => ({ ...prev, ...cartQuantities }));
      }
    }
  }, [auth.currentUser]);

  useEffect(() => {
    if (auth.currentUser) {
      const savedCart = localStorage.getItem(`cart_${auth.currentUser.uid}`);
      if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        const cartStatus = cartItems.reduce((acc, item) => {
          acc[item.id] = true;
          return acc;
        }, {});
        setItemsInCart(cartStatus);
      }
    }
  }, [auth.currentUser]);

  // Add this useEffect to handle automatic modal opening
  useEffect(() => {
    if (location.state?.selectedItemId && menu.length > 0) {
      const selectedItem = menu.find(item => item.id.toString() === location.state.selectedItemId.toString());
      if (selectedItem) {
        setSelectedItem(selectedItem);
        setIsModalOpen(true);
      }
    }
  }, [location.state, menu]);

  const updateQuantity = (itemId, change) => {
    setQuantities(prev => {
      const currentQuantity = prev[itemId] || 1;
      const newQuantity = currentQuantity + change;
      
      // If item is in cart
      if (itemsInCart[itemId]) {
        const userId = auth.currentUser.uid;
        const savedCart = localStorage.getItem(`cart_${userId}`);
        if (savedCart) {
          const cartItems = JSON.parse(savedCart);
          const itemIndex = cartItems.findIndex(item => item.id === itemId);
          
          if (itemIndex !== -1) {
            if (newQuantity <= 0) {
              // Remove item if quantity becomes 0
              cartItems.splice(itemIndex, 1);
              setItemsInCart(prev => ({ ...prev, [itemId]: false }));
              localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
              window.dispatchEvent(new Event('cartUpdated'));
              
              // Reset quantity to 1 for future additions
              return { ...prev, [itemId]: 1 };
            } else {
              cartItems[itemIndex].quantity = newQuantity;
              localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
              window.dispatchEvent(new Event('cartUpdated'));
            }
          }
        }
      }
      
      // Don't allow quantity to go below 1 for non-cart items
      return { ...prev, [itemId]: Math.max(1, newQuantity) };
    });
  };

  const addToCart = (item) => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const cartKey = `cart_${userId}`;
      let cartItems = [];
      
      // Get existing cart
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        try {
          cartItems = JSON.parse(savedCart);
        } catch (error) {
          console.error('Error parsing cart:', error);
          cartItems = [];
        }
      }

      // Add or update item
      const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);
      if (existingItemIndex >= 0) {
        cartItems[existingItemIndex].quantity += 1;
      } else {
        cartItems.push({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1
        });
      }

      // Save cart
      localStorage.setItem(cartKey, JSON.stringify(cartItems));

      // Dispatch cart update event
      window.dispatchEvent(new Event('cartUpdated'));
      
      toast.success('Item added to cart');
    } else {
      toast.error('Please sign in to add items to cart');
    }
  };

  const removeFromCart = (itemId) => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const savedCart = localStorage.getItem(`cart_${userId}`);
      let cartItems = savedCart ? JSON.parse(savedCart) : [];
      
      // Remove or decrease quantity
      const existingItemIndex = cartItems.findIndex(item => item.id === itemId);
      if (existingItemIndex >= 0) {
        if (cartItems[existingItemIndex].quantity > 1) {
          cartItems[existingItemIndex].quantity -= 1;
        } else {
          cartItems.splice(existingItemIndex, 1);
        }
      }

      // Save updated cart
      localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));

      // Dispatch cart update event
      window.dispatchEvent(new Event('cartUpdated'));
      
      toast.success('Item removed from cart');
    }
  };

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setModalQuantity(quantities[item.id] || 1);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setModalQuantity(1);
  };

  const handleModalQuantityChange = (change) => {
    setModalQuantity(prev => Math.max(1, prev + change));
  };

  const handleAddToCartFromModal = () => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const savedCart = localStorage.getItem(`cart_${userId}`);
      let cartItems = savedCart ? JSON.parse(savedCart) : [];

      const itemToAdd = {
        ...selectedItem,
        quantity: modalQuantity
      };

      const existingItemIndex = cartItems.findIndex(item => item.id === selectedItem.id);

      if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].quantity = modalQuantity;
      } else {
        cartItems.push(itemToAdd);
      }

      localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
      setItemsInCart(prev => ({ ...prev, [selectedItem.id]: true }));
      setQuantities(prev => ({ ...prev, [selectedItem.id]: modalQuantity }));
      
      window.dispatchEvent(new Event('cartUpdated'));
      handleCloseModal();
      
      toast.success(`Added ${modalQuantity} ${selectedItem.name}(s) to cart`);
    }
  };

  // Add scroll handler function
  const scrollMenu = (direction) => {
    const container = scrollContainerRef.current;
    const scrollAmount = 300; // Adjust this value as needed
    
    if (container) {
      const targetScroll = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-[#d0b290] min-h-screen">
      {/* Logo */}
      <div className="hidden md:block pt-4 pl-4">
        <img 
          src="/img/Tastoria.jpg"
          alt="Tastoria Logo"
          className="h-20 w-32 lg:h-26 lg:w-40"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 pb-28 md:pb-24">
        {/* Search Bar */}
        <div className="sticky top-0 z-10 bg-[#d0b290]/90 backdrop-blur-sm px-3 py-3 sm:px-4 sm:py-4">
          <div className="relative w-full max-w-xl mx-auto">
            <Input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 pl-11 text-sm 
                text-gray-700 bg-white/95 backdrop-blur-sm border border-gray-200/80 
                rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-all duration-200"
              labelProps={{
                className: "hidden",
              }}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="px-2 sm:px-4 lg:px-6 pt-3">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-8">
            {filteredMenu.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenModal(item)}
                className="relative bg-white rounded-xl shadow-md overflow-hidden transform transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
              >
                {/* Image container - Increased height for larger screens */}
                <div className="relative h-40 sm:h-48 md:h-56 lg:h-64">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
                </div>

                {/* Content overlay - Adjusted padding and text sizes */}
                <div className="absolute bottom-3 sm:bottom-4 lg:bottom-5 left-3 sm:left-4 lg:left-5 text-white">
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold line-clamp-1">{item.name}</h3>
                  <p className="text-xs sm:text-sm lg:text-base line-clamp-1 opacity-90">{item.description}</p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 lg:gap-3 mt-2">
                    <span className="bg-green-500/90 px-2 py-1 rounded-full text-[10px] sm:text-xs lg:text-sm">
                      {item.isVegetarian ? 'Veg' : 'Non-Veg'}
                    </span>
                    <span className="bg-blue-500/90 px-2 py-1 rounded-full text-[10px] sm:text-xs lg:text-sm">
                      {item.preparationTime}
                    </span>
                    <span className="bg-yellow-500/90 px-2 py-1 rounded-full text-[10px] sm:text-xs lg:text-sm flex items-center gap-0.5">
                      <span>★</span> {item.rating}
                    </span>
                  </div>
                </div>

                {/* Price tag - Increased size for larger screens */}
                <div className="absolute top-3 right-3 lg:top-4 lg:right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 lg:px-3 lg:py-1.5 rounded-full">
                  <span className="text-sm sm:text-base lg:text-lg font-semibold">₹{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Cart Button - Fixed at bottom left */}
      <div className="md:hidden fixed bottom-20 left-4 z-30">
        <Button
          size="lg"
          color="blue"
          className="rounded-full shadow-lg flex items-center gap-2"
          onClick={() => navigate('/cart')}
        >
          <ShoppingCartIcon className="h-5 w-5" />
          <span>Cart</span>
          {Object.keys(itemsInCart).length > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {Object.keys(itemsInCart).length}
            </span>
          )}
        </Button>
      </div>

      {/* Categories Bar - Adjust z-index to be below cart button */}
      <div className="fixed bottom-0 left-0 w-full z-20">
        <div className="bg-white/95 backdrop-blur-sm p-3 shadow-lg border-t border-gray-200/50">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-safe snap-x snap-mandatory">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 
                  rounded-full text-sm font-medium snap-start
                  transition-all duration-200 ${
                    selectedCategory === category.id 
                      ? 'bg-blue-500 text-white shadow-md scale-105'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Item Detail Modal */}
      <Dialog
        size="lg"
        open={isModalOpen}
        handler={handleCloseModal}
        className="bg-white rounded-xl shadow-xl"
      >
        {selectedItem && (
          <>
            <DialogHeader className="flex items-center justify-between py-3 px-4">
              <Typography variant="h5" color="blue-gray" className="text-lg">
                {selectedItem.name}
              </Typography>
              <IconButton
                color="blue-gray"
                size="sm"
                variant="text"
                onClick={handleCloseModal}
              >
                <XMarkIcon strokeWidth={2} className="h-4 w-4" />
              </IconButton>
            </DialogHeader>

            <DialogBody divider className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Image Section */}
                <div className="relative h-[250px] md:h-[300px]">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                  {selectedItem.isVegetarian && (
                    <div className="absolute top-3 left-3 bg-green-500 px-2 py-1 rounded-full">
                      <Typography className="text-white text-xs font-medium">
                        Vegetarian
                      </Typography>
                    </div>
                  )}
                </div>

                {/* Details Section */}
                <div className="p-4 space-y-3">
                  <div>
                    <Typography variant="h6" color="blue-gray" className="text-sm mb-1">
                      Description
                    </Typography>
                    <Typography className="text-gray-700 text-sm">
                      {selectedItem.detailedDescription}
                    </Typography>
                  </div>

                  {/* Preparation Details */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">Prep Time:</span>
                        <span>{selectedItem.preparationTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">Spicy Level:</span>
                        <span>{selectedItem.spicyLevel}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">Serving:</span>
                        <span>{selectedItem.servingSize}</span>
                      </div>
                    </div>

                    {/* Nutritional Info */}
                    <div className="space-y-1.5">
                      <Typography variant="h6" color="blue-gray" className="text-sm mb-1">
                        Nutritional Info
                      </Typography>
                      <div className="space-y-0.5 text-sm">
                        <div>Calories: {selectedItem.nutritionalInfo.calories}</div>
                        <div>Protein: {selectedItem.nutritionalInfo.protein}</div>
                        <div>Carbs: {selectedItem.nutritionalInfo.carbs}</div>
                        <div>Fat: {selectedItem.nutritionalInfo.fat}</div>
                      </div>
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div>
                    <Typography variant="h6" color="blue-gray" className="text-sm mb-1">
                      Ingredients
                    </Typography>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedItem.ingredients.map((ingredient) => (
                        <span
                          key={ingredient}
                          className="bg-blue-gray-50 px-2 py-0.5 rounded-full text-xs"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Allergens */}
                  {selectedItem.allergens && selectedItem.allergens.length > 0 && (
                    <div>
                      <Typography variant="h6" color="blue-gray" className="text-sm mb-1">
                        Allergens
                      </Typography>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedItem.allergens.map((allergen) => (
                          <span
                            key={allergen}
                            className="bg-red-50 text-red-700 px-2 py-0.5 rounded-full text-xs"
                          >
                            {allergen}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity and Price */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3">
                      <Typography color="blue-gray" className="text-sm">Quantity:</Typography>
                      <div className="flex items-center gap-1 bg-blue-gray-50 rounded-full">
                        <IconButton
                          variant="text"
                          size="sm"
                          className="h-6 w-6"
                          onClick={() => handleModalQuantityChange(-1)}
                        >
                          -
                        </IconButton>
                        <Typography className="w-8 text-center text-sm">
                          {modalQuantity}
                        </Typography>
                        <IconButton
                          variant="text"
                          size="sm"
                          className="h-6 w-6"
                          onClick={() => handleModalQuantityChange(1)}
                        >
                          +
                        </IconButton>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Typography variant="h6" color="blue-gray" className="text-base">
                        Total: ₹{selectedItem.price * modalQuantity}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </DialogBody>

            <DialogFooter className="space-x-2 p-3">
              <Button
                variant="outlined"
                color="blue-gray"
                size="sm"
                onClick={handleCloseModal}
                className="text-sm"
              >
                Close
              </Button>
              <Button
                variant="gradient"
                color="blue"
                size="sm"
                onClick={handleAddToCartFromModal}
                className="text-sm"
              >
                Add to Cart
              </Button>
            </DialogFooter>
          </>
        )}
      </Dialog>

      <Toaster />
    </div>
  );
}

export default PreorderPage;
