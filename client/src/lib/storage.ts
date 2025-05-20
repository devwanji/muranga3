import { Business, ServiceRequest, User, Payment, ToastProps } from "../types";

const STORAGE_KEYS = {
  BUSINESSES: "muranga_businesses",
  REQUESTS: "muranga_requests",
  USERS: "muranga_users",
  PAYMENTS: "muranga_payments",
  CURRENT_USER: "muranga_current_user"
};

// Initialize localStorage if not already set
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.BUSINESSES)) {
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify([]));
  }
};

// Business operations
export const getBusinesses = (): Business[] => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.BUSINESSES) || "[]");
};

export const getBusinessById = (id: number): Business | undefined => {
  const businesses = getBusinesses();
  return businesses.find(business => business.id === id);
};

export const getBusinessesByCategory = (category: string): Business[] => {
  const businesses = getBusinesses();
  return businesses.filter(business => business.category === category);
};

export const getBusinessesByUserId = (userId: number): Business[] => {
  const businesses = getBusinesses();
  return businesses.filter(business => business.userId === userId);
};

export const addBusiness = (business: Omit<Business, "id" | "createdAt">): Business => {
  const businesses = getBusinesses();
  const newBusiness: Business = {
    ...business,
    id: businesses.length > 0 ? Math.max(...businesses.map(b => b.id)) + 1 : 1,
    createdAt: new Date().toISOString()
  };
  
  businesses.push(newBusiness);
  localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(businesses));
  return newBusiness;
};

export const updateBusiness = (business: Business): Business => {
  const businesses = getBusinesses();
  const index = businesses.findIndex(b => b.id === business.id);
  
  if (index !== -1) {
    businesses[index] = business;
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(businesses));
  }
  
  return business;
};

// Service requests operations
export const getServiceRequests = (): ServiceRequest[] => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || "[]");
};

export const getServiceRequestById = (id: number): ServiceRequest | undefined => {
  const requests = getServiceRequests();
  return requests.find(request => request.id === id);
};

export const getServiceRequestsByBusinessId = (businessId: number): ServiceRequest[] => {
  const requests = getServiceRequests();
  return requests.filter(request => request.assignedBusinessId === businessId);
};

export const getServiceRequestsByCategory = (category: string): ServiceRequest[] => {
  const requests = getServiceRequests();
  return requests.filter(request => request.category === category);
};

export const addServiceRequest = (request: Omit<ServiceRequest, "id" | "createdAt">): ServiceRequest => {
  const requests = getServiceRequests();
  const newRequest: ServiceRequest = {
    ...request,
    id: requests.length > 0 ? Math.max(...requests.map(r => r.id)) + 1 : 1,
    createdAt: new Date().toISOString()
  };
  
  requests.push(newRequest);
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  
  // Assign the request to businesses in the same category
  const businesses = getBusinessesByCategory(request.category);
  if (businesses.length > 0) {
    const assignedBusinessId = businesses[0].id;
    updateServiceRequest({
      ...newRequest,
      assignedBusinessId
    });
  }
  
  return newRequest;
};

export const updateServiceRequest = (request: ServiceRequest): ServiceRequest => {
  const requests = getServiceRequests();
  const index = requests.findIndex(r => r.id === request.id);
  
  if (index !== -1) {
    requests[index] = request;
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  }
  
  return request;
};

// User operations
export const getUsers = (): User[] => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]");
};

export const getUserById = (id: number): User | undefined => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

export const addUser = (user: Omit<User, "id">): User => {
  const users = getUsers();
  const newUser: User = {
    ...user,
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1
  };
  
  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  return newUser;
};

export const getCurrentUser = (): User | null => {
  const currentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return currentUser ? JSON.parse(currentUser) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

// Payment operations
export const getPayments = (): Payment[] => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYMENTS) || "[]");
};

export const addPayment = (payment: Omit<Payment, "id" | "createdAt">): Payment => {
  const payments = getPayments();
  const newPayment: Payment = {
    ...payment,
    id: payments.length > 0 ? Math.max(...payments.map(p => p.id)) + 1 : 1,
    createdAt: new Date().toISOString()
  };
  
  payments.push(newPayment);
  localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  return newPayment;
};

// Stats and analytics
export const getBusinessStats = (businessId: number) => {
  const requests = getServiceRequestsByBusinessId(businessId);
  
  return {
    newRequests: requests.filter(r => r.status === "new").length,
    responded: requests.filter(r => r.status === "responded").length,
    profileViews: 48 // This would normally be tracked, but using a placeholder for demo
  };
};

export const getAdminStats = () => {
  const businesses = getBusinesses();
  const requests = getServiceRequests();
  const payments = getPayments();
  
  // Calculate total revenue
  const revenue = payments
    .filter(p => p.status === "completed")
    .reduce((total, payment) => total + payment.amount, 0);
  
  return {
    totalBusinesses: businesses.length,
    activeCustomers: 187, // This would normally be tracked, but using a placeholder for demo
    serviceRequests: requests.length,
    revenue
  };
};

// Category stats for admin dashboard
export const getBusinessesByCategories = () => {
  const businesses = getBusinesses();
  const categories = ["retail", "restaurant", "farm", "handyman", "other"];
  const colors = ["#0B8043", "#212121", "#F57C00", "#388E3C", "#757575"];
  
  const result = categories.map((category, index) => {
    const count = businesses.filter(b => b.category === category).length;
    const percentage = businesses.length ? Math.round((count / businesses.length) * 100) : 0;
    
    return {
      category,
      percentage,
      color: colors[index]
    };
  });
  
  return result;
};

// Recent activity for admin dashboard
export const getRecentActivity = () => {
  const businesses = getBusinesses();
  const requests = getServiceRequests();
  const payments = getPayments();
  
  const businessActivities = businesses.slice(0, 2).map((business, index) => ({
    id: index,
    type: "business",
    title: "New business registered",
    subtitle: business.name,
    time: formatTimeAgo(new Date(business.createdAt)),
    icon: "store"
  }));
  
  const paymentActivities = payments.slice(0, 2).map((payment, index) => ({
    id: index + 2,
    type: "payment",
    title: "Payment received",
    subtitle: `Ksh ${payment.amount} - ${payment.paymentMethod}`,
    time: formatTimeAgo(new Date(payment.createdAt)),
    icon: "payments"
  }));
  
  const requestActivities = requests.slice(0, 2).map((request, index) => ({
    id: index + 4,
    type: "request",
    title: "New service request",
    subtitle: request.title,
    time: formatTimeAgo(new Date(request.createdAt)),
    icon: "assignment"
  }));
  
  return [...businessActivities, ...paymentActivities, ...requestActivities]
    .sort((a, b) => b.id - a.id)
    .slice(0, 4);
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Yesterday";
  
  return `${diffInDays} days ago`;
};
