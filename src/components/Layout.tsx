"use client";

import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useUserStore } from "@/lib/stores/userUserStore";
import { useRouter } from "next/navigation";

import { AuthModal } from "./AuthModal";
import { LogoutModal } from "./LogoutModal";
import { ChatSidebar } from "./ChatSidebar";
import { TopNav } from "./TopNav";

import toast, { Toaster } from "react-hot-toast";

interface LayoutProps {
  children: React.ReactNode;
  showAuth?: boolean;
}

export const Layout = ({ children, showAuth = false }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [currentChatId, setCurrentChatId] = useState<string>("1");

  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { userData, setUserData } = useUserStore();
  const router = useRouter();

  // Show auth modal if required
  useEffect(() => {
    if (showAuth && isLoaded && !isSignedIn) {
      setAuthModalOpen(true);
    }
  }, [showAuth, isLoaded, isSignedIn]);

  // Sync user to DB
  useEffect(() => {
    const syncUserToDB = async () => {
      if (!isSignedIn || !user?.primaryEmailAddress?.emailAddress || userData) return;

      try {
        const res = await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.primaryEmailAddress.emailAddress }),
        });

        const result = await res.json();

        if (res.ok && result.success) {
          setUserData({
            id: user.id,
            email: user.primaryEmailAddress.emailAddress,
            firstName: user.firstName ?? undefined,
            lastName: user.lastName ?? undefined,
          });
        } else {
          console.error("User already exists or failed to create:", result.message);
        }
      } catch (err) {
        console.error("Failed to sync user:", err);
        toast.error("Failed to sync user");
      }
    };

    syncUserToDB();
  }, [user, isSignedIn, userData, setUserData]);

  const handleChatSelect = (chatId: string) => {
    router.push(`/c/${chatId}`);
    setCurrentChatId(chatId);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onChatSelect={handleChatSelect}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top navigation */}
        <TopNav
          isSignedIn={!!isSignedIn}
          isLoaded={isLoaded}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onLogin={() => {
            setAuthMode("login");
            setAuthModalOpen(true);
          }}
          onSignup={() => {
            setAuthMode("signup");
            setAuthModalOpen(true);
          }}
          onLogout={() => setLogoutModalOpen(true)}
        />

        {/* Page content */}
        <div className="flex-1 h-0 overflow-auto">{children}</div>
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />

      <LogoutModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        userEmail={userData?.email || ""}
      />

      <Toaster />
    </div>
  );
};
