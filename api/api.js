import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Health Check Route
app.get("/api/health", (req, res) => {
  console.log("Health check endpoint called");
  res.status(200).json({ status: "healthy" });
});

// Chat Route
app.post("/api/chat", (req, res) => {
  try {
    console.log("Chat endpoint called with body:", req.body);
    const userMessage = req.body.message || "";
    if (!userMessage.trim()) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }
    console.log(`Received message: ${userMessage}`);
    
    const response = getBotResponse(userMessage.toLowerCase());
    console.log(`Sending response: ${JSON.stringify(response)}`);
    
    res.json(response);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Sorry, there was an error processing your request." });
  }
});

// User Registration Route
app.post("/api/users/register", (req, res) => {
  try {
    console.log("Register endpoint called with body:", req.body);
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ 
        message: "Please provide username, email and password" 
      });
    }

    // Here you would typically:
    // 1. Hash the password
    // 2. Check if user already exists
    // 3. Save to database
    // For now, we'll just send a success response
    
    res.status(201).json({ 
      message: "User registered successfully",
      user: {
        username,
        email
      }
    });

  } catch (error) {
    console.error(`Registration error: ${error.message}`);
    res.status(500).json({ 
      message: "Error registering user",
      error: error.message 
    });
  }
});

// Function to handle bot responses
function getBotResponse(message) {
  message = message.toLowerCase().replace(/[-_]/g, " "); // Normalize input

  if (message.includes("slot")) {
    return {
      message: "I'll take you to the slot booking page right away!",
      action: "navigate",
      cafeId: "ttmm-slot"
    };
  }

  if (message.includes("hangout") || message.includes("hagout")) {
    return {
      message: "I'll show you Hangout Cafe's menu!",
      action: "navigate",
      cafeId: "hangout-cafe"
    };
  }

  if (message.includes("cafe house") || message.includes("cafehouse")) {
    return {
      message: "Let me show you Cafe House's menu!",
      action: "navigate",
      cafeId: "cafe-house"
    };
  }

  if (message.includes("ttmm")) {
    return {
      message: "I'll take you to TTMM's menu right away!",
      action: "navigate",
      cafeId: "ttmm"
    };
  }

  if (message.includes("ttmm-slot")) {
    return {
      message: "I'll take you to TTMM's slot booking page right away!",
      action: "navigate",
      cafeId: "ttmm-slot"
    };
  }

  if (message.includes("golden bakery")) {
    return {
      message: "Let me show you Golden Bakery's menu!",
      action: "navigate",
      cafeId: "golden-bakery"
    };
  }

  if (message.includes("menu")) {
    return {
      message: "I can help you with our cafe menus. We have Hangout Cafe, TTMM, and Cafe House. Which one would you like to know about?"
    };
  }

  if (["book", "reservation", "table"].some(word => message.includes(word))) {
    return {
      message: "I can help you book a table. Which cafe would you like to make a reservation at?"
    };
  }

  if (message.includes("location")) {
    return {
      message: "All our cafes are located in Parbhani. Would you like specific directions to any of them?"
    };
  }

  return {
    message: "I can help you with menu information, reservations, and locations for our cafes. What would you like to know?"
  };
}

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
