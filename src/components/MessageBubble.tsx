"use client";

import { useState } from "react";
import { Pencil, X, Check, Copy } from "lucide-react";
import { useChatStore } from "@/lib/stores/chatStore";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import clsx from "clsx";

interface MessageProps {
  message: {
    id: string;
    chatId: string;
    content: string;
    role: "user" | "assistant";
    createdAt: string;
  };
}

export const MessageBubble = ({ message }: MessageProps) => {
  const isUser = message.role === "user";
  const { editMessage, truncateAfter, addMessage, selectedModel } = useChatStore();

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(message.content);
  const [hovered, setHovered] = useState(false);

  const handleCancel = () => {
    setDraft(message.content);
    setIsEditing(false);
  };

  const regenerateMessage = async (
    chatId: string,
    upToId: string,
    prompt: string
  ) => {
    try {
      const res = await fetch("/api/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, upToId, prompt, selectedModel }),
      });

      const data = await res.json();

      if (data.success) {
        addMessage({
          id: Date.now().toString(),
          chatId,
          content: data.message,
          role: "assistant",
          createdAt: new Date().toISOString(),
        });
      } else {
        console.error("Regenerate failed:", data.message);
      }
    } catch (err) {
      console.error("Failed to regenerate:", err);
    }
  };

  const handleSave = () => {
    const trimmed = draft.trim();
    if (!trimmed || trimmed === message.content) {
      setIsEditing(false);
      return;
    }

    editMessage(message.id, trimmed);
    truncateAfter(message.id);
    regenerateMessage(message.chatId, message.id, trimmed);
    setIsEditing(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} my-2 relative`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={clsx(
          "relative max-w-[80%] rounded-2xl px-4 py-3 text-sm transition-all duration-200",
          isUser
            ? "bg-chatgpt-green-500 text-white"
            : "bg-chatgpt-gray-100 text-chatgpt-gray-900"
        )}
      >
        {isEditing ? (
          <textarea
            className={clsx(
              "w-full bg-transparent outline-none resize-none text-sm leading-relaxed min-h-[24px]",
              isUser ? "text-white placeholder-white/70" : "text-chatgpt-gray-900 placeholder-gray-500"
            )}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSave();
              } else if (e.key === "Escape") {
                e.preventDefault();
                handleCancel();
              }
            }}
            onBlur={handleSave}
            autoFocus
            style={{ 
              height: 'auto',
              minHeight: '24px'
            }}
            ref={(textarea) => {
              if (textarea) {
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
              }
            }}
          />
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>

      {/* Hover buttons positioned below the message bubble */}
      {hovered && !isEditing && (
        <div 
          className={clsx(
            "absolute top-full flex gap-1 z-10",
            isUser ? "right-0" : "left-0"
          )}
        >
          {/* Combined Tooltip */}
          <div className="relative group">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-white shadow-md border border-gray-200 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-all duration-200"
            >
              <Copy size={14} />
            </button>
            
            {/* Combined Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              {isUser ? "Copy and Edit" : "Copy"}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
            </div>
          </div>

          {/* Edit Button - only for user messages */}
          {isUser && (
            <div className="relative group">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-white shadow-md border border-gray-200 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-all duration-200"
              >
                <Pencil size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};