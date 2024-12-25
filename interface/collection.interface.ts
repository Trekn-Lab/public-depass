import { InstructionEnum } from "./rule_instruction.interface";

export interface ICollection {
  id: string;
  project_id?: string;
  user_created: string;
  type: InstructionEnum;
  name: string;
  icon: string;
  default: boolean;
  white_list_file?: string;
  contract_address: string[];
  is_common: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}
