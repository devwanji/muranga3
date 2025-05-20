import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number): string => {
  return `Ksh ${amount.toLocaleString()}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return `${formatDate(dateString)}, ${formatTime(dateString)}`;
};

export const timeSince = (dateString: string): string => {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  
  return Math.floor(seconds) + " seconds ago";
};

export const getSubscriptionAmount = (type: "monthly" | "yearly"): number => {
  return type === "monthly" ? 200 : 3000;
};

export const calculateSubscriptionEndDate = (type: "monthly" | "yearly"): Date => {
  const now = new Date();
  if (type === "monthly") {
    return new Date(now.setMonth(now.getMonth() + 1));
  } else {
    return new Date(now.setFullYear(now.getFullYear() + 1));
  }
};

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "active":
    case "completed":
    case "responded":
    case "success":
      return "bg-green-100 text-success";
    case "pending":
    case "seen":
    case "warning":
      return "bg-orange-100 text-warning";
    case "expired":
    case "failed":
    case "error":
      return "bg-red-100 text-alert";
    case "new":
      return "bg-red-100 text-alert";
    default:
      return "bg-gray-100 text-neutral";
  }
};

export const getIconColor = (type: string): string => {
  switch (type) {
    case "business":
      return "text-primary bg-primary-light bg-opacity-20";
    case "payment":
      return "text-success bg-green-100";
    case "request":
      return "text-warning bg-orange-100";
    case "user":
      return "text-alert bg-red-100";
    default:
      return "text-neutral bg-gray-100";
  }
};

export const validateEmail = (email: string): boolean => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validatePhone = (phone: string): boolean => {
  const re = /^0[0-9]{9}$/;
  return re.test(phone);
};

export const generateCategories = () => {
  return [
    { id: "retail", name: "Retail Shops", icon: "store" },
    { id: "restaurant", name: "Restaurants", icon: "restaurant" },
    { id: "farm", name: "Farm Produce", icon: "agriculture" },
    { id: "handyman", name: "Handyman", icon: "build" },
    { id: "other", name: "Other Services", icon: "miscellaneous_services" },
  ];
};

export const generateFeaturedBusinesses = () => {
  return [
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
      status: "active",
      createdAt: "2023-07-01T10:00:00.000Z"
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
      status: "active",
      createdAt: "2023-07-05T14:30:00.000Z"
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
      status: "active",
      createdAt: "2023-07-10T09:15:00.000Z"
    }
  ];
};
