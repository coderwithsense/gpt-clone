import { NextRequest, NextResponse } from "next/server";
import {
    updateMessageContent,
    deleteMessagesAfter,
    createNewAssistantMessage,
    getMessagesByChatId,
} from "@/lib/api";
import { generateText } from "ai";
import { geminiModel } from "@/lib/models";
import prisma from "@/lib/prisma";
import { generateResponseWithMessages } from "@/services/chat.service";

export async function POST(req: NextRequest) {
    try {
        const { chatId, upToId, prompt } = await req.json();
        console.log("Regenerate request:", { chatId, upToId, prompt });

        if (!chatId || !upToId || !prompt) {
            return NextResponse.json(
                { success: false, message: "Missing parameters" },
                { status: 400 }
            );
        }

        // Step 1: Confirm the message exists
        const existing = await prisma.message.findUnique({ where: { id: upToId } });
        if (!existing) {
            return NextResponse.json(
                { success: false, message: "Message not found" },
                { status: 404 }
            );
        }

        // Step 2: Update user message
        await updateMessageContent(upToId, prompt);

        // Step 3: Delete messages after
        await deleteMessagesAfter(chatId, upToId);

        // Step 4: Get chat history
        const history = await getMessagesByChatId(chatId);
        const cleanHistory = history
            .filter((msg) => msg.content?.trim())
            .map((msg) => ({ role: msg.role, content: msg.content.trim() }));

        cleanHistory.push({ role: "user", content: prompt.trim() });

        // Step 5: Gemini call
        const aiResponse = await generateResponseWithMessages(cleanHistory);

        // Step 6: Save assistant reply
        await createNewAssistantMessage(chatId, aiResponse);

        return NextResponse.json({
            success: true,
            message: aiResponse,
        });
    } catch (error) {
        console.error("Regeneration error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to regenerate message" },
            { status: 500 }
        );
    }
}
