import React from 'react';

interface CategoryIconProps {
  name: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = "text-3xl" }) => {
  return (
    <span className={`material-icons ${className}`}>{name}</span>
  );
};

export const StoreIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CategoryIcon name="store" className={className} />
);

export const RestaurantIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CategoryIcon name="restaurant" className={className} />
);

export const AgricultureIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CategoryIcon name="agriculture" className={className} />
);

export const BuildIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CategoryIcon name="build" className={className} />
);

export const MiscellaneousServicesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CategoryIcon name="miscellaneous_services" className={className} />
);

export const DashboardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CategoryIcon name="dashboard" className={className} />
);

export const AssignmentIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CategoryIcon name="assignment" className={className} />
);

export const BusinessIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CategoryIcon name="business" className={className} />
);

export const PaymentsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CategoryIcon name="payments" className={className} />
);

export const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CategoryIcon name="settings" className={className} />
);

export const NotificationsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CategoryIcon name="notifications" className={className} />
);

export const AccountCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CategoryIcon name="account_circle" className={className} />
);

export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CategoryIcon name="check_circle" className={className} />
);

export const VisibilityIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CategoryIcon name="visibility" className={className} />
);

export const LocationOnIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CategoryIcon name="location_on" className={className} />
);

export const PeopleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CategoryIcon name="people" className={className} />
);

export const ArrowForwardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CategoryIcon name="arrow_forward" className={className} />
);

export const ArrowUpwardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CategoryIcon name="arrow_upward" className={className} />
);

export const ErrorIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CategoryIcon name="error" className={className} />
);

export const PhoneAndroidIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CategoryIcon name="phone_android" className={className} />
);

export const CreditCardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CategoryIcon name="credit_card" className={className} />
);

export const AccountBalanceIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CategoryIcon name="account_balance" className={className} />
);

export const AdminPanelSettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CategoryIcon name="admin_panel_settings" className={className} />
);

export const FacebookIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CategoryIcon name="facebook" className={className} />
);

export const AlternateEmailIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CategoryIcon name="alternate_email" className={className} />
);

export const SmartphoneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CategoryIcon name="smartphone" className={className} />
);

export const EmailIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CategoryIcon name="email" className={className} />
);

export const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CategoryIcon name="menu" className={className} />
);

export const PendingIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CategoryIcon name="pending" className={className} />
);

export const PersonAddIcon: React.FC<{ className?: string }> = ({ className }) => (
  <CategoryIcon name="person_add" className={className} />
);
