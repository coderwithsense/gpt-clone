"use client";

import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/stores/userUserStore";

interface TopNavProps {
  isSignedIn: boolean;
  isLoaded: boolean;
  onToggleSidebar: () => void;
  onLogin: () => void;
  onSignup: () => void;
  onLogout: () => void;
}

export const TopNav = ({
  isSignedIn,
  isLoaded,
  onToggleSidebar,
  onLogin,
  onSignup,
  onLogout,
}: TopNavProps) => {
  const { userData } = useUserStore();

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-chatgpt-white">
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="text-chatgpt-gray-600 hover:bg-chatgpt-gray-100 rounded-lg p-2"
        >
          <div className="w-5 h-5 flex flex-col justify-center space-y-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-4 h-0.5 bg-current" />
            ))}
          </div>
        </Button>
        <h1 className="text-lg font-medium text-chatgpt-gray-900">ChatGPT</h1>
      </div>

      <div className="flex items-center space-x-2">
        {!isLoaded ? (
          <span className="text-sm text-chatgpt-gray-500">Loading...</span>
        ) : isSignedIn ? (
          <>
            <span className="text-sm text-chatgpt-gray-700">
              {userData?.email ?? "Loading..."}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
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
              onClick={onLogin}
              className="text-chatgpt-gray-700 hover:bg-chatgpt-gray-100 rounded-full px-4 h-9 text-sm font-medium"
            >
              Log in
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onSignup}
              className="text-chatgpt-gray-700 border-chatgpt-gray-300 hover:bg-chatgpt-gray-50 rounded-full px-4 h-9 text-sm font-medium bg-chatgpt-white"
            >
              Sign up for free
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
