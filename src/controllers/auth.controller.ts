import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { UserModel } from '../models/user.model.js';
import type { AuthenticatedRequest } from '../middlewares/auth.js';
import type { RegisterInput, LoginInput } from '../schemas/auth.schema.js';
import type { JwtPayload, SafeUser } from '../types/auth.types.js';

const generateToken = (user: SafeUser): string => {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN as any,
  });
};

export class AuthController {
  static async register(
    req: Request<{}, {}, RegisterInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, email, password, role } = req.body;

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        res.status(409).json({
          status: 'fail',
          message: 'An account with this email address already exists.',
        });
        return;
      }

      const user = await UserModel.create({ name, email, password, role });
      const token = generateToken(user);

      res.status(201).json({
        status: 'success',
        message: 'Account created successfully',
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(
    req: Request<{}, {}, LoginInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findByEmail(email);
      if (!user) {
        res.status(401).json({
          status: 'fail',
          message: 'Invalid email or password.',
        });
        return;
      }

      const isPasswordValid = await UserModel.comparePassword(password, user.passwordHash);
      if (!isPasswordValid) {
        res.status(401).json({
          status: 'fail',
          message: 'Invalid email or password.',
        });
        return;
      }

      const safeUser = UserModel.toSafeUser(user);
      const token = generateToken(safeUser);

      res.status(200).json({
        status: 'success',
        message: 'Logged in successfully',
        data: {
          user: safeUser,
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMe(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          status: 'fail',
          message: 'Not authenticated',
        });
        return;
      }

      const user = await UserModel.findById(req.user.userId);
      if (!user) {
        res.status(404).json({
          status: 'fail',
          message: 'User no longer exists',
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
