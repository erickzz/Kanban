export type CardProperties = {
    id:number,
    title: string;
    description: string;
    color: string;
}

export type CardItems = {
    id:number,
    cardId: number,
    value:string
}