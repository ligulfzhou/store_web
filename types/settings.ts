
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

export interface GlobalSettings {
    id: number,
    units: string[],
    accounts: string[]
}

export interface CustomerTypeSettings {
    id: number,
    ty_pe: string,
    create_time: string
}

export interface UpdateCustomerTypeParams {
    id: number,
    ty_pe: string,
}
