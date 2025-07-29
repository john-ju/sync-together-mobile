import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { getStatusIcon } from "@/lib/status-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfilePictureModal from "@/components/profile-picture-modal";

interface PartnerStatusCardProps {
  partner: {
    id: string;
    name: string;
    profilePicture?: string;
    currentStatus?: {
      type: string;
      title: string;
      message?: string;
      icon?: string;
      color: string;
      createdAt?: string;
    };
  };
}

export default function PartnerStatusCard({ partner }: PartnerStatusCardProps) {
  const status = partner.currentStatus;
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  if (!status) {
    return (
      <section className="px-4 py-3">
        <div className="bg-gradient-to-br from-neutral-50 to-white rounded-xl p-4 border border-neutral-200 shadow-sm">
          <div className="flex items-center space-x-3">
            <Avatar 
              className="w-12 h-12 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
              onClick={() => setIsProfileModalOpen(true)}
            >
              <AvatarImage 
                src={partner.profilePicture || ""} 
                alt={partner.name}
              />
              <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary to-purple text-white">
                {partner.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{partner.name}</h2>
              <p className="text-neutral-500 text-sm">No status available</p>
            </div>
          </div>
        </div>
        
        <ProfilePictureModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          partner={partner}
        />
      </section>
    );
  }

  const Icon = getStatusIcon(status.icon || status.type);
  const colorClass = `text-${status.color}`;
  const bgColorClass = `bg-${status.color}/10`;
  const timeAgo = status.createdAt 
    ? formatDistanceToNow(new Date(status.createdAt), { addSuffix: true })
    : 'Just now';

  return (
    <section className="px-4 py-3">
      <div className="bg-gradient-to-br from-neutral-50 to-white rounded-xl p-4 border border-neutral-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-3">
          <Avatar 
            className="w-12 h-12 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
            onClick={() => setIsProfileModalOpen(true)}
          >
            <AvatarImage 
              src={partner.profilePicture || ""} 
              alt={partner.name}
            />
            <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary to-purple text-white">
              {partner.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{partner.name}</h2>
            <p className="text-neutral-500 text-sm">Updated {timeAgo}</p>
          </div>
        </div>

        <div className="text-center py-4">
          <div className={`w-16 h-16 mx-auto mb-3 ${bgColorClass} rounded-full flex items-center justify-center`}>
            <Icon className={`text-2xl ${colorClass}`} />
          </div>
          <h3 className="text-xl font-semibold mb-1">{status.title}</h3>
          {status.message && (
            <p className="text-neutral-600 text-sm mb-2">{status.message}</p>
          )}
          <div className={`inline-flex items-center space-x-2 ${bgColorClass} ${colorClass} px-2 py-1 rounded-full text-xs`}>
            <div className={`w-1.5 h-1.5 bg-${status.color} rounded-full animate-pulse-soft`} />
            <span>Active for {timeAgo.replace('ago', '').trim()}</span>
          </div>
        </div>
      </div>
      
      <ProfilePictureModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        partner={partner}
      />
    </section>
  );
}
