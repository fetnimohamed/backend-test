import { Request } from 'express';
import { User } from '@/userManagement/users/users.interface';

export interface DataStoredInToken {
  _id: string;
  firstName?: string;
  lastName?: string;
  matricule?: string;
  profile?: string;
  permissionLevel: number;
  updatedPassword: boolean;
  createDate?: Date;
  updateDate?: Date;
  deleteDate?: Date;
  status?: boolean;
}
export interface DataStoredInTokenOperateur {
  _id: string;
  firstName: string;
  lastName: string;
  matricule: string;
  processType: string;
  createDate: Date;
  updateDate: Date;
  deleteDate: Date;
  status: boolean;
  permissionLevel?: number;
}
export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}
