export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
}

export type SafeUser = Omit<User, 'passwordHash'>;

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}
