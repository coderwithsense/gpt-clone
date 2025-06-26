"use client";

import { useState } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { Layout } from "@/components/Layout";

interface Message {
  id: string;
  chatId: string;
  content: string;
  role: "user" | "assistant";
  createdAt: string;
}

const Home = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // const handleSendMessage = async (content: string) => {
  //   const userMessage: Message = {
  //     id: Date.now().toString(),
  //     role: "user",
  //     content,
  //     createdAt: new Date(),
  //   };

  //   setMessages((prev) => [...prev, userMessage]);

  //   try {
  //     const res = await fetch("/api/chats", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ prompt: content }),
  //     });

  //     const data = await res.json();

  //     if (data.success) {
  //       const aiResponse: Message = {
  //         id: Date.now().toString(),
  //         role: "assistant",
  //         content: data.message, // real response from `askAI`
  //         timestamp: new Date(),
  //       };

  //       setMessages((prev) => [...prev, aiResponse]);
  //     } else {
  //       throw new Error(data.message || "Unknown error");
  //     }
  //   } catch (error) {
  //     console.error("Send message error:", error);
  //   }
  // };

  // Show auth modal on first visit
  const handleShowAuth = () => {
    setShowAuthModal(true);
  };

  return (
    <Layout showAuth={showAuthModal}>
      <ChatInterface
        messages={messages}
        isLoading={false}
      />
    </Layout>
  );
};

export default Home;
