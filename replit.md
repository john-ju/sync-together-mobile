# Partner Status Tracker

## Overview

This is a real-time partner status tracking application built with React frontend and Express backend. The application allows couples or partners to share their current status (free, busy, in meeting, sleeping, or custom statuses) with each other in real-time. Partners can connect using invitation codes and see each other's status updates instantly through WebSocket connections.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Runtime**: Node.js with Express framework
- **Language**: TypeScript with ES modules
- **Real-time Communication**: WebSocket server for live status updates
- **API Design**: RESTful endpoints with JSON responses
- **Session Management**: In-memory storage (can be extended to database)

### Database Strategy
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: Defined in shared directory for type safety
- **Migration**: Drizzle Kit for database migrations
- **Current Storage**: PostgreSQL database implementation with Neon serverless
- **Connection**: Configured through DATABASE_URL environment variable

## Key Components

### Core Entities
1. **Users**: Profile management with invitation codes and partner connections
2. **Statuses**: Status types (free, busy, meeting, sleeping, custom) with timestamps and expiration
3. **Real-time Updates**: WebSocket connections for instant status synchronization

### Frontend Components
- **Setup Page**: User registration and partner connection
- **Home Dashboard**: Current status display and partner status monitoring
- **Status Controls**: Quick status buttons and custom status creation
- **Activity History**: Timeline of status changes
- **Modals**: Custom status creation and invitation management

### Backend Services
- **User Management**: Registration, authentication, and partner linking
- **Status Management**: CRUD operations for status updates
- **WebSocket Handler**: Real-time message broadcasting
- **Storage Interface**: Abstracted storage layer for future database integration

## Data Flow

### User Registration Flow
1. User enters name and receives unique invitation code
2. Partner uses invitation code to establish connection
3. Both users are linked and can see each other's statuses

### Status Update Flow
1. User selects or creates a status
2. Status is saved to storage with expiration if applicable
3. WebSocket broadcasts update to connected partner
4. Partner's UI updates in real-time
5. Activity history is updated for both users

### Real-time Communication
- WebSocket connection established on user authentication
- Status updates trigger immediate notifications to partner
- Connection management handles reconnection and cleanup

## External Dependencies

### Frontend Dependencies
- **UI Framework**: Radix UI primitives with shadcn/ui components
- **Form Handling**: React Hook Form with Zod validation
- **Date Utilities**: date-fns for time formatting
- **Icons**: Lucide React for consistent iconography

### Backend Dependencies
- **Database**: Neon serverless PostgreSQL (when configured)
- **WebSocket**: ws library for real-time communication
- **Validation**: Zod for runtime type checking
- **Development**: tsx for TypeScript execution

### Build and Development
- **Bundling**: Vite for frontend, esbuild for backend
- **Type Checking**: TypeScript with strict configuration
- **Development Server**: Vite dev server with HMR
- **CSS Processing**: PostCSS with Tailwind CSS

## Deployment Strategy

### Development Environment
- Vite development server with hot module replacement
- Express server with automatic restart on changes
- Integrated WebSocket server on same port
- In-memory storage for rapid development

### Production Build
1. Frontend: Vite builds optimized React bundle
2. Backend: esbuild creates single Node.js executable
3. Static files served from Express in production
4. Environment variables for database configuration

### Database Setup
- PostgreSQL database active with Neon serverless
- Schema deployed with users and statuses tables with username/password authentication
- Drizzle ORM handling all database operations
- WebSocket connections persist user sessions
- Real-time status updates stored and synchronized

## Authentication System
- Required account creation with username/password authentication for all users
- Multi-device login support for accessing accounts from different devices
- Secure password hashing with bcrypt
- Welcome page directing users to create accounts or sign in
- User account management with logout functionality
- Session persistence across device switches

### Key Configuration Files
- `drizzle.config.ts`: Database connection and migration setup
- `vite.config.ts`: Frontend build configuration with path aliases
- `tsconfig.json`: TypeScript configuration with shared types
- `tailwind.config.ts`: Styling system configuration

The application is designed to be easily deployable to platforms like Replit, with the database being the main external dependency for production use.