export interface IRole {
  guild: string;
  icon?: string;
  unicodeEmoji?: string;
  id: string;
  name: string;
  color: number;
  hoist: boolean;
  rawPosition: number;
  permissions: string;
  managed: boolean;
  mentionable: boolean;
  flags: number;
  tags?: string[];
  createdTimestamp: number;
}
