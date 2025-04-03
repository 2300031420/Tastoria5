import {
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast } from 'react-hot-toast';
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../context/AuthContext";

console.log('API URL:', import.meta.env.VITE_API_URL);

export function SignUp() {
  const navigate = useNavigate();
  const auth = getAuth();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOTP] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registrationEmail, setRegistrationEmail] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Basic validation
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError("All fields are required");
        setIsLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long");
        setIsLoading(false);
        return;
      }

      const result = await signup(formData.email, formData.password, formData.name);
      
      if (result?.success) {
        setRegistrationEmail(formData.email);
        setShowOTPInput(true);
        toast.success('OTP sent to your email!');
      } else {
        setError(result?.error?.message || 'Failed to create account');
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registrationEmail,
          otp: otp
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Registration successful! Please sign in.');
        navigate('/sign-in');
      } else {
        throw new Error(data.message || 'OTP verification failed');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error(error.message || 'Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      console.log('Google Auth User Data:', user);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          googleId: user.uid,
          photoUrl: user.photoURL,
          emailVerified: user.emailVerified
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register with Google');
      }

      const data = await response.json();
      console.log('Backend Response:', data);

      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      
      toast.success('Google sign-in successful!');
      navigate('/');
    } catch (error) {
      console.error('Google signup error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-up cancelled');
      } else {
        toast.error(error.message || 'Google sign-up failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="m-8 flex">
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/Tastoria.jpg"
          className="h-full w-full object-cover rounded-3xl"
          alt="Tastoria"
        />
      </div>
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Join Us</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
            {showOTPInput ? 'Enter the verification code sent to your email.' : 'Enter your details to register.'}
          </Typography>
        </div>

        {!showOTPInput ? (
          <>
            {/* Google Sign Up Button */}
            <button
              onClick={handleGoogleSignUp}
              className="flex items-center justify-center gap-2 w-full max-w-sm px-6 py-3 mt-6 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
            >
              <FcGoogle className="w-5 h-5" />
              <span className="font-medium">Continue with Google</span>
            </button>

            <div className="w-full max-w-sm mt-6 mb-4 flex items-center justify-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Registration Form */}
            <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleInitialSubmit}>
              <div className="mb-4 flex flex-col gap-6">
                <Input
                  size="lg"
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <Input
                  size="lg"
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <Input
                  type="password"
                  size="lg"
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <Input
                  type="password"
                  size="lg"
                  label="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
              <Button className="mt-6" fullWidth type="submit" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </>
        ) : (
          // OTP Verification Form
          <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleOTPVerification}>
            <div className="mb-4">
              <Input
                size="lg"
                label="Verification Code"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                placeholder="Enter 6-digit code"
              />
            </div>
            <Button className="mt-6" fullWidth type="submit" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify & Create Account"}
            </Button>
            <Button
              variant="text"
              color="blue-gray"
              className="mt-4"
              fullWidth
              onClick={() => setShowOTPInput(false)}
            >
              Back to Registration
            </Button>
          </form>
        )}

        <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
          Already have an account?
          <Link to="/sign-in" className="text-gray-900 ml-1">Sign in</Link>
        </Typography>
      </div>
    </section>
  );
}

export default SignUp;
