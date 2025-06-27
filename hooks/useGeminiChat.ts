'use client';

import { useChat } from '@ai-sdk/react';

export const useGeminiChat = (chatId?: string) => {
    return useChat({
        api: '/api/chats',
        id: chatId ?? 'gemini-chat-session'
    });
};
