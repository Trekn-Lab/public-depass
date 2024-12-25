import { ICollection } from "./collection.interface";

export enum InstructionEnum {
  NFT = "NFT",
  TOKEN = "TOKEN",
  WHITELIST = "WHITELIST",
}

export interface IInstruction {
  id: string;
  rule_id: string;
  type: InstructionEnum;
  collection_id: string;
  quantity: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  collection: ICollection;
}
