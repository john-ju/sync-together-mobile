import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Card, Avatar, Menu, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import PartnerStatusCard from '../components/PartnerStatusCard';
import StatusButtons from '../components/StatusButtons';
import StatusHistory from '../components/StatusHistory';
import CustomStatusModal from '../components/CustomStatusModal';
import InvitationModal from '../components/InvitationModal';
import ProfileSettingsModal from '../components/ProfileSettingsModal';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const [isCustomStatusOpen, setIsCustomStatusOpen] = useState(false);
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const queryClient = useQueryClient();

  // Fetch partner data with current status
  const { data: partner, refetch: refetchPartner } = useQuery({
    queryKey: ['/api/users', user?.id, 'partner'],
    enabled: !!user?.partnerId,
  });

  // Fetch user's current status
  const { data: currentStatus, refetch: refetchStatus } = useQuery({
    queryKey: ['/api/users', user?.id, 'status'],
    enabled: !!user?.id,
  });

  const hasPartner = !!user?.partnerId;

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            await logout();
          }
        },
      ]
    );
  };

  const handleStatusChange = () => {
    refetchStatus();
    refetchPartner();
    queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id, 'activity'] });
  };

  if (!user) return null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text variant="headlineSmall" style={styles.appTitle}>
            Together
          </Text>
          <View style={styles.connectionStatus}>
            <View style={[
              styles.statusDot, 
              { backgroundColor: hasPartner ? '#4CAF50' : '#FF9800' }
            ]} />
            <Text variant="bodySmall" style={styles.connectionText}>
              {hasPartner && partner ? partner.name : 'Not connected'}
            </Text>
          </View>
        </View>
        
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              onPress={() => setMenuVisible(true)}
              style={styles.avatarButton}
            >
              <Avatar.Text
                size={32}
                label={user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              />
            </Button>
          }
        >
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              setIsProfileSettingsOpen(true);
            }}
            title="Profile Settings"
            leadingIcon="account"
          />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              setIsInvitationOpen(true);
            }}
            title="Partner Settings"
            leadingIcon="account-group"
          />
          <Divider />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              handleLogout();
            }}
            title="Sign Out"
            leadingIcon="logout"
          />
        </Menu>
      </View>

      <ScrollView style={styles.content}>
        {/* Partner Status */}
        {hasPartner && partner ? (
          <PartnerStatusCard partner={partner} />
        ) : (
          <Card style={styles.noPartnerCard}>
            <Card.Content style={styles.noPartnerContent}>
              <Ionicons name="wifi" size={48} color="#ccc" />
              <Text variant="headlineSmall" style={styles.noPartnerTitle}>
                No Partner Connected
              </Text>
              <Text variant="bodyMedium" style={styles.noPartnerText}>
                Connect with your partner to start sharing status updates.
              </Text>
              <Button
                mode="contained"
                onPress={() => setIsInvitationOpen(true)}
                style={styles.connectButton}
              >
                Connect Partner
              </Button>
            </Card.Content>
          </Card>
        )}

        {/* Status Controls */}
        <StatusButtons
          userId={user.id}
          currentStatus={currentStatus}
          onCustomStatus={() => setIsCustomStatusOpen(true)}
          onStatusChange={handleStatusChange}
        />

        {/* Activity History */}
        <StatusHistory userId={user.id} />
      </ScrollView>

      {/* Modals */}
      <CustomStatusModal
        visible={isCustomStatusOpen}
        onDismiss={() => setIsCustomStatusOpen(false)}
        userId={user.id}
        onStatusCreated={handleStatusChange}
      />

      <InvitationModal
        visible={isInvitationOpen}
        onDismiss={() => setIsInvitationOpen(false)}
        user={user}
      />

      <ProfileSettingsModal
        visible={isProfileSettingsOpen}
        onDismiss={() => setIsProfileSettingsOpen(false)}
        user={user}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flex: 1,
  },
  appTitle: {
    fontWeight: 'bold',
    color: '#333',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  connectionText: {
    color: '#666',
  },
  avatarButton: {
    margin: 0,
    padding: 0,
  },
  content: {
    flex: 1,
  },
  noPartnerCard: {
    margin: 16,
    borderRadius: 16,
    elevation: 2,
  },
  noPartnerContent: {
    alignItems: 'center',
    padding: 32,
  },
  noPartnerTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  noPartnerText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  connectButton: {
    borderRadius: 8,
  },
});