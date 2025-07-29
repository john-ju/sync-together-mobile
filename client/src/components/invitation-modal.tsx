import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, Heart } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface InvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
}

export default function InvitationModal({
  isOpen,
  onClose,
  user,
}: InvitationModalProps) {
  const [partnerCode, setPartnerCode] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const connectPartnerMutation = useMutation({
    mutationFn: async (invitationCode: string) => {
      const response = await apiRequest("POST", `/api/users/${user.id}/connect`, {
        invitationCode,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", user.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", user.id, "partner"] });
      onClose();
      setPartnerCode("");
      toast({
        title: "Connected!",
        description: "You're now connected with your partner.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Invalid invitation code. Please try again.",
        variant: "destructive",
      });
    },
  });

  const copyInvitationCode = async () => {
    if (user?.invitationCode) {
      await navigator.clipboard.writeText(user.invitationCode);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Invitation code copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (partnerCode.trim()) {
      connectPartnerMutation.mutate(partnerCode.trim().toUpperCase());
    }
  };

  const handleClose = () => {
    setPartnerCode("");
    setCopied(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="text-white text-xl" />
            </div>
            <DialogTitle className="text-xl mb-2">Connect with Your Partner</DialogTitle>
            <p className="text-neutral-600 text-sm">
              Share your invitation code or enter theirs to get started
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {user?.invitationCode && (
            <>
              <div>
                <Label>Your Invitation Code</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    type="text"
                    value={user.invitationCode}
                    readOnly
                    className="font-mono text-center"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={copyInvitationCode}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Share this code with your partner
                </p>
              </div>

              <div className="text-center text-neutral-400 text-sm">or</div>
            </>
          )}

          <form onSubmit={handleConnect} className="space-y-4">
            <div>
              <Label htmlFor="partnerCode">Enter Partner's Code</Label>
              <Input
                id="partnerCode"
                type="text"
                placeholder="Enter code here"
                value={partnerCode}
                onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
                className="mt-1 font-mono text-center"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={connectPartnerMutation.isPending || !partnerCode.trim()}
            >
              {connectPartnerMutation.isPending ? "Connecting..." : "Connect"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
