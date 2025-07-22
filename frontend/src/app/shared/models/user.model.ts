// superdupermart/frontend/src/app/shared/models/user.model.ts
export interface LoginRequest {
  username?: string;
  password?: string;
}

export interface RegistrationRequest {
  username?: string;
  email?: string;
  password?: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  role: string;
}

// CHANGE THIS FROM INTERFACE TO ENUM
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}