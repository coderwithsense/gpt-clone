import { createMessage, getMessagesByChatId } from "@/lib/api";
import { MODELS } from "@/lib/config/models";
import { geminiModel } from "@/lib/models";
import { generateText, streamText, type CoreMessage } from "ai";

const askAI = async (modelSelected: string, prompt: string, userId: string, chatId: string) => {
    try {
        await createMessage({
            chatId,
            role: "user",
            prompt,
        });

        const message = await generateResponse(modelSelected, prompt, userId, chatId);

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

const generateStreamResponse = async (modelSelected: string, prompt: string, userId: string, chatId: string) => {
    const previousMessages = await getMessagesByChatId(chatId);
    const messages: CoreMessage[] = previousMessages.map(({ role, content }) => ({
        role,
        content,
    }));

    messages.push({ role: "user", content: prompt });
    // console.log("Messages for AI:", messages);
    const systemPrompt = MODELS[modelSelected].systemPrompt;
    const response = streamText({
        model: geminiModel("gemini-2.0-flash-001"),
        system: systemPrompt,
        messages
    })
    return streamText;
}

export const generateResponseWithMessages = async (modelSelected: string, messages: CoreMessage[]) => {
    const systemPrompt = MODELS[modelSelected].systemPrompt;
    const model = MODELS[modelSelected].model;
    const imageMessage: CoreMessage[] = [
        {
            role: 'user',
            content: 'What is there in the image? Image URL: https://t3.ftcdn.net/jpg/03/26/50/04/360_F_326500445_ZD1zFSz2cMT1qOOjDy7C5xCD4shawQfM.jpg'
        }
    ];
    const response = await generateText({
        model: model("gemini-2.5-flash-preview-04-17"),
        system: systemPrompt,
        messages: messages
    });
    return response.text;
}

const generateResponse = async (modelSelected: string, prompt: string, userId: string, chatId: string) => {
    const previousMessages = await getMessagesByChatId(chatId);
    const messages: CoreMessage[] = previousMessages.map(({ role, content }) => ({
        role,
        content,
    }));

    messages.push({ role: "user", content: prompt });
    // console.log("Messages for AI:", messages);

    const systemPrompt = MODELS[modelSelected].systemPrompt;
    const model = MODELS[modelSelected].model;

    const response = await generateText({
        model: model("gemini-2.0-flash-001"),
        system: systemPrompt,
        messages
    })
    return response.text;
    // return `Response to: ${prompt}`;
}

const createTitle = async (prompt: string) => {
    const result = await generateText({
        model: geminiModel("gemini-2.0-flash-lite-preview-02-05"),
        prompt: `Do NOT include explanations, punctuation, or quotation marks. Just return the title, nothing else. Create a title for my chat in not more than 3-5 words, this is the first prompt for the user: "${prompt}"`,
        temperature: 0.5,
    });

    return result.text;
    // return `Title for: ${prompt}`;
};

export { createTitle, askAI };