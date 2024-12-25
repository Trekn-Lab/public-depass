import { RuleInstruction } from "./rule.type"

export type ProjectRule = {
    id: string,
    project_id: string,
    condition: string,
    is_deleted: boolean,
    created_at?: string,
    updated_at?: string,
    instructions: RuleInstruction[]
}