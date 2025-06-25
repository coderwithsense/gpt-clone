import { create } from "zustand";

interface Chat {
    id: string;
    title?: string;
    updatedAt: string;
}

interface ChatStore {
    chats: Chat[];
    setChats: (chats: Chat[]) => void;
    fetchChats: () => Promise<void>;
    deleteChat: (chatId: string) => Promise<void>;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useChatStore = create<ChatStore>((set) => ({
    chats: [],

    setChats: (chats) => set({ chats }),

    fetchChats: async () => {
        const data = await fetcher("/api/chats");
        if (data.success) {
            set({ chats: data.chats });
        }
    },

    // Remove createOrUpdateChat - let the backend handle this
    // The message sending will create chats automatically

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
}));