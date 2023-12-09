import {commonEmptyPost, commonListGet} from "@/requests/common";
import {Item, UpdateCateParams} from "@/types";


export interface UpdateItemParam {
    id: number,
    images: string[],
    name: string,
    size: string,
    color: string,
    unit: string,
    price: number | string,
    cost: number | string,
    number: string,
    barcode: string,
    notes: string,
    cates: string[] | null,
    cate1_id: number | string,
    cate2_id: number | string,
}

export function makeUpdateCustomerParamNotNull(param: UpdateItemParam) {
    let cate1_id = 0
    let cate2_id = 0
    if (param.cates && param.cates.length > 0) {
        cate1_id = parseInt(param.cates[0])
    }
    if (param.cates && param.cates.length > 1) {
        cate2_id = parseInt(param.cates[1])
    }
    let notNullParam: UpdateItemParam = {
        cates: param.cates || [],
        cate1_id: cate1_id,             // 产品大类
        cate2_id: cate2_id,             // 产品小类
        number: param.number || '',
        color: param.color || '',              // 颜色
        name: param.name || '',               // 产品名称
        size: param.size || '',               // 规格
        unit: param.unit || '',               // 单位
        barcode: param.barcode || '',            // 条码
        price: param.price || 0,            // 标准售价
        cost: param.cost || 0,             // 进货价
        images: param.images || [],
        notes: param.notes || '',
        id: param.id || 0
    }

    return notNullParam
}


export async function updateItem(url: string, {arg}: { arg: UpdateItemParam }) {
    return commonEmptyPost(url, makeUpdateCustomerParamNotNull(arg))
}

export async function updateCate(url: string, {arg}: { arg: UpdateCateParams }) {
    return commonEmptyPost(url, arg)
}


export interface UpdateEmbryoParam {
    id: number,
    images: string[],
    name: string,           // 货号
    color: string,               // 产品名称
    unit: string,               // 规格
    number: string,              // 颜色
    notes: string,
}

export function makeUpdateEmbryoParamNotNull(param: UpdateEmbryoParam) {
    let notNullParam: UpdateEmbryoParam = {
        number: param.number || '',
        color: param.color || '',              // 颜色
        name: param.name || '',               // 产品名称
        unit: param.unit || '',               // 单位
        images: param.images || [],
        notes: param.notes || '',
        id: param.id || 0
    }

    return notNullParam
}


export async function updateEmbryo(url: string, {arg}: { arg: UpdateEmbryoParam }) {
    return commonEmptyPost(url, makeUpdateEmbryoParamNotNull(arg))
}


export interface UpdateEmbryoInoutParam {
    id: number,
    in_out: boolean | number,
    count: number,
}


export async function updateEmbryoInout(url: string, {arg}: { arg: UpdateEmbryoInoutParam }) {
    return commonEmptyPost(url, arg)
}

export interface UpdateItemInoutParam {
    id: number,
    in_out: boolean | number,
    count: number,
}


export async function updateItemInout(url: string, {arg}: { arg: UpdateItemInoutParam }) {
    return commonEmptyPost(url, arg)
}


export interface SearchItemParam {
    id: number,
    in_out: boolean | number,
    count: number,
}


export async function searchItems(url: string, {arg}: { arg: SearchItemParam }) {
    return commonListGet<Item>(url, arg)
}


// export interface ItemCount{
//     item_id: number,
//     count: number
// }
export interface ItemStockOutParam {
    items: {
        item_id: number,
        count: number | string,
    }[]
}

export async function itemStockOut(url: string, {arg}: { arg: ItemStockOutParam }) {
    return commonEmptyPost(url, arg)
}
