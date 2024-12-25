import { Collection } from "./collection.type";
import { User } from "./user.type";

export type Project = {
  id: string;
  user_created: string;
  name: string;
  description: string;
  bot_status: string;
  guild_id: string;
  guild_name: string;
  guild_members_verified: boolean;
  is_deleted: boolean;
  created_at?: string;
  updated_at?: string;
  members: User[];
  rules: Rules[];
  avatar: string;
};

export type Rules = {
  id: string;
  project_id: string;
  assignee_role_id: string;
  guild_role_name: string;
  guild_role_color: string;
  guild_role_icon: string;
  is_deleted: boolean;
  created_at?: string;
  updated_at?: string;
  collection: Collection[];
  condition: string;
};
