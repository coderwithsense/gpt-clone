import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_MODEL, ModelConfig, MODELS } from "@/lib/config/models";

interface Message {
  id: string;
  chatId: string;
  content: string;
  role: "user" | "assistant";
  createdAt: string;
}

interface Chat {
  id: string;
  title?: string;
  updatedAt: string;
  createdAt: string;
}

interface ChatStore {
  // Chat list state
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
  fetchChats: () => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;

  // Current chat state
  currentChat: Chat | null;
  messages: Message[];
  isLoading: boolean;

  // Model selection
  selectedModel: string;
  setSelectedModel: (model: string) => void;

  // Current chat actions
  loadChat: (chatId: string) => Promise<void>;
  clearCurrentChat: () => void;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  editMessage: (id: string, newContent: string) => void;
  truncateAfter: (id: string) => void;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      // Chat list state
      chats: [],

      // Current chat state
      currentChat: null,
      messages: [],
      isLoading: false,

      // Model selection
      selectedModel: DEFAULT_MODEL,
      setSelectedModel: (model: string) => set({ selectedModel: model }),

      setChats: (chats) => set({ chats }),

      fetchChats: async () => {
        try {
          const data = await fetcher("/api/chats");
          if (data.success) {
            set({ chats: data.chats });
          }
        } catch (error) {
          console.error("Failed to fetch chats:", error);
        }
      },

      deleteChat: async (chatId: string) => {
        // 1. Optimistically update Zustand state
        set((state) => ({
          chats: state.chats.filter((c) => c.id !== chatId),
        }));

        try {
          const res = await fetch("/api/chats", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chatId }),
          });

          const data = await res.json();

          if (!res.ok || !data.success) {
            throw new Error(data.message || "Failed to delete chat");
          }

          // 2. Re-fetch to stay in sync
          const refreshed = await fetch("/api/chats").then((res) => res.json());
          if (refreshed.success && refreshed.chats) {
            set({ chats: refreshed.chats });
          }
        } catch (error) {
          console.error("Delete error:", error);

          // 3. Rollback: refresh full chat list
          const fallback = await fetch("/api/chats").then((res) => res.json());
          if (fallback.success && fallback.chats) {
            set({ chats: fallback.chats });
          }

          throw error;
        }
      },

      loadChat: async (chatId: string) => {
        console.log("🛫 loadChat called with", chatId);
        set({ isLoading: true });

        try {
          const res = await fetch("/api/load-chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chatId }),
          });
          const data = await res.json();
          console.log("🛬 loadChat response", data);

          if (res.ok && data.success) {
            set({ messages: data.messages, isLoading: false });
          } else {
            set({ messages: [], isLoading: false });
          }
        } catch (err) {
          console.error("loadChat ‑ fetch error:", err);
          set({ messages: [], isLoading: false });
        }
      },

      clearCurrentChat: () => {
        set({
          currentChat: null,
          messages: [],
          isLoading: false,
        });
      },

      addMessage: (message: Message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      },

      setMessages: (messages: Message[]) => {
        set({ messages });
      },

      editMessage: (id, newContent) =>
        set(state => ({
          messages: state.messages.map(m =>
            m.id === id ? { ...m, content: newContent } : m
          ),
        })),

      truncateAfter: id =>
        set(state => {
          const idx = state.messages.findIndex(m => m.id === id);
          return idx === -1
            ? {}
            : { messages: state.messages.slice(0, idx + 1) };
        }),
    }),
    {
      name: 'chat-store',
      partialize: (state) => ({
        selectedModel: state.selectedModel,
      }),
    }
  )
);