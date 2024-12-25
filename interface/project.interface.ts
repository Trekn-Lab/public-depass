import { IRule } from "./rule.interface";
import { IUserMember } from "./user.interface";

export enum BotStatusEnum {
  NOT_INSTALLED = "NOT_INSTALLED",
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export interface IProject {
  id: string;
  user_created: string;
  name: string;
  description: string;
  avatar: string;
  bot_status: BotStatusEnum;
  guild_id?: string;
  guild_name?: string;
  guild_members_verified?: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  members: IUserMember[];
  rules: IRule[];
}
