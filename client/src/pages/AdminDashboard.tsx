import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { 
  BusinessIcon, 
  PeopleIcon, 
  AssignmentIcon, 
  PaymentsIcon,
  ArrowUpwardIcon
} from '@/assets/icons/CategoryIcons';
import { Activity, BusinessByCategory, Stats, Business, ServiceRequest, User, Payment } from '@/types';
import { formatCurrency, getIconColor, getStatusColor, formatDate } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminDashboard: React.FC = () => {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Use React Query to fetch data
  const { data: businesses = [] } = useQuery({ 
    queryKey: ['/api/admin/businesses'],
    enabled: isAuthenticated && user?.userType === 'admin'
  });
  
  const { data: serviceRequests = [] } = useQuery({ 
    queryKey: ['/api/admin/service-requests'],
    enabled: isAuthenticated && user?.userType === 'admin'
  });
  
  const { data: allUsers = [] } = useQuery({ 
    queryKey: ['/api/admin/users'],
    enabled: isAuthenticated && user?.userType === 'admin'
  });
  
  const { data: payments = [] } = useQuery({ 
    queryKey: ['/api/admin/payments'],
    enabled: isAuthenticated && user?.userType === 'admin'
  });
  
  // Derive stats from fetched data
  const stats: Stats = {
    totalBusinesses: businesses.length,
    activeCustomers: allUsers.filter((u: User) => u.userType === 'customer').length,
    serviceRequests: serviceRequests.length,
    revenue: payments.reduce((total: number, payment: Payment) => 
      payment.status === 'completed' ? total + payment.amount : total, 0)
  };
  
  // Calculate business categories
  const businessCategories = React.useMemo(() => {
    const categories: Record<string, number> = {};
    businesses.forEach((business: Business) => {
      categories[business.category] = (categories[business.category] || 0) + 1;
    });
    
    const colors = ['#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#FF5722'];
    const total = businesses.length;
    
    return Object.entries(categories).map(([category, count], index) => ({
      category,
      percentage: total ? Math.round((count / total) * 100) : 0,
      color: colors[index % colors.length]
    }));
  }, [businesses]);
  
  // Get recent activity - in a real app this would be fetched from the server
  const recentActivity: Activity[] = React.useMemo(() => {
    const combined = [
      ...businesses.map((b: Business) => ({
        id: `business-${b.id}`,
        type: 'business',
        title: `New Business Registered`,
        subtitle: b.name,
        time: formatDate(b.createdAt),
        icon: 'business'
      })).slice(0, 2),
      ...serviceRequests.map((sr: ServiceRequest) => ({
        id: `request-${sr.id}`,
        type: 'request',
        title: `New Service Request`,
        subtitle: sr.title,
        time: formatDate(sr.createdAt),
        icon: 'assignment'
      })).slice(0, 2),
      ...payments.map((p: Payment) => ({
        id: `payment-${p.id}`,
        type: 'payment',
        title: `New Payment`,
        subtitle: `${formatCurrency(p.amount)} - ${p.status}`,
        time: formatDate(p.createdAt),
        icon: 'payments'
      })).slice(0, 2)
    ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 5);
    
    return combined;
  }, [businesses, serviceRequests, payments]);
  
  // Get recent businesses for the table
  const recentBusinesses = businesses.slice(0, 4);
  
  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // Sidebar links - clicking these links will change the active tab
  const sidebarLinks = [
    { path: '#overview', label: 'Overview', icon: 'dashboard', onClick: () => handleTabChange('overview') },
    { path: '#businesses', label: 'Businesses', icon: 'business', onClick: () => handleTabChange('businesses') },
    { path: '#requests', label: 'Service Requests', icon: 'assignment', onClick: () => handleTabChange('requests') },
    { path: '#users', label: 'Users', icon: 'people', onClick: () => handleTabChange('users') },
    { path: '#payments', label: 'Payments', icon: 'payments', onClick: () => handleTabChange('payments') },
    { path: '#settings', label: 'Settings', icon: 'settings', onClick: () => handleTabChange('settings') }
  ];
  
  return (
    <div className="flex flex-col md:flex-row">
      <DashboardSidebar title="Admin Dashboard" links={sidebarLinks} />
      
      <div className="flex-1 bg-gray-100">
        <DashboardHeader 
          title={`Admin ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`} 
          notificationCount={5} 
        />
        
        <div className="container mx-auto p-4">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="businesses">Businesses</TabsTrigger>
              <TabsTrigger value="requests">Requests</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold font-heading">Total Businesses</h3>
                    <BusinessIcon className="text-primary" />
                  </div>
                  <p className="text-3xl font-bold">{stats.totalBusinesses}</p>
                  <div className="flex items-center text-sm text-success mt-2">
                    <ArrowUpwardIcon className="text-xs mr-1" />
                    <span>8% this week</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold font-heading">Active Customers</h3>
                    <PeopleIcon className="text-primary" />
                  </div>
                  <p className="text-3xl font-bold">{stats.activeCustomers}</p>
                  <div className="flex items-center text-sm text-success mt-2">
                    <ArrowUpwardIcon className="text-xs mr-1" />
                    <span>12% this week</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold font-heading">Service Requests</h3>
                    <AssignmentIcon className="text-primary" />
                  </div>
                  <p className="text-3xl font-bold">{stats.serviceRequests}</p>
                  <div className="flex items-center text-sm text-success mt-2">
                    <ArrowUpwardIcon className="text-xs mr-1" />
                    <span>24% this week</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold font-heading">Revenue</h3>
                    <PaymentsIcon className="text-primary" />
                  </div>
                  <p className="text-3xl font-bold">{formatCurrency(stats.revenue)}</p>
                  <div className="flex items-center text-sm text-success mt-2">
                    <ArrowUpwardIcon className="text-xs mr-1" />
                    <span>6% this month</span>
                  </div>
                </div>
              </div>
              
              {/* Business by Category Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
                  <h2 className="text-xl font-bold mb-6 font-heading">Business Categories</h2>
                  <div className="h-64 flex space-x-4">
                    <div className="flex-1 flex flex-col space-y-2">
                      {businessCategories.map((category, index) => (
                        <div className="flex items-center" key={index}>
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                          <span className="text-sm">
                            {category.category === 'retail' ? 'Retail' : 
                              category.category === 'restaurant' ? 'Restaurant' : 
                              category.category === 'farm' ? 'Farm Produce' : 
                              category.category === 'handyman' ? 'Handyman' : 
                              category.category.charAt(0).toUpperCase() + category.category.slice(1)
                            } ({category.percentage}%)
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex-1 relative">
                      {/* Placeholder for chart - in a real app this would be a proper chart component */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-36 h-36 rounded-full border-8 border-primary relative">
                          {businessCategories.map((category, index) => {
                            const rotation = index * 72;
                            const clipStyle = {
                              clip: `rect(0, 36px, 72px, 0)`,
                              transform: `rotate(${rotation}deg)`,
                              borderColor: category.color
                            };
                            return (
                              <div key={index} className="absolute top-0 right-0 w-36 h-36 rounded-full border-8" style={clipStyle}></div>
                            );
                          })}
                          <div className="absolute inset-0 flex items-center justify-center bg-white rounded-full w-20 h-20 mx-auto"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-4 font-heading">Recent Activity</h2>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div className="flex items-start" key={activity.id}>
                        <span className={`material-icons ${getIconColor(activity.type)} p-2 rounded-full mr-3`}>
                          {activity.icon}
                        </span>
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-neutral">{activity.subtitle}</p>
                          <p className="text-xs text-neutral mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => handleTabChange('activity')}
                    className="block w-full text-center text-primary hover:text-primary-dark font-medium mt-4"
                  >
                    View All Activity
                  </button>
                </div>
              </div>
              
              {/* Recent Businesses */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold font-heading">Recent Businesses</h2>
                  <button 
                    onClick={() => handleTabChange('businesses')}
                    className="text-primary hover:text-primary-dark"
                  >
                    View All
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Business Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Category</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Location</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Plan</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBusinesses.map((business: any) => (
                        <tr className="border-b hover:bg-gray-50" key={business.id}>
                          <td className="px-4 py-3 text-sm font-medium">{business.name}</td>
                          <td className="px-4 py-3 text-sm capitalize">{business.category}</td>
                          <td className="px-4 py-3 text-sm">{business.location}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`inline-block ${getStatusColor(business.status)} rounded-full px-2 py-1 text-xs font-semibold capitalize`}>
                              {business.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm capitalize">{business.subscriptionType}</td>
                          <td className="px-4 py-3 text-sm">
                            <button className="text-primary hover:text-primary-dark font-medium">
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            
            {/* Businesses Tab */}
            <TabsContent value="businesses">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-6 font-heading">All Businesses</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Business Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Owner</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Category</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Location</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Plan</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {businesses.map((business: any) => (
                        <tr className="border-b hover:bg-gray-50" key={business.id}>
                          <td className="px-4 py-3 text-sm font-medium">{business.name}</td>
                          <td className="px-4 py-3 text-sm">{business.userId}</td>
                          <td className="px-4 py-3 text-sm capitalize">{business.category}</td>
                          <td className="px-4 py-3 text-sm">{business.location}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`inline-block ${getStatusColor(business.status)} rounded-full px-2 py-1 text-xs font-semibold capitalize`}>
                              {business.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm capitalize">{business.subscriptionType}</td>
                          <td className="px-4 py-3 text-sm">
                            <button className="text-primary hover:text-primary-dark font-medium">
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            
            {/* Service Requests Tab */}
            <TabsContent value="requests">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-6 font-heading">Service Requests</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Title</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Category</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Customer</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Location</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviceRequests.map((request: any) => (
                        <tr className="border-b hover:bg-gray-50" key={request.id}>
                          <td className="px-4 py-3 text-sm font-medium">{request.title}</td>
                          <td className="px-4 py-3 text-sm capitalize">{request.category}</td>
                          <td className="px-4 py-3 text-sm">{request.customerId || 'Guest'}</td>
                          <td className="px-4 py-3 text-sm">{request.location}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`inline-block ${getStatusColor(request.status)} rounded-full px-2 py-1 text-xs font-semibold capitalize`}>
                              {request.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">{formatDate(request.createdAt)}</td>
                          <td className="px-4 py-3 text-sm">
                            <button className="text-primary hover:text-primary-dark font-medium">
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            
            {/* Users Tab */}
            <TabsContent value="users">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-6 font-heading">Users</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Username</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">User Type</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Date Joined</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsers.map((user: any) => (
                        <tr className="border-b hover:bg-gray-50" key={user.id}>
                          <td className="px-4 py-3 text-sm font-medium">{user.username}</td>
                          <td className="px-4 py-3 text-sm capitalize">{user.userType}</td>
                          <td className="px-4 py-3 text-sm">{formatDate(user.createdAt)}</td>
                          <td className="px-4 py-3 text-sm">
                            <button className="text-primary hover:text-primary-dark font-medium">
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            
            {/* Payments Tab */}
            <TabsContent value="payments">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-6 font-heading">Payments</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Business</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Payment Method</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment: any) => (
                        <tr className="border-b hover:bg-gray-50" key={payment.id}>
                          <td className="px-4 py-3 text-sm font-medium">{payment.businessId}</td>
                          <td className="px-4 py-3 text-sm">{formatCurrency(payment.amount)}</td>
                          <td className="px-4 py-3 text-sm capitalize">{payment.paymentMethod}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`inline-block ${getStatusColor(payment.status)} rounded-full px-2 py-1 text-xs font-semibold capitalize`}>
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">{formatDate(payment.createdAt)}</td>
                          <td className="px-4 py-3 text-sm">
                            <button className="text-primary hover:text-primary-dark font-medium">
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-6 font-heading">Settings</h2>
                <p>Admin settings page is under construction.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
