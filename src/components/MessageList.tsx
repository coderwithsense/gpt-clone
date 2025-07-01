import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
  messages: any[];
  isLoading: boolean;
  scrollRef: React.RefObject<HTMLDivElement>;
}

export const MessageList = ({
  messages,
  isLoading,
  scrollRef,
}: MessageListProps) => (
  <div className="flex-1 overflow-y-auto scroll-smooth">
    <div className="space-y-6 p-6 pb-20">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-[70%] rounded-2xl px-4 py-3 bg-chatgpt-gray-100 text-chatgpt-gray-900">
            <p className="text-sm leading-relaxed animate-pulse">Loading...</p>
          </div>
        </div>
      )}
      <div ref={scrollRef} />
    </div>
  </div>
);
