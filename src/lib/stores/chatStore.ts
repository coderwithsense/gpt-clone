import { create } from "zustand";

interface Chat {
    id: string;
    title: string;
    updatedAt: string;
}

interface ChatStore {
    chats: Chat[];
    setChats: (chats: Chat[]) => void;
    fetchChats: () => Promise<void>;
    createOrUpdateChat: (chat: { title: string; chatId?: string }) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set) => ({
    chats: [],
    setChats: (chats) => set({ chats }),
    fetchChats: async () => {
        const res = await fetch("/api/chats");
        const data = await res.json();
        if (data.success) set({ chats: data.chats });
    },
    createOrUpdateChat: async ({ title, chatId }) => {
        const res = await fetch("/api/chats", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, chatId }),
        });
        const data = await res.json();
        if (data.success) {
            set((state) => {
                const updatedChats = chatId
                    ? state.chats.map((c) => (c.id === chatId ? data.chat : c))
                    : [data.chat, ...state.chats];
                return { chats: updatedChats };
            });
        }
    },
}));