import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: {
    name: string;
    profilePicture?: string;
  };
}

export default function ProfilePictureModal({
  isOpen,
  onClose,
  partner,
}: ProfilePictureModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 bg-black/95 border-none">
        <DialogHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-lg font-medium">
              {partner.name}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex items-center justify-center p-8">
          {partner.profilePicture ? (
            <img
              src={partner.profilePicture}
              alt={partner.name}
              className="max-w-full max-h-[70vh] rounded-lg object-contain"
            />
          ) : (
            <div className="w-64 h-64 bg-gradient-to-br from-primary to-purple rounded-full flex items-center justify-center">
              <span className="text-6xl font-bold text-white">
                {partner.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}