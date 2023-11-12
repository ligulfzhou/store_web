
export interface ColorToValue {
    id: number,
    color: string,
    value: number
}

export interface UpdateColorValueParams {
    id: number,
    color: string,
    value: number|string
}
