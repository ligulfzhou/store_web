export interface ListResult<T> {
    list: T[]
    total: number
}

export interface ListReponse<T> {
    code: number
    msg: string
    data: ListResult<T>
}

export interface DataResponse<T> {
    code: number
    msg: string
    data: T
}

export interface EmptyResponse {
    code: number
    msg: string
}
