import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

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

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) {
        return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
    }

    const { title, chatId } = await req.json();
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
        return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404 });
    }

    let chat;
    if (chatId) {
        chat = await prisma.chat.update({
            where: { id: chatId },
            data: { title },
        });
    } else {
        chat = await prisma.chat.create({
            data: {
                userId: user.id,
                title,
            },
        });
    }

    return Response.json({ success: true, chat });
}