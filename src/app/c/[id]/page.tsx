"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useChatStore } from "@/lib/stores/chatStore";
import { ChatInterface } from "@/components/ChatInterface";
import { ChatSidebar } from "@/components/ChatSidebar";
import { useState } from "react";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.id as string;

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { currentChat, messages, isLoading, loadChat, clearCurrentChat } =
    useChatStore();

  useEffect(() => {
    if (chatId) {
      loadChat(chatId);
    }

    // Cleanup when component unmounts or chatId changes
    return () => {
      clearCurrentChat();
    };
  }, [chatId, loadChat, clearCurrentChat]);

  // If chat doesn't exist or failed to load, redirect to home
  useEffect(() => {
    if (!isLoading && chatId && !currentChat) {
      router.push("/");
    }
  }, [isLoading, chatId, currentChat, router]);

  const handleChatSelect = (newChatId: string) => {
    if (newChatId !== chatId) {
      router.push(`/c/${newChatId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <ChatSidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onChatSelect={handleChatSelect}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading chat...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <ChatSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onChatSelect={handleChatSelect}
      />
      <div className="flex-1">
        <ChatInterface
          currentChatId={chatId}
          messages={messages}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
