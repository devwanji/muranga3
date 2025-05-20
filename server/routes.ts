import type { Express, Request, Response, NextFunction } from "express";
import { SessionData } from "express-session";

// Extend the Express Request type to include session
declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      session: SessionData;
    }
  }
}
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { WebSocketServer } from "ws";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertBusinessSchema, 
  insertServiceRequestSchema,
  insertPaymentSchema,
  users, businesses, serviceRequests, notifications, payments
} from "@shared/schema";
import { db } from "./db";
import { desc } from "drizzle-orm";

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized" });
};

// Middleware to check if user is admin
const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = await storage.getUser(req.session.userId);
  if (!user || user.userType !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  next();
};

// Middleware to check if user is business owner
const isBusinessOwner = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = await storage.getUser(req.session.userId);
  if (!user || user.userType !== "business") {
    return res.status(403).json({ error: "Forbidden" });
  }

  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session middleware
  app.use((req: any, res, next) => {
    if (!req.session) {
      req.session = {};
    }
    next();
  });

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      // Create user
      const user = await storage.createUser(userData);
      
      // Set session
      if (req.session) {
        req.session.userId = user.id;
      }
      
      res.status(201).json({ 
        id: user.id, 
        username: user.username, 
        userType: user.userType 
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Validate input
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }
      
      // Find user
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Set session
      if (req.session) {
        req.session.userId = user.id;
      }
      
      res.json({ 
        id: user.id, 
        username: user.username, 
        userType: user.userType 
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    if (req.session) {
      req.session.userId = undefined;
    }
    res.json({ message: "Logged out successfully" });
  });

  app.get("/api/auth/me", isAuthenticated, async (req, res) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json({ 
        id: user.id, 
        username: user.username, 
        userType: user.userType 
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Business routes
  app.get("/api/businesses", async (req, res) => {
    try {
      const category = req.query.category as string;
      
      if (category) {
        const businesses = await storage.getBusinessesByCategory(category);
        return res.json(businesses);
      }
      
      // Get all businesses (simplified for now)
      // In a real app, you would add pagination
      const allBusinesses = await db.select().from(businesses).limit(20);
      res.json(allBusinesses);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/businesses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const business = await storage.getBusiness(id);
      
      if (!business) {
        return res.status(404).json({ error: "Business not found" });
      }
      
      res.json(business);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/businesses", isAuthenticated, async (req, res) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const businessData = insertBusinessSchema.parse(req.body);
      
      // Set the user ID
      businessData.userId = req.session.userId;
      
      const business = await storage.createBusiness(businessData);
      res.status(201).json(business);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/businesses/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const business = await storage.getBusiness(id);
      
      if (!business) {
        return res.status(404).json({ error: "Business not found" });
      }
      
      // Check if user is owner or admin
      if (req.session && req.session.userId) {
        const user = await storage.getUser(req.session.userId);
        if (!user || (user.id !== business.userId && user.userType !== "admin")) {
          return res.status(403).json({ error: "Forbidden" });
        }
      }
      
      const updatedBusiness = await storage.updateBusiness(id, req.body);
      res.json(updatedBusiness);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Service Request routes
  app.get("/api/service-requests", isAuthenticated, async (req, res) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      let requests;
      if (user.userType === "customer") {
        requests = await storage.getServiceRequestsByCustomerId(user.id);
      } else if (user.userType === "business") {
        // Get the business ID for this user
        const businesses = await storage.getBusinessesByUserId(user.id);
        if (businesses.length === 0) {
          return res.json([]);
        }
        
        requests = await storage.getServiceRequestsByBusinessId(businesses[0].id);
      } else if (user.userType === "admin") {
        // For admin, get all service requests
        requests = await db.select().from(serviceRequests).orderBy(desc(serviceRequests.createdAt));
      } else {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      res.json(requests);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/service-requests", isAuthenticated, async (req, res) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const requestData = insertServiceRequestSchema.parse(req.body);
      
      // Set the customer ID if not provided
      if (!requestData.customerId) {
        requestData.customerId = req.session.userId;
      }
      
      const serviceRequest = await storage.createServiceRequest(requestData);
      
      // Notify business owners with matching category
      // This is simplified for now - in a real app, you'd use more complex matching
      const businessesInCategory = await storage.getBusinessesByCategory(serviceRequest.category);
      
      for (const business of businessesInCategory) {
        await storage.createNotification({
          userId: business.userId,
          title: "New Service Request",
          message: `New service request for ${serviceRequest.title} in your category ${serviceRequest.category}`,
          type: "service_request"
        });
      }
      
      res.status(201).json(serviceRequest);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/service-requests/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const request = await storage.getServiceRequest(id);
      
      if (!request) {
        return res.status(404).json({ error: "Service request not found" });
      }
      
      const updatedRequest = await storage.updateServiceRequest(id, req.body);
      res.json(updatedRequest);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Notification routes
  app.get("/api/notifications", isAuthenticated, async (req, res) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const notifications = await storage.getNotificationsByUserId(req.session.userId);
      res.json(notifications);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/notifications/:id/read", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.markNotificationAsRead(id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Admin-only routes
  app.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const allUsers = await db.select().from(users);
      res.json(allUsers.map(user => ({
        id: user.id,
        username: user.username,
        userType: user.userType,
        createdAt: user.createdAt
      })));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/admin/businesses", isAdmin, async (req, res) => {
    try {
      const allBusinesses = await db.select().from(businesses);
      res.json(allBusinesses);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/admin/service-requests", isAdmin, async (req, res) => {
    try {
      const allRequests = await db.select().from(serviceRequests);
      res.json(allRequests);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/admin/payments", isAdmin, async (req, res) => {
    try {
      const allPayments = await db.select().from(payments);
      res.json(allPayments);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  
  // Set up WebSocket server
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws'
  });
  
  // WebSocket event handlers
  wss.on('connection', (ws) => {
    console.log('Client connected');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received message:', data);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  return httpServer;
}
