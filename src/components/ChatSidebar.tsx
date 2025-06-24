import { useState } from "react";
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

interface Chat {
  id: string;
  title: string;
  timestamp: string;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentChatId?: string;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
}

export const ChatSidebar = ({
  isOpen,
  onToggle,
  currentChatId,
  onChatSelect,
  onNewChat,
}: ChatSidebarProps) => {
  const [selectedChatForOptions, setSelectedChatForOptions] = useState<
    string | null
  >(null);

  // Mock chat data
  const chats: Chat[] = [
    { id: "1", title: "India Coding Chat", timestamp: "2 hours ago" },
    { id: "2", title: "Opening Razer Cobra Mouse", timestamp: "1 day ago" },
    {
      id: "3",
      title: "JavaScript Element Manipulation",
      timestamp: "2 days ago",
    },
    { id: "4", title: "MAANG Junior Developer Guide", timestamp: "3 days ago" },
    { id: "5", title: "Corporate card error fix", timestamp: "1 week ago" },
    { id: "6", title: "PS5 Controller Sensor Type", timestamp: "1 week ago" },
    { id: "7", title: "RDR2 Game Identification", timestamp: "2 weeks ago" },
    { id: "8", title: "Developer Summary Skills", timestamp: "2 weeks ago" },
    // make 10 more chats
    {
      id: "9",
      title: "React Performance Optimization",
      timestamp: "3 weeks ago",
    },
    { id: "10", title: "Next.js Deployment Issues", timestamp: "3 weeks ago" },
    {
      id: "11",
      title: "Tailwind CSS Best Practices",
      timestamp: "4 weeks ago",
    },
    { id: "12", title: "GraphQL vs REST APIs", timestamp: "1 month ago" },
    {
      id: "13",
      title: "Docker Container Management",
      timestamp: "1 month ago",
    },
    { id: "14", title: "Kubernetes Basics", timestamp: "1 month ago" },
    {
      id: "15",
      title: "AWS S3 Bucket Configuration",
      timestamp: "1 month ago",
    },
    { id: "16", title: "Azure DevOps Pipelines", timestamp: "1 month ago" },
    { id: "17", title: "Google Cloud Functions", timestamp: "1 month ago" },
    {
      id: "18",
      title: "Firebase Authentication Setup",
      timestamp: "1 month ago",
    },
    {
      id: "19",
      title: "PostgreSQL Database Optimization",
      timestamp: "1 month ago",
    },
    {
      id: "20",
      title: "MongoDB Indexing Strategies",
      timestamp: "1 month ago",
    },
  ];

  if (!isOpen) return null;

  return (
    <>
      <div className="w-64 h-screen bg-chatgpt-gray-50 border-r border-chatgpt-gray-200 flex flex-col">
        <div className="p-3">
          <Button
            onClick={onNewChat}
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
          >
            <Search className="w-4 h-4 mr-2" />
            Search chats
          </Button>
        </div>

        {/* Scrollable Chats Section */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3">
          <div className="text-xs font-medium text-chatgpt-gray-500 mb-2 px-2">
            Chats
          </div>
          <div className="space-y-1 mb-6">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`group flex items-center w-full p-2 rounded-lg cursor-pointer transition-colors ${
                  currentChatId === chat.id
                    ? "bg-chatgpt-gray-100"
                    : "hover:bg-chatgpt-gray-100"
                }`}
                onClick={() => onChatSelect(chat.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-chatgpt-gray-900 truncate">
                    {chat.title}
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
                    {/* add a line  */}
                    <hr className="h-px my-1  bg-gray-200 border-0 dark:bg-gray-700"></hr>

                    <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-accent">
                      <Archive className="w-4 h-4" />
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 text-sm rounded-md text-destructive hover:bg-red-100 dark:hover:bg-red-900">
                      <Trash className="w-4 h-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Buttons */}
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
    </>
  );
};
