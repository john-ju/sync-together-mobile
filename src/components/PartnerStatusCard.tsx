import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Avatar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { getStatusIcon } from '../utils/statusIcons';

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

  if (!status) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Avatar.Text
              size={48}
              label={partner.name.charAt(0).toUpperCase()}
              style={styles.avatar}
            />
            <View style={styles.headerText}>
              <Text variant="headlineSmall">{partner.name}</Text>
              <Text variant="bodySmall" style={styles.subtitle}>
                No status available
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  }

  const IconComponent = getStatusIcon(status.icon || status.type);
  const timeAgo = status.createdAt
    ? formatDistanceToNow(new Date(status.createdAt), { addSuffix: true })
    : 'Just now';

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Avatar.Text
            size={48}
            label={partner.name.charAt(0).toUpperCase()}
            style={styles.avatar}
          />
          <View style={styles.headerText}>
            <Text variant="headlineSmall">{partner.name}</Text>
            <Text variant="bodySmall" style={styles.subtitle}>
              Updated {timeAgo}
            </Text>
          </View>
        </View>

        <View style={styles.statusContent}>
          <View style={[styles.iconContainer, { backgroundColor: getStatusColor(status.color, 0.1) }]}>
            <IconComponent size={32} color={getStatusColor(status.color)} />
          </View>
          <Text variant="headlineMedium" style={styles.statusTitle}>
            {status.title}
          </Text>
          {status.message && (
            <Text variant="bodyMedium" style={styles.statusMessage}>
              {status.message}
            </Text>
          )}
          <View style={[styles.activeIndicator, { backgroundColor: getStatusColor(status.color, 0.1) }]}>
            <View style={[styles.activeDot, { backgroundColor: getStatusColor(status.color) }]} />
            <Text variant="bodySmall" style={[styles.activeText, { color: getStatusColor(status.color) }]}>
              Active for {timeAgo.replace('ago', '').trim()}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
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
  card: {
    margin: 16,
    borderRadius: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    backgroundColor: '#667eea',
  },
  headerText: {
    marginLeft: 16,
    flex: 1,
  },
  subtitle: {
    color: '#666',
    marginTop: 4,
  },
  statusContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusMessage: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  activeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  activeText: {
    fontSize: 12,
    fontWeight: '500',
  },
});