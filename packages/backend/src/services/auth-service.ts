import { db } from '../db/index';
import { users, userProgress } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import * as jose from 'jose';
import type { SignupRequest, LoginRequest } from '@mcat-app/shared';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this'
);

export class AuthService {
  static async signup(data: SignupRequest) {
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Create user
    const [user] = await db
      .insert(users)
      .values({
        email: data.email,
        passwordHash,
        name: data.name,
      })
      .returning();

    // Initialize user progress
    await db.insert(userProgress).values({
      userId: user.id,
    });

    // Generate JWT token
    const token = await new jose.SignJWT({ userId: user.id, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .setIssuedAt()
      .sign(JWT_SECRET);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  }

  static async login(data: LoginRequest) {
    // Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValid = await bcrypt.compare(data.password, user.passwordHash);

    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = await new jose.SignJWT({ userId: user.id, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .setIssuedAt()
      .sign(JWT_SECRET);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  }

  static async verifyToken(token: string) {
    try {
      const { payload } = await jose.jwtVerify(token, JWT_SECRET);
      return payload as { userId: number; email: string };
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  static async getUserById(userId: number) {
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
