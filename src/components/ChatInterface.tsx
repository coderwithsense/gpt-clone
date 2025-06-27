import { useState, useEffect, useRef } from "react";
import { useChatStore } from "@/lib/stores/chatStore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Paperclip, Mic } from "lucide-react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface ChatInterfaceProps {
  isLoading: boolean;
  currentChatId?: string;
}

export const ChatInterface = ({
  isLoading: isLoadingFromProps,
  currentChatId,
}: ChatInterfaceProps) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const { messages, addMessage, isLoading: isLoadingStore } = useChatStore();

  const isLoading = isLoadingStore || isLoadingFromProps;

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = {
      id: Date.now().toString(),
      chatId: currentChatId || "",
      content: trimmed,
      role: "user" as "user",
      createdAt: new Date().toISOString(),
    };

    addMessage(userMessage);
    setInput("");

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
          role: "assistant" as "assistant",
          createdAt: new Date().toISOString(),
        };

        addMessage(aiMessage);

        // Only navigate if we're creating a new chat (no currentChatId) AND we got a valid chatId back
        if (!currentChatId && data.chatId && data.chatId !== "undefined") {
          router.push(`/c/${data.chatId}`);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-chatgpt-white">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto scroll-smooth min-h-0">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6 p-6 pb-20">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[70%] rounded-2xl px-4 py-3 bg-chatgpt-gray-100 text-chatgpt-gray-900">
                  <p className="text-sm leading-relaxed animate-pulse">
                    Thinking...
                  </p>
                </div>
              </div>
            )}
            {/* Invisible div to scroll to */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 pb-6 pt-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="relative w-full">
            <div className="flex items-center border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-full px-4 py-[6px] shadow-sm focus-within:ring-2 focus-within:ring-ring transition-colors">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:bg-muted rounded-full w-8 h-8 p-0"
              >
                <Paperclip className="w-4 h-4" />
              </Button>

              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isLoading ? "Waiting for response..." : "Ask anything"
                }
                disabled={isLoading}
                className="flex-1 text-sm placeholder:text-muted-foreground border-none bg-transparent resize-none overflow-hidden max-h-[80px] min-h-[32px] focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-[6px] leading-[20px] disabled:opacity-50"
              />

              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:bg-muted rounded-full w-8 h-8 p-0"
                >
                  <Mic className="w-4 h-4" />
                </Button>

                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-100 disabled:bg-zinc-200 disabled:text-zinc-400 w-8 h-8 p-0 rounded-full"
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </form>

          <div className="text-center mt-3">
            <p className="text-xs text-muted-foreground">
              By messaging ChatGPT, you agree to our{" "}
              <button className="underline hover:no-underline">Terms</button>{" "}
              and have read our{" "}
              <button className="underline hover:no-underline">
                Privacy Policy
              </button>
              .{" "}
              <button className="underline hover:no-underline">
                Cookie Preferences
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MessageBubble = ({ message }: { message: any }) => (
  <div
    className={`flex ${
      message.role === "user" ? "justify-end" : "justify-start"
    }`}
  >
    <div
      className={`max-w-[70%] rounded-2xl px-4 py-3 ${
        message.role === "user"
          ? "bg-chatgpt-green-500 text-white"
          : "bg-chatgpt-gray-100 text-chatgpt-gray-900"
      }`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {message.content}
      </ReactMarkdown>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full px-4">
    <div className="text-center max-w-2xl w-full">
      <h2 className="text-2xl font-normal text-chatgpt-gray-900 mb-12">
        What are you working on?
      </h2>
      <div className="grid grid-cols-2 gap-3 mb-8 max-w-lg mx-auto">
        {[
          "📝 Summarize text",
          "💡 Brainstorm",
          "📝 Make a plan",
          "📊 Analyze data",
          "💻 Code",
          "More",
        ].map((item, idx) => (
          <Button
            key={idx}
            variant="outline"
            className="h-12 text-left text-chatgpt-gray-700 border-chatgpt-gray-200 hover:bg-chatgpt-gray-50 transition-colors rounded-xl bg-chatgpt-white flex items-center justify-start px-4"
          >
            <span className="mr-3">{item.split(" ")[0]}</span>
            <span className="text-sm">
              {item.split(" ").slice(1).join(" ")}
            </span>
          </Button>
        ))}
      </div>
    </div>
  </div>
);
