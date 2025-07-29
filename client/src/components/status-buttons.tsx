import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { statusTypes } from "@shared/schema";
import { getStatusIcon } from "@/lib/status-icons";

interface StatusButtonsProps {
  userId: string;
  currentStatus?: any;
  onCustomStatus: () => void;
  onStatusChange: () => void;
}

export default function StatusButtons({ 
  userId, 
  currentStatus, 
  onCustomStatus, 
  onStatusChange 
}: StatusButtonsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const setStatusMutation = useMutation({
    mutationFn: async (statusType: keyof typeof statusTypes) => {
      const statusData = statusTypes[statusType];
      const response = await apiRequest("POST", "/api/statuses", {
        userId,
        type: statusType,
        title: statusData.title,
        message: statusData.message,
        icon: statusData.icon,
        color: statusData.color,
      });
      return response.json();
    },
    onSuccess: (newStatus) => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "activity"] });
      onStatusChange();
      toast({
        title: "Status updated!",
        description: `You're now ${newStatus.title.toLowerCase()}.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSetStatus = (statusType: keyof typeof statusTypes) => {
    setStatusMutation.mutate(statusType);
  };

  return (
    <section className="px-6 mb-8">
      <h3 className="text-lg font-semibold mb-4">Your Status</h3>

      {/* Current Status */}
      {currentStatus && (
        <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-sm mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 bg-${currentStatus.color}/10 rounded-full flex items-center justify-center`}>
              {(() => {
                const iconValue = currentStatus.icon || currentStatus.type;
                const Icon = getStatusIcon(iconValue);
                return <Icon className={`text-${currentStatus.color} text-lg`} />;
              })()}
            </div>
            <div className="flex-1">
              <p className="font-medium">{currentStatus.title}</p>
              {currentStatus.message && (
                <p className="text-sm text-neutral-500">{currentStatus.message}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCustomStatus}
              className="text-neutral-400 hover:text-neutral-600"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Quick Status Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {Object.entries(statusTypes).map(([key, status]) => {
          const Icon = getStatusIcon(key);
          const isActive = currentStatus?.type === key;
          
          return (
            <button
              key={key}
              onClick={() => handleSetStatus(key as keyof typeof statusTypes)}
              disabled={setStatusMutation.isPending}
              className={`bg-white border border-neutral-200 rounded-xl p-4 hover:border-${status.color} hover:bg-${status.color}/5 transition-all duration-200 text-left group ${isActive ? `ring-2 ring-${status.color}` : ''}`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-${status.color}/10 group-hover:bg-${status.color}/20 rounded-full flex items-center justify-center transition-colors`}>
                  <Icon className={`text-${status.color}`} />
                </div>
                <div>
                  <p className="font-medium">{status.title}</p>
                  <p className="text-xs text-neutral-500">{status.message}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Status Button */}
      <Button
        variant="outline"
        onClick={onCustomStatus}
        className="w-full"
        disabled={setStatusMutation.isPending}
      >
        <Plus className="h-4 w-4 mr-2" />
        Custom Status
      </Button>
    </section>
  );
}
