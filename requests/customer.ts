import {Customer} from '@/types'
import {commonDataPost} from "@/requests/common";


export interface UpdateCustomerParam {
    id: number,
    customer_no: string,
    ty_pe: number | string,
    name: string,
    head: string,
    address: string,
    email: string,
    birthday: string | null,
    qq: string,
    phone: string,
    notes: string,
}

export function makeUpdateCustomerParamNotNull(param: UpdateCustomerParam) {
    let notNullParam: UpdateCustomerParam = {
        address: param.address || '',
        birthday: param.birthday,
        customer_no: param.customer_no || '',
        email: param.email || '',
        head: param.head || '',
        name: param.name || '',
        notes: param.notes || '',
        phone: param.phone || '',
        qq: param.qq || '',
        ty_pe: param.ty_pe || 0,
        id: param.id || 0
    }

    return notNullParam
}

export async function addCustomer(url: string, {arg}: { arg: UpdateCustomerParam }) {
    return commonDataPost<Customer>(url, makeUpdateCustomerParamNotNull(arg))
}

export async function updateCustomer(url: string, {arg}: { arg: UpdateCustomerParam }) {
    return commonDataPost<Customer>(url, makeUpdateCustomerParamNotNull(arg))
}
