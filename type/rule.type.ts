
import { Collection } from "./collection.type"

export type CreateRuleInstructionDto = {
    type: string,
    quantity: number,
    collection_id: string,
    rule_id: string
}

export type RuleInstruction = {
    id: string,
    rule_id: string,
    type: string,
    collection_id: string,
    quantity: number,
    is_deleted: boolean,
    created_at?: string,
    updated_at?: string
}

export type FilterRule = {
    rule: RuleInstruction,
    collection: Collection
}