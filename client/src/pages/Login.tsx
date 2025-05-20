import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockUsers } from "@/api/mockData";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Login form state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [userType, setUserType] = useState<"customer" | "business" | "admin">("customer");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Client-side login for Vercel deployment
      const storedUsers = localStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [...mockUsers];
      
      // Find user - for testing, accept any password
      const user = users.find((u: any) => u.username === loginUsername);
      
      if (!user) {
        throw new Error("Invalid username or password");
      }
      
      // Set as current user
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // Redirect based on user type
      if (user.userType === "admin") {
        setLocation("/admin-dashboard");
      } else if (user.userType === "business") {
        setLocation("/business-dashboard");
      } else {
        setLocation("/");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Use client-side registration for development and production
      // This ensures the site works well when deployed statically to Vercel
      const storedUsers = localStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [...mockUsers];
      
      // Check if username already exists
      if (users.some((u: any) => u.username === registerUsername)) {
        throw new Error("Username already exists");
      }
      
      // Create new user with next available ID
      const newId = users.length > 0 
        ? Math.max(...users.map((u: any) => u.id)) + 1 
        : 1;
        
      const newUser = { 
        id: newId, 
        username: registerUsername, 
        userType: userType 
      };
      
      // Add to users array
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Set as current user
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      // Redirect based on user type
      if (userType === "business") {
        setLocation("/register-business");
      } else if (userType === "admin") {
        setLocation("/admin-dashboard");
      } else {
        setLocation("/");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome to Murang'a Marketplace</CardTitle>
          <CardDescription className="text-center">Login or create an account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="login-username">Username</Label>
                  <Input
                    id="login-username"
                    type="text"
                    placeholder="Enter your username"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="register-username">Username</Label>
                  <Input
                    id="register-username"
                    type="text"
                    placeholder="Choose a username"
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Choose a strong password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant={userType === "customer" ? "default" : "outline"}
                      onClick={() => setUserType("customer")}
                      className="flex-1"
                    >
                      Customer
                    </Button>
                    <Button
                      type="button"
                      variant={userType === "business" ? "default" : "outline"}
                      onClick={() => setUserType("business")}
                      className="flex-1"
                    >
                      Business Owner
                    </Button>
                  </div>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Register"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            By continuing, you agree to the terms and conditions.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}