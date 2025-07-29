import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Modal, Portal, Text, Button, Card, Avatar } from 'react-native-paper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { type User } from '../../shared/schema';

interface ProfileSettingsModalProps {
  visible: boolean;
  onDismiss: () => void;
  user: User;
}

export default function ProfileSettingsModal({
  visible,
  onDismiss,
  user,
}: ProfileSettingsModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const updateProfilePicture = useMutation({
    mutationFn: async (imageData: string) => {
      const response = await fetch(`/api/users/${user.id}/profile-picture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profilePicture: imageData }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile picture');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', user.id] });
      Alert.alert('Success', 'Your profile picture has been updated.');
      setSelectedImage(null);
      onDismiss();
    },
    onError: (error: any) => {
      Alert.alert('Upload Failed', error.message || 'Failed to update profile picture');
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const imageUri = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setSelectedImage(imageUri);
    }
  };

  const handleUpload = () => {
    if (!selectedImage) return;
    setIsUploading(true);
    updateProfilePicture.mutate(selectedImage);
  };

  const handleRemovePicture = async () => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove your profile picture?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setIsUploading(true);
            updateProfilePicture.mutate('');
          },
        },
      ]
    );
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modal}
      >
        <Card>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              Profile Settings
            </Text>

            <View style={styles.content}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Profile Picture
              </Text>
              <Text variant="bodySmall" style={styles.subtitle}>
                Upload a photo to personalize your profile
              </Text>

              <View style={styles.avatarSection}>
                <View style={styles.avatarContainer}>
                  {selectedImage || user.profilePicture ? (
                    <Avatar.Image
                      size={96}
                      source={{ uri: selectedImage || user.profilePicture || '' }}
                    />
                  ) : (
                    <Avatar.Text
                      size={96}
                      label={user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    />
                  )}
                  <Button
                    mode="contained"
                    onPress={pickImage}
                    disabled={isUploading}
                    style={styles.cameraButton}
                    icon="camera"
                    compact
                  />
                </View>

                <View style={styles.buttonContainer}>
                  {selectedImage ? (
                    <View style={styles.actionButtons}>
                      <Button
                        mode="contained"
                        onPress={handleUpload}
                        loading={isUploading}
                        disabled={isUploading}
                        style={styles.actionButton}
                        icon="upload"
                      >
                        Save Photo
                      </Button>
                      <Button
                        mode="outlined"
                        onPress={() => setSelectedImage(null)}
                        disabled={isUploading}
                        style={styles.actionButton}
                        icon="close"
                      >
                        Cancel
                      </Button>
                    </View>
                  ) : (
                    <View style={styles.actionButtons}>
                      <Button
                        mode="outlined"
                        onPress={pickImage}
                        disabled={isUploading}
                        style={styles.actionButton}
                        icon="image"
                      >
                        Choose Photo
                      </Button>
                      {user.profilePicture && (
                        <Button
                          mode="text"
                          onPress={handleRemovePicture}
                          disabled={isUploading}
                          textColor="#f44336"
                          icon="delete"
                        >
                          Remove Photo
                        </Button>
                      )}
                    </View>
                  )}
                </View>

                <Text variant="bodySmall" style={styles.helpText}>
                  Supported formats: JPG, PNG, GIF (max 10MB)
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 20,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 24,
  },
  content: {
    gap: 16,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  subtitle: {
    color: '#666',
  },
  avatarSection: {
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  cameraButton: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  buttonContainer: {
    width: '100%',
  },
  actionButtons: {
    gap: 12,
    alignItems: 'center',
  },
  actionButton: {
    minWidth: 120,
    borderRadius: 8,
  },
  helpText: {
    color: '#666',
    textAlign: 'center',
  },
});