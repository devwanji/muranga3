import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import BusinessRegistration from "@/pages/BusinessRegistration";
import Payment from "@/pages/Payment";
import ServiceRequest from "@/pages/ServiceRequest";
import BusinessDashboard from "@/pages/BusinessDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import BusinessListing from "@/pages/BusinessListing";
import Login from "@/pages/Login";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

function Router() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Protected route wrapper
  const ProtectedRoute = ({ 
    component: Component, 
    allowedUserTypes = ["customer", "business", "admin"]
  }: { 
    component: React.ComponentType; 
    allowedUserTypes?: string[];
  }) => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      setLocation("/login");
      return null;
    }

    if (user && !allowedUserTypes.includes(user.userType)) {
      // Redirect to home if authenticated but not authorized
      setLocation("/");
      return null;
    }

    return <Component />;
  };

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register-business">
        <ProtectedRoute 
          component={BusinessRegistration} 
          allowedUserTypes={["business"]} 
        />
      </Route>
      <Route path="/payment">
        <ProtectedRoute 
          component={Payment} 
          allowedUserTypes={["business"]} 
        />
      </Route>
      <Route path="/service-request" component={ServiceRequest} />
      <Route path="/business-dashboard">
        <ProtectedRoute 
          component={BusinessDashboard} 
          allowedUserTypes={["business"]} 
        />
      </Route>
      <Route path="/admin-dashboard">
        <ProtectedRoute 
          component={AdminDashboard} 
          allowedUserTypes={["admin"]} 
        />
      </Route>
      <Route path="/businesses" component={BusinessListing} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <MainLayout>
            <Toaster />
            <Router />
          </MainLayout>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
