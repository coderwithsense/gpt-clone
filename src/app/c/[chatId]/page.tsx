"use client";

import { useParams } from "next/navigation";
import { ChatInterface } from "@/components/ChatInterface";
import { Layout } from "@/components/Layout";
import { useChatStore } from "@/lib/stores/chatStore";
import { useEffect } from "react";

export default function ChatByIdPage() {
  const params = useParams<{ chatId?: string }>();
  const chatId = typeof params.chatId === "string" ? params.chatId : undefined;
  const { loadChat, setMessages } = useChatStore();

  useEffect(() => {
    if (typeof chatId === "string") {
      // alert("Chat ID changed, loading messages...");
      loadChat(chatId);
    } else {
      setMessages([]);
    }
  }, [chatId]);

  return (
    <Layout showAuth={false}>
      {chatId && <ChatInterface currentChatId={chatId} isLoading={false} />}
    </Layout>
  );
}
