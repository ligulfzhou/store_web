import {host} from '@/utils/const'
import {DataResponse, EmptyResponse, ListReponse} from '@/types'


export async function commonListPost<T>(url: string, body: object): Promise<ListReponse<T>> {
    return _commonPost(url, body)
}

export async function commonDataPost<T>(url: string, body: object): Promise<DataResponse<T>> {
    return _commonPost(url, body)
}

export async function commonEmptyPost(url: string, body: object): Promise<EmptyResponse> {
    return _commonPost(url, body)
}

export async function _commonPost<T>(url: string, body: object): Promise<T> {
    let res = await fetch(`${host}${url}`, {
        headers: {
            "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify(body),
        credentials: 'include',
        mode: "cors"
    })
    return res.json()
}

export async function commonListGet<T>(url: string, body: object): Promise<ListReponse<T>> {
    return _commonGet(url, body)
}

export async function commonDataGet<T>(url: string, body: object): Promise<DataResponse<T>> {
    return _commonGet(url, body)
}

export async function commonEmptyGet(url: string, body: object): Promise<EmptyResponse> {
    return _commonGet(url, body)
}

export async function _commonGet<T>(url: string, params: Record<string, any>): Promise<T> {
    let res = await fetch(`${host}${url}` + "?" + new URLSearchParams(params).toString(), {
        credentials: 'include',
        mode: 'cors'
    })
    return res.json()
}

