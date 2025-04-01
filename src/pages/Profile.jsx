import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Avatar,
  Switch,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Input,
  Select,
  Option,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Spinner,
  IconButton,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
  UserIcon,
  ClockIcon,
  HeartIcon,
  Cog6ToothIcon,
  MapPinIcon,
  WalletIcon,
  StarIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  PhotoIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

const API_URL = import.meta.env.VITE_API_URL;

export function Profile() {
  const { user, logout, apiCall } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: "HOME",
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phoneNumber: '',
    photoURL: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);

  const tabs = [
    {
      label: "Overview",
      value: "overview",
      icon: UserIcon,
    },
    {
      label: "Orders",
      value: "orders",
      icon: ClockIcon,
    },
    {
      label: "Bookings",
      value: "bookings",
      icon: HeartIcon,
    },
    {
      label: "Settings",
      value: "settings",
      icon: Cog6ToothIcon,
    },
  ];

  useEffect(() => {
    fetchUserData();
  }, []);

  // Initialize edit form when userData changes
  useEffect(() => {
    if (userData) {
      setEditForm({
        name: userData.name || '',
        phoneNumber: userData.phoneNumber || '',
        photoURL: userData.photoURL || ''
      });
    }
  }, [userData]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token ? 'exists' : 'missing'); // Debug log

      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Making request to:', `${API_URL}/users/profile`); // Debug log
      console.log('With token:', token); // Debug log

      const response = await axios.get(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Profile response:', response.data); // Debug log

      if (!response.data) {
        throw new Error('No data received from server');
      }

      setUserData(response.data);
      setOrders(response.data.recentOrders || []);
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error("Error fetching profile:", error);
      console.error('Full error object:', JSON.stringify(error, null, 2)); // Debug log

      if (error.response) {
        console.error('Error response:', error.response.data);
        if (error.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/sign-in', { 
            state: { message: 'Session expired. Please sign in again.' }
          });
        } else {
          setError(error.response.data.message || 'Failed to fetch profile data');
        }
      } else if (error.request) {
        setError('No response from server. Please try again later.');
      } else {
        setError(error.message || 'An error occurred');
      }
      
      toast.error(error.response?.data?.message || 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/sign-in');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('phoneNumber', editForm.phoneNumber);
      if (selectedFile) {
        formData.append('profilePicture', selectedFile);
      }

      const response = await axios.put(
        "http://localhost:5000/api/users/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );

      if (response.data.success) {
        setUserData(response.data.data);
        setIsEditProfileOpen(false);
        toast.success("Profile updated successfully");
        setSelectedFile(null);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleAddAddress = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/users/address",
        newAddress,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUserData(response.data.data);
        setIsAddressModalOpen(false);
        setNewAddress({
          type: "HOME",
          street: "",
          city: "",
          state: "",
          zipCode: "",
        });
        toast.success("Address added successfully");
      }
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("Failed to add address");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:5000/api/users/address/${addressId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUserData(response.data.data);
        toast.success("Address deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File size should be less than 5MB");
        return;
      }
      setSelectedFile(file);
      
      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, photoURL: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-12 w-12" color="blue" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Card>
          <CardBody>
            <Tabs value={activeTab} onChange={(value) => setActiveTab(value)}>
              <TabsHeader>
                {tabs.map(({ label, value, icon: Icon }) => (
                  <Tab key={value} value={value}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5" />
                      {label}
                    </div>
                  </Tab>
                ))}
              </TabsHeader>

              <TabsBody>
                <TabPanel value="overview">
                  <div className="space-y-8">
                    {/* Profile Header with Edit Button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar
                            src={userData?.photoURL || "https://via.placeholder.com/150"}
                            alt="profile-picture"
                            size="xxl"
                            className="rounded-full border-4 border-white shadow-xl"
                          />
                          <IconButton
                            size="sm"
                            color="blue"
                            className="absolute bottom-0 right-0 rounded-full"
                            onClick={() => setIsEditProfileOpen(true)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </div>
                        <div>
                          <Typography variant="h4" color="blue-gray">
                            {userData?.name}
                          </Typography>
                          <Typography color="gray" className="font-normal">
                            {userData?.email}
                          </Typography>
                          {userData?.phoneNumber && (
                            <Typography color="gray" className="font-normal flex items-center gap-1">
                              <PhoneIcon className="h-4 w-4" />
                              {userData.phoneNumber}
                            </Typography>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Basic Information */}
                    <Card>
                      <CardBody>
                        <Typography variant="h6" color="blue-gray" className="mb-4">
                          Basic Information
                        </Typography>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Typography color="gray">Phone Number</Typography>
                            <Typography>{userData?.phoneNumber || "Not set"}</Typography>
                          </div>
                          <div>
                            <Typography color="gray">Member Since</Typography>
                            <Typography>
                              {new Date(userData?.createdAt).toLocaleDateString()}
                            </Typography>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    {/* Addresses */}
                    <Card>
                      <CardBody>
                        <div className="flex justify-between items-center mb-4">
                          <Typography variant="h6" color="blue-gray">
                            Saved Addresses
                          </Typography>
                          <Button
                            size="sm"
                            onClick={() => setIsAddressModalOpen(true)}
                          >
                            Add Address
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {userData?.addresses?.map((address) => (
                            <Card key={address._id} className="p-4">
                              <div className="flex justify-between">
                                <div className="flex items-start gap-4">
                                  <MapPinIcon className="w-5 h-5 text-blue-500" />
                                  <div>
                                    <Typography variant="h6">{address.type}</Typography>
                                    <Typography color="gray">
                                      {address.street}, {address.city}
                                    </Typography>
                                    <Typography color="gray">
                                      {address.state} - {address.zipCode}
                                    </Typography>
                                  </div>
                                </div>
                                <IconButton
                                  variant="text"
                                  color="red"
                                  onClick={() => handleDeleteAddress(address._id)}
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </IconButton>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </CardBody>
                    </Card>

                    {/* Wallet */}
                    <Card>
                      <CardBody>
                        <Typography variant="h6" color="blue-gray" className="mb-4">
                          Wallet Balance
                        </Typography>
                        <div className="flex items-center gap-4">
                          <WalletIcon className="w-8 h-8 text-blue-500" />
                          <Typography variant="h4">
                            ₹{userData?.wallet?.balance || 0}
                          </Typography>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </TabPanel>

                <TabPanel value="orders">
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order._id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <Typography variant="h6">
                              Order #{order._id.slice(-6)}
                            </Typography>
                            <Typography color="gray">
                              {order.place.name}
                            </Typography>
                            <Typography>
                              Total: ₹{order.totalAmount}
                            </Typography>
                          </div>
                          <div className="text-right">
                            <Typography color="gray">
                              {new Date(order.orderDate).toLocaleDateString()}
                            </Typography>
                            <Typography
                              color={
                                order.status === "COMPLETED"
                                  ? "green"
                                  : order.status === "CANCELLED"
                                  ? "red"
                                  : "blue"
                              }
                            >
                              {order.status}
                            </Typography>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabPanel>

                <TabPanel value="bookings">
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <Card key={booking._id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <Typography variant="h6">
                              {booking.place.name}
                            </Typography>
                            <Typography color="gray">
                              {new Date(booking.date).toLocaleString()}
                            </Typography>
                            <Typography>
                              Seats: {booking.numberOfSeats}
                            </Typography>
                          </div>
                          <Typography
                            color={
                              booking.status === "CONFIRMED" ? "green" : "red"
                            }
                          >
                            {booking.status}
                          </Typography>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabPanel>

                <TabPanel value="settings">
                  <div className="space-y-6">
                    {/* Preferences */}
                    <Card>
                      <CardBody>
                        <Typography variant="h6" color="blue-gray" className="mb-4">
                          Preferences
                        </Typography>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <Typography>Dark Mode</Typography>
                              <Typography variant="small" color="gray">
                                Enable dark theme
                              </Typography>
                            </div>
                            <Switch
                              checked={userData?.preferences?.darkMode}
                              onChange={(e) =>
                                handleUpdateProfile({
                                  preferences: {
                                    ...userData.preferences,
                                    darkMode: e.target.checked,
                                  },
                                })
                              }
                            />
                          </div>
                          <div className="flex justify-between items-center">
                            <div>
                              <Typography>Notifications</Typography>
                              <Typography variant="small" color="gray">
                                Receive order updates
                              </Typography>
                            </div>
                            <Switch
                              checked={userData?.preferences?.notifications}
                              onChange={(e) =>
                                handleUpdateProfile({
                                  preferences: {
                                    ...userData.preferences,
                                    notifications: e.target.checked,
                                  },
                                })
                              }
                            />
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    {/* Account Actions */}
                    <Card>
                      <CardBody>
                        <Typography variant="h6" color="blue-gray" className="mb-4">
                          Account Actions
                        </Typography>
                        <div className="space-y-4">
                          <Button
                            color="red"
                            variant="outlined"
                            onClick={handleLogout}
                            fullWidth
                          >
                            Logout
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </TabPanel>
              </TabsBody>
            </Tabs>
          </CardBody>
        </Card>
      </div>

      {/* Add Address Modal */}
      <Dialog open={isAddressModalOpen} handler={() => setIsAddressModalOpen(false)}>
        <DialogHeader>Add New Address</DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            <Select
              label="Address Type"
              value={newAddress.type}
              onChange={(value) =>
                setNewAddress({ ...newAddress, type: value })
              }
            >
              <Option value="HOME">Home</Option>
              <Option value="OFFICE">Office</Option>
              <Option value="OTHER">Other</Option>
            </Select>
            <Input
              label="Street Address"
              value={newAddress.street}
              onChange={(e) =>
                setNewAddress({ ...newAddress, street: e.target.value })
              }
            />
            <Input
              label="City"
              value={newAddress.city}
              onChange={(e) =>
                setNewAddress({ ...newAddress, city: e.target.value })
              }
            />
            <Input
              label="State"
              value={newAddress.state}
              onChange={(e) =>
                setNewAddress({ ...newAddress, state: e.target.value })
              }
            />
            <Input
              label="ZIP Code"
              value={newAddress.zipCode}
              onChange={(e) =>
                setNewAddress({ ...newAddress, zipCode: e.target.value })
              }
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setIsAddressModalOpen(false)}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button color="blue" onClick={handleAddAddress}>
            Add Address
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Edit Profile Modal */}
      <Dialog open={isEditProfileOpen} handler={() => setIsEditProfileOpen(false)}>
        <DialogHeader>Edit Profile</DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center gap-4">
              <Avatar
                src={editForm.photoURL || "https://via.placeholder.com/150"}
                alt="profile-picture"
                size="xxl"
                className="rounded-full border-4 border-white shadow-xl"
              />
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="profile-picture"
                  onChange={handleFileSelect}
                />
                <label
                  htmlFor="profile-picture"
                  className="flex items-center gap-2 cursor-pointer text-blue-500 hover:text-blue-700"
                >
                  <PhotoIcon className="h-5 w-5" />
                  Change Photo
                </label>
              </div>
            </div>

            {/* Name Input */}
            <Input
              label="Full Name"
              value={editForm.name}
              onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
            />

            {/* Phone Number Input */}
            <Input
              label="Phone Number"
              value={editForm.phoneNumber}
              onChange={(e) => setEditForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setIsEditProfileOpen(false)}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button color="blue" onClick={handleUpdateProfile}>
            Save Changes
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Profile; 