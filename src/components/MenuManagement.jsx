import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const MenuManagement = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Get the token and user info from localStorage
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      // Check if user is logged in and is admin
      if (!token || !user?.isAdmin) {
        toast.error('Admin access required');
        navigate('/admin-login');
        return;
      }
      
      const response = await fetch('http://localhost:5000/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Make sure token format is correct
        },
        body: JSON.stringify(menuData)
      });

      if (response.status === 403) {
        toast.error('Admin access required');
        navigate('/admin-login');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      toast.success('Menu item added successfully');
      // Handle successful response (e.g., clear form, refresh list)
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to add menu item');
    }
  };

  return (
    <div>
      {/* Render your form here */}
    </div>
  );
};

export default MenuManagement; 