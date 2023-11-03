import {Customer} from '@/types'
import {commonDataPost} from "@/requests/common";




export interface UpdateCustomerParam {
    id: number,
    customer_no: string,
    notes: string
}

export async function addCustomer(url: string, { arg }: { arg: UpdateCustomerParam}) {
    return commonDataPost<Customer>(url, arg)
}

export async function updateCustomer(url: string, {arg}: {arg: UpdateCustomerParam}) {
    return commonDataPost<Customer>(url, arg)
}
