export const TypingBubble = () => (
  <div className="flex justify-start">
    <div className="max-w-[70%] rounded-2xl px-4 py-3 bg-chatgpt-gray-100">
      <span className="inline-flex space-x-1.5">
        {/* 3 bouncing dots */}
        <span className="dot dot-1" />
        <span className="dot dot-2" />
        <span className="dot dot-3" />
      </span>
    </div>
  </div>
);
