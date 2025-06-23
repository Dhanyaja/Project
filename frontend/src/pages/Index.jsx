import React, { useContext, useEffect, useState } from "react";
import LandingPage from "../components/landing/LandingPage";
import { StoreContext } from "../context/StoreContext";
import { Brain } from "lucide-react";
import Dashboard from "../components/dashboard/Dashboard";
import AuthModal from "../components/auth/AuthModal";

const Index = () => {
  const { isLoading, isAuthenticated, setIsAuthenticated, setUserName } =
    useContext(StoreContext);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token) {
      setUserName(user);
      setIsAuthenticated(true);
    }
  }, [setUserName, setIsAuthenticated]); 

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-indigo-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <div>
      <LandingPage onShowAuth={() => setShowAuthModal(true)} />
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default Index;
