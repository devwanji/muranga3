import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import RequestCard from '@/components/RequestCard';
import NotificationToast from '@/components/NotificationToast';
import { ServiceRequest, BusinessStats, ToastProps } from '@/types';
import { 
  getServiceRequests, 
  updateServiceRequest,
  getBusinessStats
} from '@/lib/storage';
import { useUser } from '@/components/UserContext';
import { 
  AssignmentIcon,
  CheckCircleIcon,
  VisibilityIcon,
  PendingIcon
} from '@/assets/icons/CategoryIcons';

const BusinessDashboard: React.FC = () => {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, login } = useUser();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [businessStats, setBusinessStats] = useState<BusinessStats>({
    newRequests: 0,
    responded: 0,
    profileViews: 0
  });
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [toast, setToast] = useState<ToastProps>({
    type: 'success',
    message: '',
    isVisible: false
  });
  
  useEffect(() => {
    // If not authenticated or not a business, redirect to login
    if (!isAuthenticated) {
      login('business');
    } else if (user?.userType !== 'business') {
      setLocation('/');
    }
    
    // Load data
    loadData();
  }, [isAuthenticated, user, setLocation, login]);
  
  const loadData = () => {
    // Get all service requests (in a real app, these would be filtered by business ID)
    const allRequests = getServiceRequests();
    setRequests(allRequests);
    
    // Get business stats
    const stats = getBusinessStats(1); // Using a placeholder business ID
    setBusinessStats(stats);
  };
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  const handleRespondToRequest = (requestId: number) => {
    // Find the request
    const request = requests.find(r => r.id === requestId);
    if (!request) return;
    
    // Update the request status
    const updatedRequest = {
      ...request,
      status: request.status === 'new' ? 'seen' : 'responded'
    } as ServiceRequest;
    
    updateServiceRequest(updatedRequest);
    
    // Update local state
    setRequests(prev => 
      prev.map(r => r.id === requestId ? updatedRequest : r)
    );
    
    // Show success toast
    setToast({
      type: 'success',
      message: `Request marked as ${updatedRequest.status}`,
      isVisible: true
    });
    
    // Refresh stats
    setBusinessStats(getBusinessStats(1));
  };
  
  const handleToastClose = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };
  
  // Sidebar links
  const sidebarLinks = [
    { path: '/business-dashboard', label: 'Overview', icon: 'dashboard' },
    { 
      path: '/business-dashboard/requests', 
      label: 'Service Requests', 
      icon: 'assignment',
      badge: businessStats.newRequests
    },
    { path: '/business-dashboard/profile', label: 'Business Profile', icon: 'business' },
    { path: '/business-dashboard/subscription', label: 'Subscription', icon: 'payments' },
    { path: '/business-dashboard/settings', label: 'Settings', icon: 'settings' }
  ];
  
  return (
    <div className="flex flex-col md:flex-row">
      <DashboardSidebar title="Business Dashboard" links={sidebarLinks} />
      
      <div className="flex-1 bg-gray-100">
        <DashboardHeader 
          title="Dashboard Overview" 
          notificationCount={businessStats.newRequests} 
        />
        
        <div className="container mx-auto p-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold font-heading">New Requests</h3>
                <AssignmentIcon className="text-primary" />
              </div>
              <p className="text-3xl font-bold">{businessStats.newRequests}</p>
              <p className="text-sm text-neutral mt-2">Since yesterday</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold font-heading">Responded</h3>
                <CheckCircleIcon className="text-success" />
              </div>
              <p className="text-3xl font-bold">{businessStats.responded}</p>
              <p className="text-sm text-neutral mt-2">Last 7 days</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold font-heading">Profile Views</h3>
                <VisibilityIcon className="text-primary" />
              </div>
              <p className="text-3xl font-bold">{businessStats.profileViews}</p>
              <p className="text-sm text-neutral mt-2">Last 30 days</p>
            </div>
          </div>
          
          {/* Recent Requests Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-heading">Recent Service Requests</h2>
              <a 
                href="#dashboard-requests" 
                className="text-primary hover:text-primary-dark"
                onClick={(e) => {
                  e.preventDefault();
                  handleTabChange('requests');
                }}
              >
                View All
              </a>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Request</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Customer</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.slice(0, 3).map(request => (
                    <RequestCard 
                      key={request.id} 
                      request={request} 
                      onRespond={handleRespondToRequest}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Profile Completion */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4 font-heading">Complete Your Profile</h2>
            <p className="text-neutral mb-4">A complete profile helps customers find and trust your business.</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center">
                  <CheckCircleIcon className="text-success mr-2" />
                  <span>Basic Information</span>
                </div>
              </div>
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center">
                  <CheckCircleIcon className="text-success mr-2" />
                  <span>Contact Details</span>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center">
                  <PendingIcon className="text-warning mr-2" />
                  <span>Add Business Photos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <NotificationToast 
        toast={toast} 
        onClose={handleToastClose} 
      />
    </div>
  );
};

export default BusinessDashboard;
