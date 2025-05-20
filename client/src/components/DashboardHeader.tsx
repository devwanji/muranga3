import React from 'react';
import { NotificationsIcon, AccountCircleIcon } from '../assets/icons/CategoryIcons';
import { useUser } from './UserContext';

interface DashboardHeaderProps {
  title: string;
  notificationCount?: number;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  title, 
  notificationCount = 0 
}) => {
  const { user } = useUser();
  
  return (
    <header className="bg-white shadow-sm p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold font-heading">{title}</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="relative focus:outline-none">
              <NotificationsIcon className="text-secondary" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-alert text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-secondary mr-2">
              {user?.userType === 'business' ? 'Kimani General Store' : 'Admin'}
            </span>
            <AccountCircleIcon className="text-secondary" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
