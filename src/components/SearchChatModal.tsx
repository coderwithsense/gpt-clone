"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/lib/stores/chatStore";
import { useRouter } from "next/navigation";

interface SearchChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchChatModal = ({ isOpen, onClose }: SearchChatModalProps) => {
  const { chats, fetchChats } = useChatStore();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (isOpen) fetchChats();
  }, [isOpen]);

  const filteredChats = chats.filter((chat) =>
    (chat?.title || "Untitled Chat")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-xl mx-auto p-4 rounded-xl bg-white shadow-xl">
        <DialogTitle className="text-lg font-semibold mb-4">
          Search Chats
        </DialogTitle>
        <Input
          autoFocus
          placeholder="Search chats..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <div className="max-h-64 overflow-y-auto">
          {filteredChats.length === 0 && (
            <p className="text-sm text-gray-500 text-center">
              No results found
            </p>
          )}
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className="p-3 rounded hover:bg-gray-100 cursor-pointer transition"
              onClick={() => {
                onClose();
                router.push(`/c/${chat.id}`);
              }}
            >
              <div className="text-sm font-medium truncate">
                {chat.title || "Untitled Chat"}
              </div>
              <div className="text-xs text-gray-400">
                {chat.updatedAt
                  ? new Date(chat.updatedAt).toLocaleString()
                  : ""}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
