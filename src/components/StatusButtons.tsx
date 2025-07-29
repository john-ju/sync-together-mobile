import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { statusTypes } from '../../shared/schema';
import { getStatusIcon } from '../utils/statusIcons';

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
  onStatusChange,
}: StatusButtonsProps) {
  const queryClient = useQueryClient();

  const setStatusMutation = useMutation({
    mutationFn: async (statusType: keyof typeof statusTypes) => {
      const statusData = statusTypes[statusType];
      const response = await fetch('/api/statuses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          type: statusType,
          title: statusData.title,
          message: statusData.message,
          icon: statusData.icon,
          color: statusData.color,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      return response.json();
    },
    onSuccess: (newStatus) => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'activity'] });
      onStatusChange();
      Alert.alert('Status Updated', `You're now ${newStatus.title.toLowerCase()}.`);
    },
    onError: () => {
      Alert.alert('Error', 'Failed to update status. Please try again.');
    },
  });

  const handleSetStatus = (statusType: keyof typeof statusTypes) => {
    setStatusMutation.mutate(statusType);
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>
        Your Status
      </Text>

      {/* Current Status */}
      {currentStatus && (
        <Card style={styles.currentStatusCard}>
          <Card.Content>
            <View style={styles.currentStatus}>
              <View style={[
                styles.currentStatusIcon,
                { backgroundColor: getStatusColor(currentStatus.color, 0.1) }
              ]}>
                {(() => {
                  const IconComponent = getStatusIcon(currentStatus.icon || currentStatus.type);
                  return <IconComponent size={24} color={getStatusColor(currentStatus.color)} />;
                })()}
              </View>
              <View style={styles.currentStatusText}>
                <Text variant="titleMedium">{currentStatus.title}</Text>
                {currentStatus.message && (
                  <Text variant="bodySmall" style={styles.currentStatusMessage}>
                    {currentStatus.message}
                  </Text>
                )}
              </View>
              <TouchableOpacity onPress={onCustomStatus} style={styles.editButton}>
                <Ionicons name="pencil" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Quick Status Buttons */}
      <View style={styles.statusGrid}>
        {Object.entries(statusTypes).map(([key, status]) => {
          const IconComponent = getStatusIcon(key);
          const isActive = currentStatus?.type === key;

          return (
            <TouchableOpacity
              key={key}
              onPress={() => handleSetStatus(key as keyof typeof statusTypes)}
              disabled={setStatusMutation.isPending}
              style={[
                styles.statusButton,
                isActive && { borderColor: getStatusColor(status.color), borderWidth: 2 }
              ]}
            >
              <View style={[
                styles.statusButtonIcon,
                { backgroundColor: getStatusColor(status.color, 0.1) }
              ]}>
                <IconComponent size={20} color={getStatusColor(status.color)} />
              </View>
              <Text variant="titleSmall" style={styles.statusButtonTitle}>
                {status.title}
              </Text>
              <Text variant="bodySmall" style={styles.statusButtonMessage}>
                {status.message}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Custom Status Button */}
      <Button
        mode="outlined"
        onPress={onCustomStatus}
        disabled={setStatusMutation.isPending}
        style={styles.customButton}
        icon="plus"
      >
        Custom Status
      </Button>
    </View>
  );
}

function getStatusColor(color: string, opacity = 1): string {
  const colors: { [key: string]: string } = {
    success: opacity === 1 ? '#4CAF50' : `rgba(76, 175, 80, ${opacity})`,
    danger: opacity === 1 ? '#f44336' : `rgba(244, 67, 54, ${opacity})`,
    info: opacity === 1 ? '#2196F3' : `rgba(33, 150, 243, ${opacity})`,
    purple: opacity === 1 ? '#9C27B0' : `rgba(156, 39, 176, ${opacity})`,
    warning: opacity === 1 ? '#FF9800' : `rgba(255, 152, 0, ${opacity})`,
  };
  return colors[color] || colors.info;
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  currentStatusCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 1,
  },
  currentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentStatusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentStatusText: {
    flex: 1,
    marginLeft: 12,
  },
  currentStatusMessage: {
    color: '#666',
    marginTop: 2,
  },
  editButton: {
    padding: 8,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statusButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 1,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  statusButtonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statusButtonTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  statusButtonMessage: {
    color: '#666',
    textAlign: 'center',
  },
  customButton: {
    borderRadius: 8,
  },
});