import React from 'react';
import { Link, useLocation } from 'wouter';
import { CategoryIcon } from '../assets/icons/CategoryIcons';

interface SidebarLink {
  path: string;
  label: string;
  icon: string;
  badge?: number;
}

interface DashboardSidebarProps {
  title: string;
  links: SidebarLink[];
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ title, links }) => {
  const [location] = useLocation();
  
  return (
    <div className="bg-secondary text-white w-full md:w-64 md:min-h-screen">
      <div className="p-4 border-b border-secondary-light">
        <h2 className="text-xl font-bold font-heading">{title}</h2>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.path}>
              <Link href={link.path}>
                <a className={`flex items-center py-2 px-4 rounded hover:bg-secondary-light transition ${
                  location === link.path ? 'bg-secondary-light' : ''
                }`}>
                  <CategoryIcon name={link.icon} className="mr-3" />
                  {link.label}
                  {link.badge && link.badge > 0 && (
                    <span className="ml-auto bg-alert rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {link.badge}
                    </span>
                  )}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default DashboardSidebar;
