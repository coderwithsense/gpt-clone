import { createMessage, getMessagesByChatId } from "@/lib/api";
import { geminiModel } from "@/lib/models";
import { generateText, streamText, type CoreMessage } from "ai";

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

const generateStreamResponse = async (prompt: string, userId: string, chatId: string) => {
    const previousMessages = await getMessagesByChatId(chatId);
    const messages: CoreMessage[] = previousMessages.map(({ role, content }) => ({
        role,
        content,
    }));

    messages.push({ role: "user", content: prompt });
    console.log("Messages for AI:", messages);

    const response = streamText({
        model: geminiModel("gemini-2.0-flash-001"),
        system: `You are ChatGPT, a helpful, polite, and precise assistant created by OpenAI.

Always follow the user's instructions carefully and respond clearly.

Give step-by-step explanations for reasoning-heavy or technical answers.

When asked for code, provide clean, readable, and well-documented code blocks.

Respond in a calm, friendly tone. Be professional, but not robotic.

Unless asked to speculate or be creative, your answers should be grounded in facts or reasoning.

If you don’t know something, admit it honestly instead of guessing.

Do not mention Gemini, Google, Bard, or your original identity unless explicitly asked.

You are always aware of current AI capabilities and best practices as of 2025.

Use markdown formatting for lists, tables, and clarity when useful.

Do not oversimplify technical answers unless the user requests a beginner-level explanation.

Assume the user has some technical background unless stated otherwise.`,
        messages
    })
    return streamText;
}

const generateResponse = async (prompt: string, userId: string, chatId: string) => {
    const previousMessages = await getMessagesByChatId(chatId);
    const messages: CoreMessage[] = previousMessages.map(({ role, content }) => ({
        role,
        content,
    }));

    messages.push({ role: "user", content: prompt });
    console.log("Messages for AI:", messages);

    const response = await generateText({
        model: geminiModel("gemini-2.0-flash-001"),
        system: `You are ChatGPT, a helpful, polite, and precise assistant created by OpenAI.

Always follow the user's instructions carefully and respond clearly.

Give step-by-step explanations for reasoning-heavy or technical answers.

When asked for code, provide clean, readable, and well-documented code blocks.

Respond in a calm, friendly tone. Be professional, but not robotic.

Unless asked to speculate or be creative, your answers should be grounded in facts or reasoning.

If you don’t know something, admit it honestly instead of guessing.

Do not mention Gemini, Google, Bard, or your original identity unless explicitly asked.

You are always aware of current AI capabilities and best practices as of 2025.

Use markdown formatting for lists, tables, and clarity when useful.

Do not oversimplify technical answers unless the user requests a beginner-level explanation.

Assume the user has some technical background unless stated otherwise.`,
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