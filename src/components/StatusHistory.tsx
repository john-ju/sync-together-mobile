import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { getStatusIcon } from '../utils/statusIcons';

interface StatusHistoryProps {
  userId: string;
}

export default function StatusHistory({ userId }: StatusHistoryProps) {
  const { data: activity = [] } = useQuery({
    queryKey: ['/api/users', userId, 'activity'],
    enabled: !!userId,
  });

  const todayActivity = activity.slice(0, 5); // Show only recent 5 activities

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Today's Activity
        </Text>
        <Button mode="text" compact>
          View All
        </Button>
      </View>

      {todayActivity.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Card.Content style={styles.emptyContent}>
            <Text variant="bodyMedium" style={styles.emptyText}>
              No activity yet today
            </Text>
          </Card.Content>
        </Card>
      ) : (
        <ScrollView style={styles.activityList}>
          {todayActivity.map((activity: any) => {
            const IconComponent = getStatusIcon(activity.icon || activity.type);
            const timeAgo = activity.createdAt
              ? formatDistanceToNow(new Date(activity.createdAt))
              : 'Just now';

            return (
              <Card key={activity.id} style={styles.activityCard}>
                <Card.Content>
                  <View style={styles.activityItem}>
                    <View style={[
                      styles.activityIcon,
                      { backgroundColor: getStatusColor(activity.color, 0.1) }
                    ]}>
                      <IconComponent size={16} color={getStatusColor(activity.color)} />
                    </View>
                    <View style={styles.activityContent}>
                      <View style={styles.activityHeader}>
                        <Text variant="titleSmall">
                          {activity.isOwnStatus ? 'You' : 'Partner'}
                        </Text>
                        <Text variant="bodySmall" style={styles.timeText}>
                          {timeAgo} ago
                        </Text>
                      </View>
                      <Text variant="bodySmall" style={styles.activityDescription}>
                        {activity.isOwnStatus ? 'Set status to' : 'Changed status to'}{' '}
                        {activity.title.toLowerCase()}
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            );
          })}
        </ScrollView>
      )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
  },
  emptyCard: {
    borderRadius: 12,
    elevation: 1,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    color: '#666',
  },
  activityList: {
    maxHeight: 300,
  },
  activityCard: {
    marginBottom: 8,
    borderRadius: 12,
    elevation: 1,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  timeText: {
    color: '#666',
  },
  activityDescription: {
    color: '#666',
  },
});