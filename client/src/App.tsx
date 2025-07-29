import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Welcome from "@/pages/welcome";

function Router() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if user exists in localStorage
    const savedUserId = localStorage.getItem('userId');
    if (savedUserId) {
      setCurrentUser(savedUserId);
    }
  }, []);

  const handleUserNotFound = () => {
    localStorage.removeItem('userId');
    setCurrentUser(null);
  };

  const handleAuthSuccess = (user: any) => {
    setCurrentUser(user.id);
  };

  return (
    <Switch>
      <Route path="/" component={() => currentUser ? <Home userId={currentUser} onUserNotFound={handleUserNotFound} /> : <Welcome />} />
      <Route path="/home" component={() => currentUser ? <Home userId={currentUser} onUserNotFound={handleUserNotFound} /> : <Welcome />} />
      <Route path="/login" component={() => currentUser ? <Home userId={currentUser} onUserNotFound={handleUserNotFound} /> : <Login onLoginSuccess={handleAuthSuccess} />} />
      <Route path="/register" component={() => currentUser ? <Home userId={currentUser} onUserNotFound={handleUserNotFound} /> : <Register onRegisterSuccess={handleAuthSuccess} />} />
      <Route>404 - Page not found</Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
