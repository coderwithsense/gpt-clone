import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export const LogoutModal = ({
  isOpen,
  onClose,
  userEmail = "user@example.com",
}: LogoutModalProps) => {
  const { signOut } = useClerk();

  const handleLogout = async () => {
    try {
      await signOut();
      onClose();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl">
        <div className="px-8 py-10 text-center">
          <DialogTitle>
            <p className="text-xl font-semibold text-gray-900 mb-4">
              Are you sure you want to log out?
            </p>
          </DialogTitle>

          <p className="text-gray-600 text-sm mb-8">
            Log out of ChatGPT as {userEmail}?
          </p>

          <div className="space-y-3">
            <Button
              onClick={handleLogout}
              className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium rounded-full transition-colors"
            >
              Log out
            </Button>

            <Button
              variant="outline"
              onClick={onClose}
              className="w-full h-12 border border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
