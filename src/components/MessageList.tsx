import { MessageBubble } from "./MessageBubble";
import { TypingBubble } from "./TypingBubble";

interface MessageListProps {
  messages: any[];
  isLoading: boolean;
  scrollRef: React.RefObject<HTMLDivElement>;
}

export const MessageList = ({ messages, isLoading, scrollRef }: MessageListProps) => (
  <div className="flex-1 overflow-y-auto scroll-smooth">
    <div className="space-y-6 p-6 pb-20">
      {messages.map((m) => (
        <MessageBubble key={m.id} message={m} />
      ))}

      {/* 🔄 typing indicator */}
      {isLoading && <TypingBubble />}

      <div ref={scrollRef} />
    </div>
  </div>
);
