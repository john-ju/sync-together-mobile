import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfilePictureUpload from "./profile-picture-upload";
import { type User } from "@shared/schema";

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export default function ProfileSettingsModal({ isOpen, onClose, user }: ProfileSettingsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="picture" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="picture">Profile Picture</TabsTrigger>
          </TabsList>
          
          <TabsContent value="picture" className="mt-4">
            <ProfilePictureUpload user={user} onClose={onClose} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}