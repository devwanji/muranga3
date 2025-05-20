import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { 
  NotificationsIcon, 
  AccountCircleIcon, 
  MenuIcon,
  BusinessIcon,
  AdminPanelSettingsIcon
} from '../assets/icons/CategoryIcons';
import NotificationBell from './NotificationBell';

const Header: React.FC = () => {
  const [location, setLocation] = useLocation();
  const { user, login, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const toggleUserMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUserMenuOpen(!userMenuOpen);
  };
  
  const handleLoginClick = () => {
    setLocation('/login');
    setUserMenuOpen(false);
  };
  
  // Close menus when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setUserMenuOpen(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-2xl font-bold text-primary font-heading">Murang'a Marketplace</a>
            </Link>
          </div>
          
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <Link href="/">
                  <a className={`${location === '/' ? 'text-primary font-medium' : 'text-secondary'} hover:text-primary transition`}>
                    Home
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/businesses">
                  <a className={`${location === '/businesses' ? 'text-primary font-medium' : 'text-secondary'} hover:text-primary transition`}>
                    Businesses
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/service-request">
                  <a className={`${location === '/service-request' ? 'text-primary font-medium' : 'text-secondary'} hover:text-primary transition`}>
                    Services
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/register-business">
                  <a className={`${location === '/register-business' ? 'text-primary font-medium' : 'text-secondary'} hover:text-primary transition`}>
                    Register
                  </a>
                </Link>
              </li>
              {isAuthenticated && (
                <li className="relative">
                  <NotificationBell />
                </li>
              )}
            </ul>
          </nav>
          
          <div className="flex items-center space-x-4">
            <div className="relative" onClick={toggleUserMenu}>
              <button className="flex items-center text-secondary hover:text-primary focus:outline-none">
                {isAuthenticated ? (
                  <>
                    {user?.userType === 'business' ? (
                      <BusinessIcon className="mr-1" />
                    ) : user?.userType === 'admin' ? (
                      <AdminPanelSettingsIcon className="mr-1" />
                    ) : (
                      <AccountCircleIcon className="mr-1" />
                    )}
                    <span className="hidden md:inline-block capitalize">
                      {user?.userType}
                    </span>
                  </>
                ) : (
                  <>
                    <AccountCircleIcon className="mr-1" />
                    <span className="hidden md:inline-block">Login</span>
                  </>
                )}
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  {isAuthenticated ? (
                    <>
                      {user?.userType === 'business' && (
                        <Link href="/business-dashboard">
                          <a className="block px-4 py-2 text-sm text-secondary hover:bg-gray-100">
                            Dashboard
                          </a>
                        </Link>
                      )}
                      {user?.userType === 'admin' && (
                        <Link href="/admin-dashboard">
                          <a className="block px-4 py-2 text-sm text-secondary hover:bg-gray-100">
                            Admin Panel
                          </a>
                        </Link>
                      )}
                      <a 
                        href="#" 
                        className="block px-4 py-2 text-sm text-alert hover:bg-gray-100"
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                          setLocation('/');
                        }}
                      >
                        Logout
                      </a>
                    </>
                  ) : (
                    <Link href="/login">
                      <a className="block px-4 py-2 text-sm text-secondary hover:bg-gray-100"
                         onClick={() => setUserMenuOpen(false)}>
                        Login / Register
                      </a>
                    </Link>
                  )}
                </div>
              )}
            </div>
            
            <button 
              className="block md:hidden text-secondary focus:outline-none" 
              onClick={toggleMobileMenu}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden py-4">
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className={`block ${location === '/' ? 'text-primary font-medium' : 'text-secondary'}`}>
                    Home
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/businesses">
                  <a className={`block ${location === '/businesses' ? 'text-primary font-medium' : 'text-secondary'}`}>
                    Businesses
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/service-request">
                  <a className={`block ${location === '/service-request' ? 'text-primary font-medium' : 'text-secondary'}`}>
                    Services
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/register-business">
                  <a className={`block ${location === '/register-business' ? 'text-primary font-medium' : 'text-secondary'}`}>
                    Register
                  </a>
                </Link>
              </li>
              {isAuthenticated && (
                <li className="relative">
                  <Link href="/notifications">
                    <a className="block text-secondary">
                      Notifications <span className="inline-block bg-alert text-white rounded-full px-2 text-xs ml-1">3</span>
                    </a>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
