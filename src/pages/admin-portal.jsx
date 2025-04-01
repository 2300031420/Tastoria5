import { useEffect, useState } from 'react';
import { Typography, Button, Card, CardBody, CardHeader, Chip } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import {
  UserGroupIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  BellAlertIcon,
  QrCodeIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import { toast } from 'react-hot-toast';

export function AdminPortal() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    totalRevenue: 0,
    menuItems: 0,
    totalCustomers: 0,
    avgOrderValue: 0,
    dailyOrders: 0
  });
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || !userData.isAdmin) {
      navigate('/admin-login');
      return;
    }
    setUser(userData);

    // Mock data - replace with actual API calls
    setStats({
      totalOrders: 150,
      activeOrders: 12,
      totalRevenue: 25000,
      menuItems: 45,
      totalCustomers: 89,
      avgOrderValue: 350,
      dailyOrders: 24
    });
  }, [navigate]);

  const addMenuItem = async (menuData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(menuData)
      });

      if (!response.ok) {
        throw new Error('Failed to add menu item');
      }

      const newItem = await response.json();
      setMenuItems(prev => [...prev, newItem]);
      toast.success('Menu item added successfully');
    } catch (error) {
      console.error('Error adding menu item:', error);
      toast.error('Failed to add menu item');
    }
  };

  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/menu');
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast.error('Failed to load menu items');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, percentage }) => (
    <Card className="transform transition-all duration-300 hover:scale-102 hover:shadow-lg border border-gray-100">
      <CardBody className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Typography variant="small" className="font-medium text-gray-600 mb-1">
              {title}
            </Typography>
            <Typography variant="h4" className="font-bold text-gray-900">
              {typeof value === 'number' && title.includes('Revenue') ? `₹${value.toLocaleString()}` : value}
            </Typography>
            {percentage && (
              <div className="flex items-center gap-1 mt-2">
                <ArrowTrendingUpIcon className={`h-4 w-4 text-${color}-500`} />
                <Typography variant="small" className={`text-${color}-500 font-medium`}>
                  +{percentage}% from last month
                </Typography>
              </div>
            )}
          </div>
          <div className={`rounded-full p-3 bg-${color}-50 text-${color}-500`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardBody>
    </Card>
  );

  const ActionCard = ({ title, description, icon: Icon, color, actions }) => (
    <Card className="transform transition-all duration-300 hover:shadow-lg border border-gray-100">
      <CardBody className="p-0">
        <div className="flex flex-col md:flex-row h-full">
          <div className={`bg-${color}-500 p-6 flex items-center justify-center md:w-1/3 rounded-t-lg md:rounded-l-lg md:rounded-tr-none`}>
            <Icon className="h-12 w-12 text-white" />
          </div>
          <div className="p-6 flex flex-col justify-between flex-1">
            <div>
              <Typography variant="h5" color="blue-gray" className="mb-2 font-bold">
                {title}
              </Typography>
              <Typography variant="small" className="font-normal text-gray-600 mb-4">
                {description}
              </Typography>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={index === 0 ? "filled" : "outlined"}
                  color={color}
                  className="flex-1"
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );

  const RecentOrderCard = ({ order }) => (
    <Card className="mb-3 border border-gray-100">
      <CardBody className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-md">
                <ShoppingCartIcon className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <Typography variant="small" className="font-medium">
                  Order #{order.id}
                </Typography>
                <Typography variant="small" color="gray" className="text-xs">
                  {order.time} • {order.items} items
                </Typography>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Chip
              size="sm"
              variant="ghost"
              value={order.status}
              color={
                order.status === "Completed" ? "green" :
                order.status === "In Progress" ? "amber" : "blue"
              }
            />
            <Typography variant="h6" className="font-bold">
              ₹{order.amount}
            </Typography>
          </div>
        </div>
      </CardBody>
    </Card>
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const recentOrders = [
    { id: "1082", time: "10 mins ago", items: 3, status: "New", amount: 450 },
    { id: "1081", time: "25 mins ago", items: 1, status: "In Progress", amount: 150 },
    { id: "1080", time: "1 hour ago", items: 5, status: "Completed", amount: 850 },
    { id: "1079", time: "2 hours ago", items: 2, status: "Completed", amount: 320 },
  ];

  const menuManagementCard = (
    <ActionCard
      title="Menu Management"
      description="Update menu items, categories, and pricing"
      icon={Cog6ToothIcon}
      color="purple"
      actions={[
        { 
          label: "Manage Menu", 
          onClick: () => navigate('/admin/menu')  // You'll need to create this route
        },
        { 
          label: "Add New Item", 
          onClick: () => {
            // You can either navigate to a new page or open a modal
            navigate('/admin/menu/add');  // Create this route
          }
        }
      ]}
    />
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Typography variant="h3" className="font-bold text-white">
                Tastoria Dashboard
              </Typography>
              <Typography className="text-blue-100 mt-1">
                Welcome back, {user?.displayName || 'Admin'}
              </Typography>
            </div>
            <Button
              color="white"
              variant="gradient"
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:shadow-lg hover:from-red-700 hover:to-red-600 transition-all duration-300"
              onClick={() => {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                navigate('/admin-login');
              }}
            >
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={stats.totalRevenue}
            icon={CurrencyDollarIcon}
            color="green"
            percentage="12"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingCartIcon}
            color="blue"
            percentage="8"
          />
          <StatCard
            title="Active Orders"
            value={stats.activeOrders}
            icon={ClipboardDocumentListIcon}
            color="red"
          />
          <StatCard
            title="Daily Orders"
            value={stats.dailyOrders}
            icon={CalendarDaysIcon}
            color="amber"
            percentage="5"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Action Cards */}
          <div className="lg:col-span-2 space-y-6">
            <Typography variant="h5" className="font-bold text-gray-900 mb-4">
              Quick Actions
            </Typography>
            
            <ActionCard
              title="Order Management"
              description="Track and manage all incoming orders in real-time"
              icon={ShoppingCartIcon}
              color="blue"
              actions={[
                { label: "View Active Orders", onClick: () => navigate('/admin/orders/active') },
                { label: "Order History", onClick: () => navigate('/admin/orders/history') }
              ]}
            />
            
            {menuManagementCard}
            
            <ActionCard
              title="Table Reservations"
              description="Manage table bookings and availability"
              icon={ClockIcon}
              color="green"
              actions={[
                { label: "View Reservations", onClick: () => navigate('/admin/reservations') },
                { label: "Manage Tables", onClick: () => navigate('/admin/tables') }
              ]}
            />
          </div>

          {/* Right Column - Recent Orders */}
          <div className="lg:col-span-1">
            <Card className="border border-gray-100 h-full">
              <CardHeader floated={false} shadow={false} className="rounded-none p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <Typography variant="h5" color="blue-gray" className="font-bold">
                    Menu Overview
                  </Typography>
                  <Button
                    variant="text"
                    color="blue"
                    size="sm"
                    onClick={() => navigate('/admin/menu')}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="p-4">
                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {menuItems.slice(0, 5).map((item) => (
                      <div key={item._id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div>
                            <Typography variant="small" className="font-medium">
                              {item.name}
                            </Typography>
                            <Typography variant="small" color="gray" className="text-xs">
                              {item.category}
                            </Typography>
                          </div>
                        </div>
                        <Typography variant="small" className="font-medium">
                          ₹{item.price}
                        </Typography>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Analytics Preview */}
        <Card className="border border-gray-100 mb-8">
          <CardHeader floated={false} shadow={false} className="rounded-none p-4 border-b border-gray-100">
            <Typography variant="h5" color="blue-gray" className="font-bold">
              Sales Overview
            </Typography>
          </CardHeader>
          <CardBody className="p-4">
            <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
              <Typography color="gray" className="text-center">
                Sales chart will appear here
                <br />
                <span className="text-sm text-gray-500">Connect your data source to view analytics</span>
              </Typography>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default AdminPortal; 