export interface Icons {
    statusCode: number,
    data: Icon[]
}

export interface SetupType {
    statusCode: number,
    data: { id: number, name: string }[]
}

export interface Icon {
    id: number,
    name: string,
    icon_image?: string,
    category_name?: string,
    last_updated: Date
}