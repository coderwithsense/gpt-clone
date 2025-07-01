import { useChatStore } from "../stores/chatStore";

export async function regenerateFromMessage({
    chatId,
    upToId,
    prompt,
}: {
    chatId: string;
    upToId: string;
    prompt: string;
}) {

    const { addMessage, selectedModel } = useChatStore.getState();
    try {
        const res = await fetch("/api/regenerate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chatId, messageId: upToId, newContent: prompt, selectedModel: selectedModel }),
        });

        const data = await res.json();

        if (data.success) {
            addMessage({
                id: Date.now().toString(),
                chatId,
                content: data.message,
                role: "assistant",
                createdAt: new Date().toISOString(),
            });
        } else {
            console.error("Regeneration failed:", data.message);
        }
    } catch (err) {
        console.error("Error during regeneration:", err);
    }
}
