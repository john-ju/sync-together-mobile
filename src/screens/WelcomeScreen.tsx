import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface WelcomeScreenProps {
  navigation: any;
}

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.iconContainer}>
              <Ionicons name="heart" size={48} color="#fff" />
            </View>
            <Text variant="headlineLarge" style={styles.title}>
              Partner Status Tracker
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Share your status with your partner in real-time
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <Surface style={styles.featureCard}>
              <View style={styles.featureContent}>
                <Ionicons name="people" size={24} color="#4CAF50" />
                <View style={styles.featureText}>
                  <Text variant="titleMedium">Connect with Partner</Text>
                  <Text variant="bodySmall" style={styles.featureDescription}>
                    Link accounts using invitation codes
                  </Text>
                </View>
              </View>
            </Surface>

            <Surface style={styles.featureCard}>
              <View style={styles.featureContent}>
                <Ionicons name="flash" size={24} color="#FF9800" />
                <View style={styles.featureText}>
                  <Text variant="titleMedium">Real-time Updates</Text>
                  <Text variant="bodySmall" style={styles.featureDescription}>
                    See status changes instantly
                  </Text>
                </View>
              </View>
            </Surface>
          </View>

          {/* Authentication Options */}
          <Card style={styles.authCard}>
            <Card.Content>
              <Text variant="headlineSmall" style={styles.authTitle}>
                Get Started
              </Text>
              <Text variant="bodyMedium" style={styles.authDescription}>
                Create an account to start tracking with your partner
              </Text>
              
              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  onPress={() => navigation.navigate('Register')}
                  style={styles.primaryButton}
                >
                  Create Account
                </Button>
                
                <Text variant="bodySmall" style={styles.loginText}>
                  Already have an account?
                </Text>
                
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate('Login')}
                  style={styles.secondaryButton}
                >
                  Sign In
                </Button>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featureCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  featureText: {
    marginLeft: 16,
    flex: 1,
  },
  featureDescription: {
    color: '#666',
    marginTop: 4,
  },
  authCard: {
    borderRadius: 16,
    elevation: 4,
  },
  authTitle: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  authDescription: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  buttonContainer: {
    gap: 12,
  },
  primaryButton: {
    borderRadius: 8,
  },
  loginText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
  },
  secondaryButton: {
    borderRadius: 8,
    marginTop: 8,
  },
});