"use client";

import { Layout } from "@/components/Layout";
import { ChatInterface } from "@/components/ChatInterface";
import { useChatStore } from "@/lib/stores/chatStore";
import { useEffect } from "react";

export default function Home() {
  const { clearCurrentChat } = useChatStore();

  // Clear previous state on fresh visit
  useEffect(() => {
    clearCurrentChat();
  }, []);

  return (
    <Layout showAuth={false}>
      <ChatInterface isLoading={false} />
    </Layout>
  );
}
