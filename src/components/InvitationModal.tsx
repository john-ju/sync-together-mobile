import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Modal, Portal, Text, TextInput, Button, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';

interface InvitationModalProps {
  visible: boolean;
  onDismiss: () => void;
  user?: any;
}

export default function InvitationModal({
  visible,
  onDismiss,
  user,
}: InvitationModalProps) {
  const [partnerCode, setPartnerCode] = useState('');
  const queryClient = useQueryClient();

  const connectPartnerMutation = useMutation({
    mutationFn: async (invitationCode: string) => {
      const response = await fetch(`/api/users/${user.id}/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationCode }),
      });
      if (!response.ok) {
        throw new Error('Invalid invitation code');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', user.id] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', user.id, 'partner'] });
      onDismiss();
      setPartnerCode('');
      Alert.alert('Success', "You're now connected with your partner!");
    },
    onError: () => {
      Alert.alert('Error', 'Invalid invitation code. Please try again.');
    },
  });

  const copyInvitationCode = async () => {
    if (user?.invitationCode) {
      await Clipboard.setStringAsync(user.invitationCode);
      Alert.alert('Copied!', 'Invitation code copied to clipboard.');
    }
  };

  const handleConnect = () => {
    if (partnerCode.trim()) {
      connectPartnerMutation.mutate(partnerCode.trim().toUpperCase());
    }
  };

  const handleClose = () => {
    setPartnerCode('');
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
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons name="heart" size={32} color="#fff" />
              </View>
              <Text variant="headlineSmall" style={styles.title}>
                Connect with Your Partner
              </Text>
              <Text variant="bodyMedium" style={styles.subtitle}>
                Share your invitation code or enter theirs to get started
              </Text>
            </View>

            <View style={styles.content}>
              {user?.invitationCode && (
                <>
                  <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                      Your Invitation Code
                    </Text>
                    <View style={styles.codeContainer}>
                      <TextInput
                        value={user.invitationCode}
                        editable={false}
                        style={[styles.input, styles.codeInput]}
                      />
                      <Button
                        mode="outlined"
                        onPress={copyInvitationCode}
                        style={styles.copyButton}
                        icon="content-copy"
                      >
                        Copy
                      </Button>
                    </View>
                    <Text variant="bodySmall" style={styles.helpText}>
                      Share this code with your partner
                    </Text>
                  </View>

                  <View style={styles.divider}>
                    <Text variant="bodyMedium" style={styles.dividerText}>
                      or
                    </Text>
                  </View>
                </>
              )}

              <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Enter Partner's Code
                </Text>
                <TextInput
                  placeholder="Enter code here"
                  value={partnerCode}
                  onChangeText={(text) => setPartnerCode(text.toUpperCase())}
                  style={[styles.input, styles.codeInput]}
                  autoCapitalize="characters"
                />
                <Button
                  mode="contained"
                  onPress={handleConnect}
                  loading={connectPartnerMutation.isPending}
                  disabled={connectPartnerMutation.isPending || !partnerCode.trim()}
                  style={styles.connectButton}
                >
                  {connectPartnerMutation.isPending ? 'Connecting...' : 'Connect'}
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
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
  },
  content: {
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  codeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    backgroundColor: 'transparent',
  },
  codeInput: {
    flex: 1,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  copyButton: {
    alignSelf: 'center',
  },
  helpText: {
    color: '#666',
    textAlign: 'center',
  },
  divider: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  dividerText: {
    color: '#999',
  },
  connectButton: {
    borderRadius: 8,
  },
});