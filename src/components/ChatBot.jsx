import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { auth } from '../firebase/config';
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

export function ChatBot() {
    const [messages, setMessages] = useState([{ 
        text: "👋 Hello! I'm your Tastoria assistant. How can I help you today? You can ask me about menus, reservations, or our locations!", 
        sender: "bot" 
    }]);
    const [input, setInput] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getBotResponse = (message) => {
        message = message.toLowerCase().trim();

        // Add specific item queries
        if (message.includes("pizza")) {
            return {
                text: "I'll show you our delicious pizza options!",
                action: "navigateToRestaurant",
                restaurantId: "hangout-cafe",
                requiresAuth: true
            };
        } else if (message.includes("burger")) {
            return {
                text: "Let me show you our burger selection!",
                action: "navigateToRestaurant",
                restaurantId: "ttmm",
                requiresAuth: true
            };
        } else if (message.includes("cake") || message.includes("dessert")) {
            return {
                text: "I'll show you our amazing cakes!",
                action: "navigateToRestaurant",
                restaurantId: "cafe-house",
                requiresAuth: true
            };
        }

        // Direct cafe navigation queries
        if (message.includes("navigate") || message.includes("go to") || message.includes("take me to")) {
            if (message.includes("ttmm")) {
                return {
                    text: "I'll take you to TTMM's page right away!",
                    action: "navigateToRestaurant",
                    restaurantId: "ttmm",
                    requiresAuth: true
                };
            } else if (message.includes("hangout")) {
                return {
                    text: "I'll show you Hangout Cafe's page!",
                    action: "navigateToRestaurant",
                    restaurantId: "hangout-cafe",
                    requiresAuth: true
                };
            } else if (message.includes("cafe house")) {
                return {
                    text: "I'll take you to Cafe House's page!",
                    action: "navigateToRestaurant",
                    restaurantId: "cafe-house",
                    requiresAuth: true
                };
            }
        }

        // Cafe name mentions without specific navigation intent
        if (message.includes("ttmm")) {
            return {
                text: "I'll take you to TTMM's page!",
                action: "navigateToRestaurant",
                restaurantId: "ttmm",
                requiresAuth: true
            };
        } else if (message.includes("hangout")) {
            return {
                text: "I'll show you Hangout Cafe's page!",
                action: "navigateToRestaurant",
                restaurantId: "hangout-cafe",
                requiresAuth: true
            };
        } else if (message.includes("cafe house")) {
            return {
                text: "I'll take you to Cafe House's page!",
                action: "navigateToRestaurant",
                restaurantId: "cafe-house",
                requiresAuth: true
            };
        }
        else if (message.includes("golden bakery")) {
            return {
                text: "I'll take you to Golden Bakery's page!",
                action: "navigateToRestaurant",
                restaurantId: "cafe-house",
                requiresAuth: true
            };
        }
        // Menu-related queries
        if (message.includes("menu")) {
            if (message.includes("hangout")) {
                return {
                    text: "I'll show you Hangout Cafe's menu right away!",
                    action: "navigateToRestaurant",
                    restaurantId: "hangout-cafe",
                    requiresAuth: true
                };
            } else if (message.includes("ttmm")) {
                return {
                    text: "I'll take you to TTMM's menu!",
                    action: "navigateToRestaurant",
                    restaurantId: "ttmm",
                    requiresAuth: true
                };
            } else if (message.includes("cafe house")) {
                return {
                    text: "Let me show you Cafe House's menu!",
                    action: "navigateToRestaurant",
                    restaurantId: "cafe-house",
                    requiresAuth: true
                };
            } else {
                return {
                    text: "We have several cafes with unique menus. Which one would you like to see? We have:\n• Hangout Cafe\n• TTMM\n• Cafe House"
                };
            }
        }

        // Booking-related queries
        if (message.includes("book") || message.includes("reservation") || message.includes("slot")) {
            if (message.includes("ttmm")) {
                return {
                    text: "I'll take you to TTMM's slot booking page!",
                    action: "navigateToRestaurant",
                    restaurantId: "ttmm",
                    requiresAuth: true
                };
            }
            return {
                text: "I can help you book a table. Which cafe would you like to make a reservation at? Currently, table booking is available at TTMM."
            };
        }

        // Location queries
        if (message.includes("location") || message.includes("where") || message.includes("address")) {
            return {
                text: "All our cafes are located in Parbhani. Here are the specific locations:\n• Hangout Cafe: Near City Center\n• TTMM: College Road\n• Cafe House: Main Street"
            };
        }

        // Hours/timing queries
        if (message.includes("hour") || message.includes("timing") || message.includes("open") || message.includes("close")) {
            return {
                text: "Our cafes are open daily from 9 AM to 11 PM. Happy hours are from 3 PM to 6 PM with special discounts!"
            };
        }

        // Special offers/deals
        if (message.includes("offer") || message.includes("deal") || message.includes("discount")) {
            return {
                text: "Current offers:\n• Student discount: 10% off with valid ID\n• Happy Hours: 20% off from 3-6 PM\n• Weekend special: Free dessert with meals above ₹500"
            };
        }

        // Help or general queries
        if (message.includes("help") || message.includes("what") || message.includes("how")) {
            return {
                text: "I can help you with:\n• Viewing restaurant menus\n• Making table reservations\n• Finding cafe locations\n• Information about special offers\n• Opening hours\nWhat would you like to know?"
            };
        }

        // Default response
        return {
            text: "I can help you with menu information, reservations, and locations for our cafes. Feel free to ask about:\n• Restaurant menus\n• Table bookings\n• Locations\n• Opening hours\n• Special offers\n\nOr you can directly ask me about any of our cafes: TTMM, Hangout Cafe, or Cafe House."
        };
    };

    const handleNavigation = async (restaurantId, requiresAuth, action = 'navigateToRestaurant') => {
        try {
            console.log("Attempting navigation to:", restaurantId);
            
            // Check authentication if required
            if (requiresAuth && !isAuthenticated) {
                // Store the intended destination
                localStorage.setItem('redirectAfterLogin', '/preorderpage');
                
                // Add message about authentication requirement
                setMessages(prev => [...prev, {
                    text: "You need to sign in to access this feature. I'll redirect you to the sign-in page.",
                    sender: "bot"
                }]);
                
                // Show toast notification
                toast.error("Please sign in to access this feature");
                
                // Delay navigation to allow user to read the message
                setTimeout(() => {
                    setIsOpen(false);
                    navigate('/sign-in');
                }, 2000);
                return;
            }

            // If authenticated or auth not required, proceed with navigation
            setIsOpen(false);
            if (action === 'navigateToRestaurant') {
                navigate('/preorderpage', {
                    state: { restaurantId: restaurantId }
                });
            } else if (restaurantId === 'ttmm-slot') {
                navigate(`/book-slot/ttmm`);
            }
        } catch (error) {
            console.error("Navigation error:", error);
            setError("Sorry, I couldn't navigate to that page. Please try again.");
            setMessages(prev => [...prev, {
                text: "Sorry, I encountered an error. Please try again or contact support if the problem persists.",
                sender: "bot"
            }]);
        }
    };

    const sendMessage = () => {
        if (!input.trim()) return;
        
        try {
            const userMessage = { text: input, sender: "user" };
            setMessages(prev => [...prev, userMessage]);
            setInput("");
            setError(null);

            // Get bot response
            const response = getBotResponse(input);
            
            // Add bot response to messages
            setTimeout(() => {
                setMessages(prev => [...prev, { 
                    text: response.text, 
                    sender: "bot" 
                }]);

                // Handle navigation if needed
                if (response.action === "navigateToRestaurant" && response.restaurantId) {
                    setTimeout(() => handleNavigation(response.restaurantId, response.requiresAuth), 1000);
                }
            }, 500);
        } catch (error) {
            console.error("Error processing message:", error);
            setError("Sorry, I couldn't process your message. Please try again.");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="fixed bottom-28 sm:bottom-24 right-6 z-50">
            {/* Chat Toggle Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    rounded-full shadow-lg flex items-center justify-center gap-2 
                    bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
                    transform hover:scale-105 transition-all duration-300
                    min-w-[130px] sm:min-w-[160px] py-3 sm:py-3.5 px-4 sm:px-5
                    ${isOpen ? 'bg-blue-600' : ''}
                `}
            >
                {isOpen ? (
                    <>
                        <span className="text-sm sm:text-base font-medium text-white">Close Chat</span>
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth={2} 
                            stroke="currentColor" 
                            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </>
                ) : (
                    <>
                        <span className="text-sm sm:text-base font-medium text-white">Chat with Us</span>
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth={2} 
                            stroke="currentColor" 
                            className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-bounce"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                        </svg>
                    </>
                )}
            </Button>

            {/* Chat Window */}
            {isOpen && (
                <Card className="fixed bottom-44 sm:bottom-44 right-6 w-[calc(100vw-3rem)] sm:w-96 md:w-[450px] shadow-xl max-h-[70vh]">
                    <CardBody className="p-3 sm:p-4">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3 sm:mb-4 border-b pb-3 sm:pb-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="bg-blue-500 rounded-full p-2 sm:p-2.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-5 h-5 sm:w-6 sm:h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                                    </svg>
                                </div>
                                <Typography variant="h6" color="blue-gray" className="text-base sm:text-lg">
                                    Tastoria Assistant
                                </Typography>
                            </div>
                            <div className="flex items-center gap-2">
                                <Typography variant="small" color="gray" className="flex items-center gap-1 text-sm sm:text-base">
                                    <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-green-500"></span>
                                    Online
                                </Typography>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="h-72 sm:h-[400px] overflow-y-auto mb-3 sm:mb-4 pr-2">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.sender === "bot" ? "justify-start" : "justify-end"} mb-3 sm:mb-4`}
                                >
                                    <div
                                        className={`max-w-[80%] p-2.5 sm:p-3 rounded-xl text-sm sm:text-base ${
                                            msg.sender === "bot"
                                                ? "bg-blue-50 text-blue-gray-800"
                                                : "bg-blue-500 text-white"
                                        }`}
                                    >
                                        <Typography className="text-sm sm:text-base" style={{ whiteSpace: 'pre-line' }}>{msg.text}</Typography>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="text-red-500 text-xs sm:text-sm mb-2">
                                {error}
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="flex gap-2 items-center border-t pt-3 sm:pt-4">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your message..."
                                className="flex-1 text-sm sm:text-base"
                                labelProps={{
                                    className: "hidden",
                                }}
                                containerProps={{
                                    className: "min-w-0",
                                }}
                            />
                            <Button
                                onClick={sendMessage}
                                className="rounded-full p-2.5 sm:p-3"
                                color="blue"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                </svg>
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            )}
        </div>
    );
}

export default ChatBot;
