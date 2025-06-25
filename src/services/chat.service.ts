import { createMessage, getMessagesByChatId } from "@/lib/api";
import type { CoreMessage } from "ai";

const askAI = async (prompt: string, userId: string, chatId: string) => {
    try {
        await createMessage({
            chatId,
            role: "user",
            prompt,
        });

        const message = await generateResponse(prompt, userId, chatId);

        await createMessage({
            chatId,
            role: "assistant",
            content: message,
        });

        return message;
    } catch (error) {
        console.error(`[ASK_AI_ERROR]:`, error);
        throw new Error("Failed to process AI response.");
    }
};

const generateResponse = async (prompt: string, userId: string, chatId: string) => {
    const previousMessages = await getMessagesByChatId(chatId);
    const messages: CoreMessage[] = previousMessages.map(({ role, content }) => ({
        role,
        content,
    }));

    messages.push({ role: "user", content: prompt });
    console.log("Messages for AI:", messages);
    return `Response to: ${prompt}`;
}

const createTitle = async (prompt: string) => {
    // Placeholder for title creation logic
    // This could involve calling an AI service or using a predefined algorithm
    return `Title for: ${prompt}`;
}

export { createTitle, askAI };