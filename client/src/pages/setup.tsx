import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Copy, Check } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SetupProps {
  onUserCreated: (userId: string) => void;
}

export default function Setup({ onUserCreated }: SetupProps) {
  const [name, setName] = useState("");
  const [partnerCode, setPartnerCode] = useState("");
  const [user, setUser] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const createUserMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await apiRequest("POST", "/api/users", { name });
      return response.json();
    },
    onSuccess: (newUser) => {
      setUser(newUser);
      localStorage.setItem('userId', newUser.id);
      toast({
        title: "Account created!",
        description: "Share your invitation code with your partner.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    },
  });

  const connectPartnerMutation = useMutation({
    mutationFn: async (invitationCode: string) => {
      const response = await apiRequest("POST", `/api/users/${user.id}/connect`, {
        invitationCode,
      });
      return response.json();
    },
    onSuccess: () => {
      onUserCreated(user.id);
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

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      createUserMutation.mutate(name.trim());
    }
  };

  const handleConnectPartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (partnerCode.trim()) {
      connectPartnerMutation.mutate(partnerCode.trim().toUpperCase());
    }
  };

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

  const skipForNow = () => {
    if (user) {
      onUserCreated(user.id);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="text-white text-xl" />
            </div>
            <h1 className="text-xl font-semibold mb-2">Welcome to Together</h1>
            <p className="text-neutral-600 text-sm">
              {!user ? "Let's get you set up" : "Connect with your partner"}
            </p>
          </div>

          {!user ? (
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={createUserMutation.isPending}
              >
                {createUserMutation.isPending ? "Creating..." : "Get Started"}
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
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

              <form onSubmit={handleConnectPartner} className="space-y-4">
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
                  disabled={connectPartnerMutation.isPending}
                >
                  {connectPartnerMutation.isPending ? "Connecting..." : "Connect"}
                </Button>
              </form>

              <div className="text-center">
                <Button variant="ghost" size="sm" onClick={skipForNow}>
                  Skip for now
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
