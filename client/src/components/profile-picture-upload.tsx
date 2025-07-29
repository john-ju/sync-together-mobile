import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { type User } from "@shared/schema";

interface ProfilePictureUploadProps {
  user: User;
  onClose?: () => void;
}

export default function ProfilePictureUpload({ user, onClose }: ProfilePictureUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateProfilePicture = useMutation({
    mutationFn: async (imageData: string) => {
      const response = await fetch(`/api/users/${user.id}/profile-picture`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profilePicture: imageData }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update profile picture");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", user.id] });
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been successfully updated.",
      });
      setSelectedImage(null);
      onClose?.();
    },
    onError: (error: any) => {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to update profile picture",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (!selectedImage) return;
    setIsUploading(true);
    updateProfilePicture.mutate(selectedImage);
  };

  const handleRemovePicture = async () => {
    setIsUploading(true);
    updateProfilePicture.mutate("");
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Profile Picture</h3>
        <p className="text-sm text-gray-600">
          Upload a photo to personalize your profile
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        {/* Current/Preview Avatar */}
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage 
              src={selectedImage || user.profilePicture || ""} 
              alt={user.name}
            />
            <AvatarFallback className="text-lg">
              {user.name.split(" ").map(n => n[0]).join("").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          {/* Camera overlay button */}
          <Button
            size="icon"
            variant="secondary"
            className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Action buttons */}
        <div className="flex flex-col w-full space-y-2">
          {selectedImage ? (
            <div className="flex space-x-2">
              <Button 
                onClick={handleUpload}
                disabled={isUploading}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Uploading..." : "Save Photo"}
              </Button>
              <Button 
                variant="outline"
                onClick={() => setSelectedImage(null)}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <Button 
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Photo
              </Button>
              
              {user.profilePicture && (
                <Button 
                  variant="ghost"
                  onClick={handleRemovePicture}
                  disabled={isUploading}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove Photo
                </Button>
              )}
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 text-center">
          Supported formats: JPG, PNG, GIF (max 10MB)
        </p>
      </div>
    </div>
  );
}