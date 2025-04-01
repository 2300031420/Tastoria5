// Mock user data for demo purposes
const mockUsers = [
  {
    email: "demo@example.com",
    password: "password123",
    username: "demo_user"
  }
];

export const registerUser = async (userData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Check if user already exists
  if (mockUsers.find(user => user.email === userData.email)) {
    return {
      success: false,
      message: "User already exists"
    };
  }

  // Add new user
  mockUsers.push(userData);

  return {
    success: true,
    message: "Registration successful",
    user: {
      email: userData.email,
      username: userData.username
    }
  };
};

export const loginUser = async (credentials) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Find user
  const user = mockUsers.find(
    user => user.email === credentials.email && user.password === credentials.password
  );

  if (user) {
    return {
      success: true,
      message: "Login successful",
      user: {
        email: user.email,
        username: user.username
      },
      token: "mock-jwt-token"
    };
  }

  return {
    success: false,
    message: "Invalid credentials"
  };
};
