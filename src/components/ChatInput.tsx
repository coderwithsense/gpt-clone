"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Paperclip, Mic } from "lucide-react";

interface ChatInputProps {
  isLoading: boolean;
  onSubmit: (message: string) => void;
}

export const ChatInput = ({ isLoading, onSubmit }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitMessage();
    }
  };

  const submitMessage = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    onSubmit(trimmed);
    setInput("");
  };

  return (
    <div className="px-4 pb-6 pt-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={(e) => e.preventDefault()} className="relative w-full">
          <div className="flex items-center border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-full px-4 py-[6px] shadow-sm focus-within:ring-2 focus-within:ring-ring transition-colors">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:bg-muted rounded-full w-8 h-8 p-0"
            >
              <Paperclip className="w-4 h-4" />
            </Button>

            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isLoading ? "Waiting for response..." : "Ask anything"
              }
              disabled={isLoading}
              className="flex-1 text-sm placeholder:text-muted-foreground border-none bg-transparent resize-none overflow-hidden max-h-[80px] min-h-[32px] focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-[6px] leading-[20px] disabled:opacity-50"
            />

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:bg-muted rounded-full w-8 h-8 p-0"
              >
                <Mic className="w-4 h-4" />
              </Button>

              <Button
                type="submit"
                onClick={submitMessage}
                size="icon"
                disabled={!input.trim() || isLoading}
                className="bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-100 disabled:bg-zinc-200 disabled:text-zinc-400 w-8 h-8 p-0 rounded-full"
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </form>

        <div className="text-center mt-3">
          <p className="text-xs text-muted-foreground">
            By messaging ChatGPT, you agree to our{" "}
            <button className="underline hover:no-underline">Terms</button> and
            have read our{" "}
            <button className="underline hover:no-underline">
              Privacy Policy
            </button>
            .{" "}
            <button className="underline hover:no-underline">
              Cookie Preferences
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
