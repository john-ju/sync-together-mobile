import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertUserSchema, insertStatusSchema, statusTypes, loginSchema, registerSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";

interface WebSocketClient extends WebSocket {
  userId?: string;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // WebSocket server setup
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const clients = new Map<string, WebSocketClient>();

  wss.on('connection', (ws: WebSocketClient) => {
    console.log('WebSocket client connected');

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'auth' && message.userId) {
          ws.userId = message.userId;
          clients.set(message.userId, ws);
          console.log(`User ${message.userId} authenticated via WebSocket`);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      if (ws.userId) {
        clients.delete(ws.userId);
        console.log(`User ${ws.userId} disconnected`);
      }
    });
  });

  // Broadcast status update to partner
  const broadcastStatusUpdate = async (userId: string, status: any) => {
    const user = await storage.getUser(userId);
    if (user?.partnerId) {
      const partnerClient = clients.get(user.partnerId);
      if (partnerClient && partnerClient.readyState === WebSocket.OPEN) {
        partnerClient.send(JSON.stringify({
          type: 'statusUpdate',
          status,
          userId
        }));
      }
    }
  };

  // Generate unique invitation code
  const generateInvitationCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Register with username/password  
  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData = registerSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Generate unique invitation code
      let invitationCode;
      let existingCode;
      do {
        invitationCode = generateInvitationCode();
        existingCode = await storage.getUserByInvitationCode(invitationCode);
      } while (existingCode);

      const user = await storage.createUser({
        name: userData.name,
        username: userData.username,
        password: hashedPassword,
        invitationCode
      });

      // Create initial "free" status
      await storage.createStatus({
        userId: user.id,
        type: 'free',
        title: statusTypes.free.title,
        message: statusTypes.free.message,
        icon: statusTypes.free.icon,
        color: statusTypes.free.color,
        expiresAt: null,
        isActive: true
      });

      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Register error:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid request' });
    }
  });

  // Login with username/password
  app.post('/api/auth/login', async (req, res) => {
    try {
      const loginData = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(loginData.username);
      if (!user || !user.password) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      
      const isValidPassword = await bcrypt.compare(loginData.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Login error:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid request' });
    }
  });

  // Get user by ID
  app.get('/api/users/:id', async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Update user profile picture
  app.post('/api/users/:id/profile-picture', async (req, res) => {
    try {
      const { profilePicture } = z.object({ 
        profilePicture: z.string() 
      }).parse(req.body);
      
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const updatedUser = await storage.updateUser(req.params.id, { 
        profilePicture: profilePicture || null 
      });
      
      if (!updatedUser) {
        return res.status(500).json({ message: 'Failed to update profile picture' });
      }

      res.json(updatedUser);
    } catch (error) {
      console.error('Update profile picture error:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid request' });
    }
  });

  // Connect partners
  app.post('/api/users/:id/connect', async (req, res) => {
    try {
      const { invitationCode } = z.object({ invitationCode: z.string() }).parse(req.body);
      
      const user = await storage.getUser(req.params.id);
      const partner = await storage.getUserByInvitationCode(invitationCode);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      if (!partner) {
        return res.status(404).json({ message: 'Invalid invitation code' });
      }

      if (user.id === partner.id) {
        return res.status(400).json({ message: 'Cannot connect to yourself' });
      }

      // Update both users to be partners
      await storage.updateUser(user.id, { partnerId: partner.id });
      await storage.updateUser(partner.id, { partnerId: user.id });

      const updatedUser = await storage.getUser(user.id);
      res.json(updatedUser);
    } catch (error) {
      console.error('Connect partners error:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid request' });
    }
  });

  // Get partner info
  app.get('/api/users/:id/partner', async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user || !user.partnerId) {
        return res.status(404).json({ message: 'Partner not found' });
      }

      const partner = await storage.getUser(user.partnerId);
      if (!partner) {
        return res.status(404).json({ message: 'Partner not found' });
      }

      const partnerStatus = await storage.getActiveUserStatus(partner.id);
      
      res.json({
        ...partner,
        currentStatus: partnerStatus
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Create/update status
  app.post('/api/statuses', async (req, res) => {
    try {
      const statusData = insertStatusSchema.parse(req.body);
      
      // Deactivate previous statuses
      await storage.deactivateUserStatuses(statusData.userId);
      
      const status = await storage.createStatus({
        ...statusData,
        isActive: true
      });

      // Broadcast to partner
      await broadcastStatusUpdate(statusData.userId, status);

      res.json(status);
    } catch (error) {
      console.error('Create status error:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid request' });
    }
  });

  // Get user's active status
  app.get('/api/users/:id/status', async (req, res) => {
    try {
      const status = await storage.getActiveUserStatus(req.params.id);
      if (!status) {
        return res.status(404).json({ message: 'No active status found' });
      }
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Get user's status history
  app.get('/api/users/:id/statuses', async (req, res) => {
    try {
      const statuses = await storage.getUserStatuses(req.params.id);
      res.json(statuses);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Get combined activity (user + partner statuses)
  app.get('/api/users/:id/activity', async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const userStatuses = await storage.getUserStatuses(user.id);
      const partnerStatuses = user.partnerId 
        ? await storage.getUserStatuses(user.partnerId)
        : [];

      // Combine and sort by creation time
      const allActivity = [
        ...userStatuses.map(s => ({ ...s, isOwnStatus: true })),
        ...partnerStatuses.map(s => ({ ...s, isOwnStatus: false }))
      ].sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());

      res.json(allActivity);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  return httpServer;
}
