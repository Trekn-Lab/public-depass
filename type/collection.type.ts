export type Collection = {
    id: string,
    project_id: string,
    user_created: string,
    type: string,
    name: string,
    icon: string,
    contract_address: string[],
    is_common: boolean,
    is_deleted: boolean,
    created_at?: string,
    updated_at?: string
}
