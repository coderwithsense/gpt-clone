// app/api/chats/stream/route.ts
import { NextRequest } from "next/server";
import { streamText } from "ai";
import { geminiModel } from "@/lib/models";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { messages } = body;

  if (!messages || !Array.isArray(messages)) {
    return new Response("Invalid body: expected { messages: [] }", { status: 400 });
  }

  // Gemini expects: { role, content }, not parts[]
  const formatted = messages.map((msg: any) => {
    const content = msg.parts?.map((p: any) => p.text).join("") || msg.content || "";
    return {
      role: msg.role,
      content,
    };
  });

  console.log("Streaming messages to Gemini:", formatted);

  const result = await streamText({
    model: geminiModel("gemini-2.0-flash-001"),
    system: `You are ChatGPT...`, // your existing system prompt
    messages: formatted,
  });

  return result.toDataStreamResponse();
}
