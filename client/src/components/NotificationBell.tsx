import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { NotificationsIcon } from '@/assets/icons/CategoryIcons';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

type Notification = {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  createdAt: string;
};

export default function NotificationBell() {
  const { user, isAuthenticated } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Fetch notifications
  const { data: notifications = [], refetch } = useQuery({
    queryKey: ['/api/notifications'],
    enabled: isAuthenticated,
    refetchInterval: 30000, // Check for new notifications every 30 seconds
  });
  
  // Count unread notifications
  const unreadCount = notifications?.filter((notification: Notification) => !notification.isRead).length || 0;
  
  // Mark notification as read
  const markAsRead = async (id: number) => {
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
      });
      refetch();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowDropdown(false);
    };
    
    if (showDropdown) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDropdown]);
  
  if (!isAuthenticated || !user) {
    return null;
  }
  
  return (
    <div className="relative">
      <button 
        className="relative text-secondary hover:text-primary focus:outline-none"
        onClick={(e) => {
          e.stopPropagation();
          setShowDropdown(!showDropdown);
        }}
      >
        <NotificationsIcon />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
      
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-20">
          <div className="p-2 border-b">
            <h3 className="font-medium">Notifications</h3>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification: Notification) => (
                <div 
                  key={notification.id}
                  className={`p-3 border-b hover:bg-gray-50 ${notification.isRead ? 'opacity-70' : 'bg-blue-50 border-l-4 border-l-blue-500'}`}
                  onClick={() => !notification.isRead && markAsRead(notification.id)}
                >
                  <div className="flex justify-between">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <span className="text-xs text-gray-500">{formatDate(notification.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                </div>
              ))
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-2 text-center">
              <button 
                className="text-sm text-primary hover:text-primary-dark"
                onClick={() => {
                  // Mark all as read would go here
                  setShowDropdown(false);
                }}
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}