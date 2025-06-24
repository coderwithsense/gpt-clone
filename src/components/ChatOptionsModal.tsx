import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share, Archive, Delete, Pencil, Trash } from "lucide-react";

interface ChatOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string | null;
}

export const ChatOptionsModal = ({
  isOpen,
  onClose,
  chatId,
}: ChatOptionsModalProps) => {
  const handleShare = () => {
    console.log("Share chat:", chatId);
    onClose();
  };

  const handleRename = () => {
    console.log("Rename chat:", chatId);
    onClose();
  };

  const handleArchive = () => {
    console.log("Archive chat:", chatId);
    onClose();
  };

  const handleDelete = () => {
    console.log("Delete chat:", chatId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xs p-0 overflow-hidden bg-white border-0 shadow-xl">
        <div className="py-2">
          <Button
            variant="ghost"
            className="w-full justify-start h-12 px-4 text-chatgpt-gray-700 hover:bg-chatgpt-gray-50 transition-colors rounded-none"
            onClick={handleShare}
          >
            <Share className="w-4 h-4 mr-3" />
            Share
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start h-12 px-4 text-chatgpt-gray-700 hover:bg-chatgpt-gray-50 transition-colors rounded-none"
            onClick={handleRename}
          >
            {/* <span className="w-4 h-4 mr-3 flex items-center justify-center">
              ✏️
            </span> */}
            <Pencil className="w-4 h-4 mr-3" />
            Rename
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start h-12 px-4 text-chatgpt-gray-700 hover:bg-chatgpt-gray-50 transition-colors rounded-none"
            onClick={handleArchive}
          >
            <Archive className="w-4 h-4 mr-3" />
            Archive
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start h-12 px-4 text-red-600 hover:bg-red-50 transition-colors rounded-none"
            onClick={handleDelete}
          >
            {/* <span className="w-4 h-4 mr-3 flex items-center justify-center"></span> */}
            <Trash className="w-4 h-4 mr-3" />
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
