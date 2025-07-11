export default interface SetupUser {
    id: number,
    avatar: string,
    kh_name: string,
    position: {
        id: number,
        name: string,
        abbre: string
    },
    title: {
        id: number,
        name: string,
        abbre: string
    }
}