import { getMessagesByChatId } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");

    if (!chatId) {
        return NextResponse.json({ success: false, message: "Missing chatId" }, { status: 400 });
    }

    const messages = await getMessagesByChatId(chatId);
    return NextResponse.json({ success: true, messages });
}
