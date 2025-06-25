import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { createChat, getChatById } from "@/lib/api";
import { askAI } from "@/services/chat.service";

// Get all chats for a user
export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });

  if (!user) {
    return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404 });
  }

  const chats = await prisma.chat.findMany({
    where: { userId: userId },
    orderBy: { updatedAt: "desc" },
  });

  console.log('Fetched chats for user:', userId, 'Chats:', chats);

  return Response.json({ success: true, chats });
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'User not authenticated',
      }, { status: 401 });
    }

    const { chatId, prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({
        success: false,
        message: 'Prompt is required',
      }, { status: 400 });
    }

    let chat = chatId ? await getChatById(chatId) : null;

    if (!chat) {
      chat = await createChat(prompt, userId);
      console.log('New chat created:', chat);
    }

    const message = await askAI(prompt, userId, chat?.id as string)

    return NextResponse.json({
      success: true,
      message: message,
      chatId: chat?.id,
    }, { status: 200 });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while processing your request',
      chatId: 'chat'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { chatId } = await request.json();
  if (!chatId) {
    return NextResponse.json({ success: false, message: "Chat ID is required" }, { status: 400 });
  }

  try {
    const chat = await prisma.chat.findUnique({ where: { id: chatId, userId } });
    if (!chat) {
      return NextResponse.json({ success: false, message: "Chat not found" }, { status: 404 });
    }

    await prisma.message.deleteMany({ where: { chatId } });
    await prisma.chat.delete({ where: { id: chatId } });

    return NextResponse.json({ success: true, message: "Chat deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return NextResponse.json({ success: false, message: "Failed to delete chat" }, { status: 500 });
  }
}