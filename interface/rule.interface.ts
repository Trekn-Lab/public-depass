import { IInstruction } from "./rule_instruction.interface";

export enum RuleCondition {
  ONLY = "ONLY",
  AND = "AND",
  OR = "OR",
}

export interface IRule {
  id: string;
  project_id: string;
  condition: RuleCondition;
  assignee_role_id: string;
  guild_role_name?: string;
  guild_role_color?: string;
  guild_role_icon?: string;
  is_deleted: boolean;
  members: IRuleMembers[];
  created_at: string;
  updated_at: string;
  instructions: IInstruction[];
}

export interface IRuleMembers {
  id: string;
  rule_id: string;
  discord_id: string;
  username: string;
  display_name: string;
  avatar: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}
