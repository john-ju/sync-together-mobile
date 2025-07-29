import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Modal, Portal, Text, TextInput, Button, Card, Chip } from 'react-native-paper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';

interface CustomStatusModalProps {
  visible: boolean;
  onDismiss: () => void;
  userId: string;
  onStatusCreated: () => void;
}

const iconOptions = [
  { name: 'User', icon: 'person', value: 'user' },
  { name: 'Coffee', icon: 'cafe', value: 'coffee' },
  { name: 'Work', icon: 'briefcase', value: 'briefcase' },
  { name: 'Sleep', icon: 'moon', value: 'moon' },
  { name: 'Heart', icon: 'heart', value: 'heart' },
  { name: 'Happy', icon: 'happy', value: 'smile' },
  { name: 'Energy', icon: 'flash', value: 'zap' },
  { name: 'Star', icon: 'star', value: 'star' },
  { name: 'Music', icon: 'musical-notes', value: 'music' },
  { name: 'Book', icon: 'book', value: 'book' },
  { name: 'Car', icon: 'car', value: 'car' },
  { name: 'Plane', icon: 'airplane', value: 'plane' },
];

export default function CustomStatusModal({
  visible,
  onDismiss,
  userId,
  onStatusCreated,
}: CustomStatusModalProps) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('user');
  const [expiration, setExpiration] = useState('never');
  const queryClient = useQueryClient();

  const createStatusMutation = useMutation({
    mutationFn: async () => {
      let expiresAt = null;
      if (expiration !== 'never') {
        const minutes = parseInt(expiration);
        expiresAt = new Date(Date.now() + minutes * 60 * 1000);
      }

      const response = await fetch('/api/statuses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          type: 'custom',
          title: title.trim(),
          message: message.trim() || null,
          icon: selectedIcon,
          color: 'info',
          expiresAt,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create status');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'activity'] });
      onStatusCreated();
      handleClose();
      Alert.alert('Success', 'Your custom status has been set!');
    },
    onError: () => {
      Alert.alert('Error', 'Failed to set custom status. Please try again.');
    },
  });

  const handleSubmit = () => {
    if (title.trim()) {
      createStatusMutation.mutate();
    }
  };

  const handleClose = () => {
    setTitle('');
    setMessage('');
    setSelectedIcon('user');
    setExpiration('never');
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleClose}
        contentContainerStyle={styles.modal}
      >
        <Card>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              Custom Status
            </Text>

            <View style={styles.form}>
              <TextInput
                label="Status Title"
                placeholder="What are you up to?"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
              />

              <View style={styles.iconSection}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Choose an icon
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.iconGrid}>
                    {iconOptions.map((option) => (
                      <Chip
                        key={option.value}
                        selected={selectedIcon === option.value}
                        onPress={() => setSelectedIcon(option.value)}
                        style={styles.iconChip}
                      >
                        {option.name}
                      </Chip>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <TextInput
                label="Message (Optional)"
                placeholder="Add more details..."
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={3}
                style={styles.input}
              />

              <View style={styles.expirationSection}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Auto-expire after
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.expirationOptions}>
                    {[
                      { label: 'Never', value: 'never' },
                      { label: '15 min', value: '15' },
                      { label: '30 min', value: '30' },
                      { label: '1 hour', value: '60' },
                      { label: '2 hours', value: '120' },
                      { label: '4 hours', value: '240' },
                    ].map((option) => (
                      <Chip
                        key={option.value}
                        selected={expiration === option.value}
                        onPress={() => setExpiration(option.value)}
                        style={styles.expirationChip}
                      >
                        {option.label}
                      </Chip>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View style={styles.buttons}>
                <Button
                  mode="outlined"
                  onPress={handleClose}
                  style={styles.button}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  loading={createStatusMutation.isPending}
                  disabled={createStatusMutation.isPending || !title.trim()}
                  style={styles.button}
                >
                  Set Status
                </Button>
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
    marginBottom: 24,
    fontWeight: 'bold',
  },
  form: {
    gap: 20,
  },
  input: {
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: '600',
  },
  iconSection: {
    marginVertical: 8,
  },
  iconGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  iconChip: {
    marginRight: 8,
  },
  expirationSection: {
    marginVertical: 8,
  },
  expirationOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  expirationChip: {
    marginRight: 8,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
    borderRadius: 8,
  },
});