import { type User, type InsertUser, type Status, type InsertStatus, users, statuses } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByInvitationCode(code: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Status operations
  getStatus(id: string): Promise<Status | undefined>;
  getUserStatuses(userId: string): Promise<Status[]>;
  getActiveUserStatus(userId: string): Promise<Status | undefined>;
  createStatus(status: InsertStatus): Promise<Status>;
  updateStatus(id: string, updates: Partial<Status>): Promise<Status | undefined>;
  deactivateUserStatuses(userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByInvitationCode(code: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.invitationCode, code));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getStatus(id: string): Promise<Status | undefined> {
    const [status] = await db.select().from(statuses).where(eq(statuses.id, id));
    return status || undefined;
  }

  async getUserStatuses(userId: string): Promise<Status[]> {
    return await db
      .select()
      .from(statuses)
      .where(eq(statuses.userId, userId))
      .orderBy(desc(statuses.createdAt));
  }

  async getActiveUserStatus(userId: string): Promise<Status | undefined> {
    const [status] = await db
      .select()
      .from(statuses)
      .where(and(eq(statuses.userId, userId), eq(statuses.isActive, true)));
    return status || undefined;
  }

  async createStatus(insertStatus: InsertStatus): Promise<Status> {
    const [status] = await db
      .insert(statuses)
      .values(insertStatus)
      .returning();
    return status;
  }

  async updateStatus(id: string, updates: Partial<Status>): Promise<Status | undefined> {
    const [status] = await db
      .update(statuses)
      .set(updates)
      .where(eq(statuses.id, id))
      .returning();
    return status || undefined;
  }

  async deactivateUserStatuses(userId: string): Promise<void> {
    await db
      .update(statuses)
      .set({ isActive: false })
      .where(and(eq(statuses.userId, userId), eq(statuses.isActive, true)));
  }
}

export const storage = new DatabaseStorage();
