import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Settings, Wifi, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import PartnerStatusCard from "@/components/partner-status-card";
import StatusButtons from "@/components/status-buttons";
import StatusHistory from "@/components/status-history";
import CustomStatusModal from "@/components/custom-status-modal";
import InvitationModal from "@/components/invitation-modal";
import ProfileSettingsModal from "@/components/profile-settings-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useWebSocket from "@/hooks/use-websocket";

interface HomeProps {
  userId: string;
  onUserNotFound: () => void;
}

export default function Home({ userId, onUserNotFound }: HomeProps) {
  const [isCustomStatusOpen, setIsCustomStatusOpen] = useState(false);
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch user data
  const { data: user, error: userError } = useQuery({
    queryKey: ["/api/users", userId],
    enabled: !!userId,
    retry: false,
  });

  // Handle user not found
  useEffect(() => {
    if (userError && userError.message.includes("404")) {
      onUserNotFound();
    }
  }, [userError, onUserNotFound]);

  // Fetch partner data with current status
  const { data: partner, refetch: refetchPartner } = useQuery({
    queryKey: ["/api/users", userId, "partner"],
    enabled: !!user?.partnerId,
  });

  // Fetch user's current status
  const { data: currentStatus, refetch: refetchStatus } = useQuery({
    queryKey: ["/api/users", userId, "status"],
    enabled: !!userId,
  });

  // Setup WebSocket connection
  useWebSocket(userId, {
    onStatusUpdate: () => {
      refetchPartner();
      refetchStatus();
      // Also invalidate activity cache to refresh timeline
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "activity"] });
    },
  });

  const hasPartner = !!user?.partnerId;

  const handleLogout = () => {
    localStorage.removeItem("userId");
    window.location.href = "/";
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl relative overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-lg font-medium text-gray-900">Together</h1>
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${hasPartner ? "bg-green-500" : "bg-amber-500"}`}
              />
              <span className="text-sm text-gray-600">
                {hasPartner && partner ? partner.name : "Not connected"}
              </span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 rounded-full p-0"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={user?.profilePicture || ""} 
                    alt={user?.name || ""}
                  />
                  <AvatarFallback className="text-xs">
                    {user?.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setIsProfileSettingsOpen(true)}>
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsInvitationOpen(true)}>
                <Settings className="mr-2 h-4 w-4" />
                Partner Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-24">
        {hasPartner && partner ? (
          <PartnerStatusCard partner={partner} />
        ) : (
          <div className="p-6">
            <div className="bg-gradient-to-br from-neutral-50 to-white rounded-2xl p-8 border border-neutral-200 shadow-sm text-center">
              <Wifi className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
              <h3 className="text-lg font-semibold mb-2">
                No Partner Connected
              </h3>
              <p className="text-neutral-600 mb-4">
                Connect with your partner to start sharing status updates.
              </p>
              <Button onClick={() => setIsInvitationOpen(true)}>
                Connect Partner
              </Button>
            </div>
          </div>
        )}

        <StatusButtons
          userId={userId}
          currentStatus={currentStatus}
          onCustomStatus={() => setIsCustomStatusOpen(true)}
          onStatusChange={refetchStatus}
        />

        <StatusHistory userId={userId} />
      </main>

      {/* Modals */}
      <CustomStatusModal
        isOpen={isCustomStatusOpen}
        onClose={() => setIsCustomStatusOpen(false)}
        userId={userId}
        onStatusCreated={refetchStatus}
      />

      <InvitationModal
        isOpen={isInvitationOpen}
        onClose={() => setIsInvitationOpen(false)}
        user={user}
      />

      {user && (
        <ProfileSettingsModal
          isOpen={isProfileSettingsOpen}
          onClose={() => setIsProfileSettingsOpen(false)}
          user={user}
        />
      )}
    </div>
  );
}
