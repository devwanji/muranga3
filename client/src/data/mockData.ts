import { Business, ServiceRequest, Payment, Activity } from '@/types';

// Initial featured businesses 
export const initialBusinesses: Business[] = [
  {
    id: 1,
    userId: 1,
    name: "Kimani General Store",
    category: "retail",
    description: "Quality household supplies and groceries at affordable prices.",
    location: "Murang'a Town",
    phone: "0712345678",
    email: "kimani@example.com",
    subscriptionType: "monthly",
    subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    userId: 2,
    name: "Wanjiku's Restaurant",
    category: "restaurant",
    description: "Traditional Kenyan cuisine with modern touches.",
    location: "Kangari",
    phone: "0723456789",
    email: "wanjiku@example.com",
    subscriptionType: "yearly",
    subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    userId: 3,
    name: "Murang'a Fresh Produce",
    category: "farm",
    description: "Fresh fruits and vegetables direct from local farms.",
    location: "Maragua",
    phone: "0734567890",
    email: "fresh@example.com",
    subscriptionType: "monthly",
    subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 4,
    userId: 4,
    name: "Kariuki's Electronics",
    category: "retail",
    description: "Latest electronics and gadgets at competitive prices.",
    location: "Murang'a Town",
    phone: "0745678901",
    email: "kariuki@example.com",
    subscriptionType: "yearly",
    subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 5,
    userId: 5,
    name: "Njeri Home Services",
    category: "handyman",
    description: "Professional plumbing, electrical, and general home repair services.",
    location: "Kenol",
    phone: "0756789012",
    email: "njeri@example.com",
    subscriptionType: "monthly",
    subscriptionEndDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "expired",
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Initial service requests
export const initialServiceRequests: ServiceRequest[] = [
  {
    id: 1,
    customerId: 6,
    title: "Need household items",
    category: "retail",
    location: "Murang'a Town",
    description: "Looking for kitchen utensils and bathroom supplies for a new apartment.",
    phone: "0712345678",
    email: "john@example.com",
    status: "new",
    assignedBusinessId: 1,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    customerId: 7,
    title: "Grocery delivery",
    category: "retail",
    location: "Kangema",
    description: "Need weekly groceries delivered to my home.",
    phone: "0723456789",
    email: "mary@example.com",
    status: "seen",
    assignedBusinessId: 1,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    customerId: 8,
    title: "Bulk order inquiry",
    category: "retail",
    location: "Maragua",
    description: "Looking to place a bulk order for an event.",
    phone: "0734567890",
    email: "james@example.com",
    status: "responded",
    assignedBusinessId: 1,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 4,
    customerId: 9,
    title: "Catering for wedding",
    category: "restaurant",
    location: "Kangari",
    description: "Need catering services for a wedding with 100 guests.",
    phone: "0745678901",
    email: "sarah@example.com",
    status: "new",
    assignedBusinessId: 2,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 5,
    customerId: 10,
    title: "Farm produce for restaurant",
    category: "farm",
    location: "Kenol",
    description: "Looking for a regular supplier of fresh vegetables and fruits for a restaurant.",
    phone: "0756789012",
    email: "peter@example.com",
    status: "new",
    assignedBusinessId: 3,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  }
];

// Initial payments
export const initialPayments: Payment[] = [
  {
    id: 1,
    businessId: 1,
    amount: 200,
    paymentMethod: "mpesa",
    status: "completed",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    businessId: 2,
    amount: 3000,
    paymentMethod: "mpesa",
    status: "completed",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    businessId: 3,
    amount: 200,
    paymentMethod: "card",
    status: "completed",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 4,
    businessId: 4,
    amount: 3000,
    paymentMethod: "bank",
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Initial activities for admin dashboard
export const initialActivities: Activity[] = [
  {
    id: 1,
    type: "business",
    title: "New business registered",
    subtitle: "Wanjiku's Restaurant",
    time: "10 minutes ago",
    icon: "store"
  },
  {
    id: 2,
    type: "payment",
    title: "Payment received",
    subtitle: "Ksh 3,000 - Yearly Subscription",
    time: "2 hours ago",
    icon: "payments"
  },
  {
    id: 3,
    type: "request",
    title: "New service request",
    subtitle: "Bulk order for farm produce",
    time: "Yesterday",
    icon: "assignment"
  },
  {
    id: 4,
    type: "user",
    title: "New customer registered",
    subtitle: "John Mwangi",
    time: "Yesterday",
    icon: "person_add"
  }
];

// Function to initialize localStorage with mock data
export const initializeMockData = () => {
  // Only initialize if data doesn't exist
  if (!localStorage.getItem('muranga_businesses') || JSON.parse(localStorage.getItem('muranga_businesses')!).length === 0) {
    localStorage.setItem('muranga_businesses', JSON.stringify(initialBusinesses));
  }
  
  if (!localStorage.getItem('muranga_requests') || JSON.parse(localStorage.getItem('muranga_requests')!).length === 0) {
    localStorage.setItem('muranga_requests', JSON.stringify(initialServiceRequests));
  }
  
  if (!localStorage.getItem('muranga_payments') || JSON.parse(localStorage.getItem('muranga_payments')!).length === 0) {
    localStorage.setItem('muranga_payments', JSON.stringify(initialPayments));
  }
};
