export type User = {
    id: number,
    email: string,
    name: string,
    is_admin: boolean
}

export type Task = {
    id: number
    title: string,
    description: string,
    creator: string
    assignee: string
}

