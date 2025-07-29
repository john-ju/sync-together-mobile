import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import IconPicker from "@/components/icon-picker";

interface CustomStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onStatusCreated: () => void;
}

export default function CustomStatusModal({
  isOpen,
  onClose,
  userId,
  onStatusCreated,
}: CustomStatusModalProps) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("user");
  const [expiration, setExpiration] = useState("never");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createStatusMutation = useMutation({
    mutationFn: async () => {
      let expiresAt = null;
      if (expiration !== "never") {
        const minutes = parseInt(expiration);
        expiresAt = new Date(Date.now() + minutes * 60 * 1000);
      }

      const response = await apiRequest("POST", "/api/statuses", {
        userId,
        type: "custom",
        title: title.trim(),
        message: message.trim() || null,
        icon: selectedIcon,
        color: "info",
        expiresAt,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "activity"] });
      onStatusCreated();
      onClose();
      setTitle("");
      setMessage("");
      setSelectedIcon("user");
      setExpiration("never");
      toast({
        title: "Custom status set!",
        description: "Your status has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to set custom status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      createStatusMutation.mutate();
    }
  };

  const handleClose = () => {
    setTitle("");
    setMessage("");
    setSelectedIcon("user");
    setExpiration("never");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Custom Status</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Status Title</Label>
            <Input
              id="title"
              placeholder="What are you up to?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="icon">Icon</Label>
            <div className="mt-1">
              <IconPicker 
                selectedIcon={selectedIcon} 
                onIconSelect={setSelectedIcon} 
              />
            </div>
          </div>

          <div>
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Add more details..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 resize-none"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="expiration">Auto-expire after</Label>
            <Select value={expiration} onValueChange={setExpiration}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Never</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
                <SelectItem value="240">4 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={createStatusMutation.isPending || !title.trim()}
            >
              {createStatusMutation.isPending ? "Setting..." : "Set Status"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
