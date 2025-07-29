# Partner Status Tracker - React Native

A React Native mobile application for couples to share their real-time status updates with each other.

## Features

- **Real-time Status Sharing**: Share your current status (free, busy, in meeting, sleeping, or custom) with your partner
- **Partner Connection**: Connect with your partner using unique invitation codes
- **Custom Statuses**: Create personalized status messages with custom icons and expiration times
- **Activity History**: View timeline of status changes for both you and your partner
- **Profile Management**: Upload profile pictures and manage account settings
- **Cross-platform**: Works on both iOS and Android devices

## Tech Stack

- **Frontend**: React Native with Expo
- **Navigation**: React Navigation
- **UI Components**: React Native Paper
- **State Management**: TanStack Query (React Query)
- **Backend**: Express.js with WebSocket support
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Username/password with secure storage

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- PostgreSQL database (or Neon serverless)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   DATABASE_URL=your_postgresql_connection_string
   ```

4. Run database migrations:
   ```bash
   npm run db:push
   ```

5. Start the backend server:
   ```bash
   npm run server:dev
   ```

6. Start the Expo development server:
   ```bash
   npm start
   ```

7. Use the Expo Go app on your phone to scan the QR code, or run on an emulator

## Project Structure

```
├── App.tsx                 # Main app component with navigation
├── src/
│   ├── screens/           # Screen components
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React contexts (Auth)
│   └── utils/             # Utility functions
├── server/                # Backend Express server
├── shared/                # Shared types and schemas
└── assets/                # App icons and images
```

## Development

- **Mobile Development**: `npm start` - Starts Expo development server
- **Backend Development**: `npm run server:dev` - Starts Express server with hot reload
- **Database**: `npm run db:push` - Push schema changes to database

## Building for Production

1. Build the backend:
   ```bash
   npm run server:build
   ```

2. Build the mobile app:
   ```bash
   expo build:android
   # or
   expo build:ios
   ```

## Features in Detail

### Authentication System
- Secure username/password authentication
- Account creation with unique invitation codes
- Persistent login with Expo SecureStore

### Real-time Communication
- WebSocket connections for instant status updates
- Automatic reconnection handling
- Live partner status synchronization

### Status Management
- Quick status buttons (Free, Busy, Meeting, Sleeping)
- Custom status creation with icons and messages
- Optional status expiration times
- Activity history tracking

### Partner Connection
- Unique 8-character invitation codes
- Simple partner linking process
- Profile picture sharing
- Connection status indicators

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both iOS and Android
5. Submit a pull request

## License

MIT License - see LICENSE file for details