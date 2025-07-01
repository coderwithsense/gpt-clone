"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import { useChatStore } from "@/lib/stores/chatStore";
import { MODELS } from "@/lib/config/models";
import { Check, ChevronDown, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ModelSelector() {
  const { selectedModel, setSelectedModel } = useChatStore();
  const currentModel = MODELS[selectedModel];
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between text-sm font-medium"
        >
          {currentModel?.name}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandGroup>
            {Object.entries(MODELS).map(([key, model]) => (
              <CommandItem
                key={key}
                onSelect={() => {
                  setSelectedModel(key);
                  setOpen(false);
                }}
                className="justify-between items-start flex-col px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{model.name}</span>
                </div>

                {selectedModel === key && (
                  <Check className="absolute right-2 top-2 h-4 w-4 text-green-500" />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
