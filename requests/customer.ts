import {Customer} from '@/types'
import {commonDataPost} from "@/requests/common";


export interface UpdateCustomerParam {
    id: number,
    ty_pe: number | string,
    name: string,
    head: string,
    address: string,
    email: string,
    birthday: string | null,
    phone: string,
    notes: string,
}

export function makeUpdateCustomerParamNotNull(param: UpdateCustomerParam) {

    let ty_pe = 0
    if (typeof param.ty_pe == 'number') {
        ty_pe = param.ty_pe
    } else {
        ty_pe = parseInt(param.ty_pe||'0')
    }

    let notNullParam: UpdateCustomerParam = {
        address: param.address || '',
        birthday: param.birthday,
        email: param.email || '',
        head: param.head || '',
        name: param.name || '',
        notes: param.notes || '',
        phone: param.phone || '',
        ty_pe: ty_pe,
        id: param.id || 0
    }

    return notNullParam
}

// export async function addCustomer(url: string, {arg}: { arg: UpdateCustomerParam }) {
//     return commonDataPost<Customer>(url, makeUpdateCustomerParamNotNull(arg))
// }
//
export async function updateCustomer(url: string, {arg}: { arg: UpdateCustomerParam }) {
    return commonDataPost<Customer>(url, makeUpdateCustomerParamNotNull(arg))
}
