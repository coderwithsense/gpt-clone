"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteChatModalProps {
  isOpen: boolean;
  chatTitle: string;
  onDelete: () => Promise<void> | void;
  onClose: () => void;
}

export const DeleteChatModal = ({
  isOpen,
  chatTitle,
  onDelete,
  onClose,
}: DeleteChatModalProps) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="w-full max-w-sm p-6 rounded-xl bg-white shadow-xl">
      <DialogTitle className="text-lg font-semibold mb-3">
        Delete chat?
      </DialogTitle>

      <p className="text-sm text-chatgpt-gray-800 mb-4">
        This will delete <span className="font-medium">{chatTitle}</span>.
      </p>

      {/* Extra line just like ChatGPT’s modal */}
      {/* <p className="text-xs text-chatgpt-gray-500">
        Visit <span className="underline cursor-pointer">settings</span> to
        delete any memories saved during this chat.
      </p> */}

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          className="bg-red-500 text-white hover:bg-red-600"
          onClick={async () => {
            await onDelete();
            onClose();
          }}
        >
          Delete
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);
