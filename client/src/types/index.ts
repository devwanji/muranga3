export type UserType = "customer" | "business" | "admin";

export interface User {
  id: number;
  username: string;
  userType: UserType;
}

export interface Business {
  id: number;
  userId: number;
  name: string;
  category: string;
  phone: string;
  email: string;
  location: string;
  description: string;
  subscriptionType: "monthly" | "yearly";
  subscriptionEndDate?: string;
  status: "pending" | "active" | "expired";
  createdAt: string;
}

export interface ServiceRequest {
  id: number;
  customerId?: number;
  title: string;
  category: string;
  location: string;
  description: string;
  phone: string;
  email?: string;
  status: "new" | "seen" | "responded";
  assignedBusinessId?: number;
  assignedBusiness?: Business;
  createdAt: string;
}

export interface Payment {
  id: number;
  businessId: number;
  amount: number;
  paymentMethod: string;
  status: "pending" | "completed" | "failed";
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Stats {
  totalBusinesses: number;
  activeCustomers: number;
  serviceRequests: number;
  revenue: number;
}

export interface BusinessStats {
  newRequests: number;
  responded: number;
  profileViews: number;
}

export interface Activity {
  id: number;
  type: string;
  title: string;
  subtitle: string;
  time: string;
  icon: string;
}

export interface ToastProps {
  type: "success" | "error";
  message: string;
  isVisible: boolean;
}

export interface LoginFormData {
  userType: UserType;
  username?: string;
}

export interface RegisterBusinessFormData {
  businessName: string;
  businessCategory: string;
  phone: string;
  email: string;
  location: string;
  description: string;
  subscription: "monthly" | "yearly";
}

export interface ServiceRequestFormData {
  serviceName: string;
  serviceCategory: string;
  requestLocation: string;
  requestDescription: string;
  requestContact: string;
  requestEmail: string;
}

export interface BusinessByCategory {
  category: string;
  percentage: number;
  color: string;
}
