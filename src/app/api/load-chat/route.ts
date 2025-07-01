import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getMessagesByChatId } from "@/lib/api";

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { chatId } = await req.json();
        if (!chatId) {
            return NextResponse.json({ success: false, message: "Chat ID is required" }, { status: 400 });
        }

        const messages = await getMessagesByChatId(chatId);

        // console.log("Loaded messages:", messages);
        return NextResponse.json({ success: true, messages });
    } catch (error) {
        console.error("Error loading chat:", error);
        return NextResponse.json({ success: false, message: "Failed to load chat" }, { status: 500 });
    }
}
