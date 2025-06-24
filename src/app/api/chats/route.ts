import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

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
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  return Response.json({ success: true, chats });
}

// Always create a new chat (for `/` route use-case)
export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
  }

  const { title } = await req.json();

  if (!title || typeof title !== "string") {
    return new Response(JSON.stringify({ success: false, message: "Title is required" }), { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });

  if (!user) {
    return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404 });
  }

  const chat = await prisma.chat.create({
    data: {
      userId: user.id,
      title,
    },
  });

  return Response.json({ success: true, chat });
}
