import { IProject } from "./project.interface";

export interface UserInterface {
  id: string;
  telegram_id: string;
  address: string;
  points: number;
  name: string;
  username: string;
  avatar: string;
  is_blocked: boolean;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
  is_newUser: boolean;
  list_wallet: ListWallet[];
  socialAccounts: SocialAccount[];
  project: IProject;
}

export interface ListWallet {
  id: string;
  userId: string;
  name: string;
  address: string;
  walletName: string;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SocialAccount {
  id: string;
  userId: string;
  provider: string;
  socialId: string;
  username?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserMember {
  id: string;
  project_id: string;
  user_id: string;
  role: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}
