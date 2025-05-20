// Mock data for static site deployment
// This allows the site to function without a backend when deployed on Vercel

export const mockUsers = [
  { id: 1, username: 'admin', userType: 'admin' },
  { id: 2, username: 'business1', userType: 'business' },
  { id: 3, username: 'customer1', userType: 'customer' }
];

export const mockBusinesses = [
  { 
    id: 1, 
    userId: 2, 
    name: 'John\'s Hardware Store', 
    category: 'retail', 
    phone: '0712345678', 
    email: 'john@example.com', 
    location: 'Murang\'a Town', 
    description: 'Best hardware store in town with quality tools and building materials for all your construction needs.', 
    subscriptionType: 'monthly', 
    status: 'active', 
    createdAt: new Date().toISOString() 
  },
  { 
    id: 2, 
    userId: 3, 
    name: 'Mary\'s Restaurant', 
    category: 'restaurant', 
    phone: '0723456789', 
    email: 'mary@example.com', 
    location: 'Kangema', 
    description: 'Authentic local cuisine with traditional Kenyan dishes made from fresh farm produce.', 
    subscriptionType: 'yearly', 
    status: 'active', 
    createdAt: new Date().toISOString() 
  },
  { 
    id: 3, 
    userId: 4, 
    name: 'Green Acres Farm', 
    category: 'farm', 
    phone: '0734567890', 
    email: 'farm@example.com', 
    location: 'Kiharu', 
    description: 'Organic farm producing fresh vegetables, fruits and dairy products for the local community.', 
    subscriptionType: 'monthly', 
    status: 'pending', 
    createdAt: new Date().toISOString() 
  },
  { 
    id: 4, 
    userId: 5, 
    name: 'Quick Fix Handyman', 
    category: 'handyman', 
    phone: '0745678901', 
    email: 'fix@example.com', 
    location: 'Mathioya', 
    description: 'Professional handyman services including plumbing, electrical work, and general repairs.', 
    subscriptionType: 'yearly', 
    status: 'active', 
    createdAt: new Date().toISOString() 
  }
];

export const mockServiceRequests = [
  {
    id: 1,
    customerId: 3,
    title: 'Need plumbing services',
    category: 'handyman',
    location: 'Murang\'a Town',
    description: 'Water leak in kitchen needs urgent repair',
    phone: '0712345678',
    email: 'customer@example.com',
    status: 'new',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    customerId: 3,
    title: 'Fresh vegetables needed',
    category: 'farm',
    location: 'Kangema',
    description: 'Looking for fresh organic vegetables for restaurant',
    phone: '0723456789',
    email: 'restaurant@example.com',
    status: 'seen',
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    customerId: 2,
    title: 'Catering for event',
    category: 'restaurant',
    location: 'Kiharu',
    description: 'Need catering services for a corporate event with 50 guests',
    phone: '0734567890',
    email: 'event@example.com',
    status: 'responded',
    createdAt: new Date().toISOString()
  }
];

export const mockNotifications = [
  {
    id: 1,
    userId: 2,
    title: 'New Service Request',
    message: 'You have a new service request for plumbing services in Murang\'a Town',
    isRead: false,
    type: 'service_request',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    userId: 2,
    title: 'Subscription Reminder',
    message: 'Your monthly subscription will expire in 3 days. Please renew to maintain your business listing.',
    isRead: true,
    type: 'subscription',
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    userId: 3,
    title: 'Request Update',
    message: 'Your service request for catering has been viewed by 2 businesses.',
    isRead: false,
    type: 'request_update',
    createdAt: new Date().toISOString()
  }
];

export const mockPayments = [
  {
    id: 1,
    businessId: 1,
    amount: 2000,
    paymentMethod: 'mpesa',
    status: 'completed',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    businessId: 2,
    amount: 5000,
    paymentMethod: 'card',
    status: 'completed',
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    businessId: 3,
    amount: 2000,
    paymentMethod: 'mpesa',
    status: 'pending',
    createdAt: new Date().toISOString()
  }
];