"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "./AuthModal";
import { LogoutModal } from "./LogoutModal";
import { ChatSidebar } from "./ChatSidebar";
import toast, { Toaster } from "react-hot-toast";

import { useAuth, useUser } from "@clerk/nextjs";
import { useUserStore } from "@/lib/stores/userUserStore";
import { useRouter } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
  showAuth?: boolean;
}

export const Layout = ({ children, showAuth = false }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [currentChatId, setCurrentChatId] = useState<string>("1");

  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { userData, setUserData } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (showAuth && isLoaded && !isSignedIn) {
      setAuthModalOpen(true);
    }
  }, [showAuth, isLoaded, isSignedIn]);

  useEffect(() => {
    const syncUserToDB = async () => {
      if (!isSignedIn || !user?.primaryEmailAddress?.emailAddress || userData)
        return;

      try {
        const res = await fetch("/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.primaryEmailAddress.emailAddress,
          }),
        });

        const result = await res.json();

        if (res.ok && result.success) {
          // Only set user data if they are new
          setUserData({
            id: user.id,
            email: user.primaryEmailAddress.emailAddress,
            firstName: user.firstName ?? undefined,
            lastName: user.lastName ?? undefined,
          });
        } else {
          console.error(
            "User already exists or failed to create:",
            result.message
          );
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
    <div className="min-h-screen flex w-full bg-chatgpt-white">
      {/* Sidebar */}
      <ChatSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        // currentChatId={currentChatId}
        onChatSelect={handleChatSelect}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <div className="flex items-center justify-between px-4 py-3 bg-chatgpt-white">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-chatgpt-gray-600 hover:bg-chatgpt-gray-100 rounded-lg p-2"
            >
              <div className="w-5 h-5 flex flex-col justify-center space-y-1">
                <div className="w-4 h-0.5 bg-current" />
                <div className="w-4 h-0.5 bg-current" />
                <div className="w-4 h-0.5 bg-current" />
              </div>
            </Button>
            <h1 className="text-lg font-medium text-chatgpt-gray-900">
              ChatGPT
            </h1>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-2">
            {!isLoaded ? (
              <span className="text-sm text-chatgpt-gray-500">Loading...</span>
            ) : isSignedIn ? (
              <>
                <span className="text-sm text-chatgpt-gray-700">
                  {/* Show email from DB (store) */}
                  {userData?.email ?? "Loading..."}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLogoutModalOpen(true)}
                  className="text-chatgpt-gray-700 hover:bg-chatgpt-gray-100 rounded-full px-4 h-9 text-sm font-medium"
                >
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setAuthMode("login");
                    setAuthModalOpen(true);
                  }}
                  className="text-chatgpt-gray-700 hover:bg-chatgpt-gray-100 rounded-full px-4 h-9 text-sm font-medium"
                >
                  Log in
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setAuthMode("signup");
                    setAuthModalOpen(true);
                  }}
                  className="text-chatgpt-gray-700 border-chatgpt-gray-300 hover:bg-chatgpt-gray-50 rounded-full px-4 h-9 text-sm font-medium bg-chatgpt-white"
                >
                  Sign up for free
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />

      {/* Logout Modal */}
      <LogoutModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        userEmail={userData?.email || ""}
      />

      <Toaster />
    </div>
  );
};
