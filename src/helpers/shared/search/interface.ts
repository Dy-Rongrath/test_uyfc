export interface Item {
    id         : number
    title      : string
    uri        : string
    size       : number
    type       : 'file' | 'folder'
    creator    : { id: number, name: string, avatar: string }
    modified_at: Date
    menu       : string
}
