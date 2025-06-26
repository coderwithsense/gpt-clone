"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Archive,
  Settings,
  MoreHorizontal,
  Trash,
  Pencil,
  Share2,
} from "lucide-react";
import { ChatOptionsModal } from "./ChatOptionsModal";
import { DeleteChatModal } from "./DeleteChatModal";
import { formatDistanceToNow } from "date-fns";
import { useChatStore } from "@/lib/stores/chatStore";
import { useRouter } from "next/navigation";
import { SearchChatModal } from "./SearchChatModal";

interface Chat {
  id: string;
  title?: string;
  chatId: string;
  updatedAt: string;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onChatSelect: (chatId: string) => void;
}

export const ChatSidebar = ({
  isOpen,
  onToggle,
  onChatSelect,
}: ChatSidebarProps) => {
  const [selectedChatForOptions, setSelectedChatForOptions] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const { chats, fetchChats, deleteChat } = useChatStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchChats();
  }, []);

  if (!isOpen) return null;

  return (
    <>
      <div className="w-64 h-screen bg-chatgpt-gray-50 border-r border-chatgpt-gray-200 flex flex-col">
        <div className="p-3">
          <Button
            onClick={() => router.push("/")}
            className="w-full justify-start h-11 bg-white border border-chatgpt-gray-200 text-chatgpt-gray-700 hover:bg-chatgpt-gray-50 transition-colors rounded-full"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            New chat
          </Button>
        </div>

        <div className="px-3 mb-2">
          <Button
            variant="ghost"
            className="w-full justify-start h-10 text-chatgpt-gray-600 hover:bg-chatgpt-gray-100 transition-colors rounded-lg"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="w-4 h-4 mr-2" />
            Search chats
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-3">
          <div className="text-xs font-medium text-chatgpt-gray-500 mb-2 px-2">Chats</div>
          <div className="space-y-1 mb-6">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className="group flex items-center w-full p-2 rounded-lg cursor-pointer transition-colors hover:bg-chatgpt-gray-100"
                onClick={() => onChatSelect(chat.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-chatgpt-gray-900 truncate">
                    {chat.title || "Untitled Chat"}
                  </div>
                  <div className="text-xs text-chatgpt-gray-500">
                    {chat.updatedAt
                      ? formatDistanceToNow(new Date(chat.updatedAt), {
                          addSuffix: true,
                        })
                      : "Just now"}
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-32 p-3 bg-popover text-popover-foreground rounded-md shadow-md border border-border"
                  >
                    <DropdownMenuItem
                      onClick={() => setSelectedChatForOptions(chat.id)}
                      className="flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-accent"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-accent">
                      <Pencil className="w-4 h-4" />
                      Rename
                    </DropdownMenuItem>
                    <hr className="h-px my-1 bg-gray-200 border-0 dark:bg-gray-700" />
                    <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-accent">
                      <Archive className="w-4 h-4" />
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-2 px-2 py-2 text-sm rounded-md text-destructive hover:bg-red-100 dark:hover:bg-red-900"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget({ id: chat.id, title: chat.title || "Untitled Chat" });
                      }}
                    >
                      <Trash className="w-4 h-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 border-t border-chatgpt-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start h-10 text-chatgpt-gray-600 hover:bg-chatgpt-gray-100 transition-colors rounded-lg"
          >
            <Archive className="w-4 h-4 mr-2" />
            Library
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start h-10 text-chatgpt-gray-600 hover:bg-chatgpt-gray-100 transition-colors mt-1 rounded-lg"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <ChatOptionsModal
        isOpen={selectedChatForOptions !== null}
        onClose={() => setSelectedChatForOptions(null)}
        chatId={selectedChatForOptions}
      />

      <SearchChatModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <DeleteChatModal
        isOpen={deleteTarget !== null}
        chatTitle={deleteTarget?.title ?? ""}
        onClose={() => setDeleteTarget(null)}
        onDelete={async () => {
          if (deleteTarget) {
            await deleteChat(deleteTarget.id);
            router.push("/");
            fetchChats();
          }
        }}
      />
    </>
  );
};
