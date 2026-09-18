import bcrypt from 'bcryptjs';
import type { User, SafeUser, UserRole } from '../types/auth.types.js';

// In-memory data store for users
const users: Map<string, User> = new Map();

export class UserModel {
  static async create(userData: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
  }): Promise<SafeUser> {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userData.password, salt);

    const user: User = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      passwordHash,
      role: userData.role || 'patient',
      createdAt: new Date(),
    };

    users.set(user.id, user);

    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.toLowerCase().trim();
    for (const user of users.values()) {
      if (user.email === normalizedEmail) {
        return user;
      }
    }
    return null;
  }

  static async findById(id: string): Promise<SafeUser | null> {
    const user = users.get(id);
    if (!user) return null;
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  static async comparePassword(plainPassword: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, passwordHash);
  }

  static toSafeUser(user: User): SafeUser {
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }
}
