import {DataResponse, ListReponse, Order, OrderGoods} from '@/types'
import {commonDataGet, commonDataPost, commonEmptyPost, commonListGet} from "@/requests/common";
import {Moment} from "moment/moment";


export interface UpdateOrderParam {
    id: number,
    customer_no: string,
    order_no: string,
    order_date: Moment|string|undefined,
    delivery_date: Moment|string|undefined,
    is_return_order: boolean,
    is_urgent: boolean,
    is_special: boolean,
    special_customer: string,
}


export async function updateOrder(url: string, {arg}: {arg: UpdateOrderParam}) {
    return commonDataPost<Order>(url, arg)
}


export interface MarkProgressParam {
    order_goods_id: number,
    order_item_id: number,
    index: number,
    notes: string
}

export async function markProgress(url: string, {arg}: {arg: MarkProgressParam}) {
    return commonEmptyPost(url, arg)
}


export interface RevokeProgressParam {
    id: number,
}

export async function revokeProgress(url: string, {arg}: {arg: RevokeProgressParam}) {
    return commonEmptyPost(url, arg)
}


export interface DeleteOrderParam {
    id: number
}
export async function deleteOrder(url: string, {arg}: {arg: DeleteOrderParam}) {
    return commonEmptyPost(url, arg)
}

export interface GetOrderItemProgressParam {
    order_no: string,
    goods_no: string
}


export async function getOrderItemProgress(url: string, {arg}: {arg: GetOrderItemProgressParam}) {
    // todo
    return commonListGet<OrderGoods>(url, arg)
}
