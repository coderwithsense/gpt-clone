import { useEffect, useRef } from "react";
import { useChatStore } from "@/lib/stores/chatStore";
import { useRouter } from "next/navigation";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";
import { EmptyState } from "./EmptyState";

interface ChatInterfaceProps {
  isLoading: boolean;
  currentChatId?: string;
}

interface MessageListProps {
  messages: any[];
  isLoading: boolean;
  scrollRef: React.RefObject<HTMLDivElement>;
}

export const ChatInterface = ({
  isLoading: isLoadingFromProps,
  currentChatId,
}: ChatInterfaceProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null!);
  const router = useRouter();

  const { messages, addMessage, isLoading: isLoadingStore } = useChatStore();
  const isLoading = isLoadingStore || isLoadingFromProps;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (trimmed: string) => {
    const userMessage = {
      id: Date.now().toString(),
      chatId: currentChatId || "",
      content: trimmed,
      role: "user" as const,
      createdAt: new Date().toISOString(),
    };

    addMessage(userMessage);

    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed, chatId: currentChatId }),
      });

      const data = await res.json();

      if (data.success) {
        const aiMessage = {
          id: Date.now().toString(),
          chatId: data.chatId || currentChatId,
          content: data.message,
          role: "assistant" as const,
          createdAt: new Date().toISOString(),
        };

        addMessage(aiMessage);

        if (!currentChatId && data.chatId && data.chatId !== "undefined") {
          router.push(`/c/${data.chatId}`);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    /* ⬅️ 1. h-screen instead of h-full so the flex column spans the whole viewport */
    <div className="flex flex-col h-screen bg-chatgpt-white">
      {/* ⬅️ 2. overflow‑y‑auto already present; keep scroll‑smooth for auto‑scroll */}
      <div className="flex-1 overflow-y-auto scroll-smooth">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <MessageList
            messages={messages}
            isLoading={isLoading}
            scrollRef={messagesEndRef}
          />
        )}
      </div>

      {/* Input bar always sticks to the bottom */}
      <ChatInput isLoading={isLoading} onSubmit={handleSend} />
    </div>
  );
};
