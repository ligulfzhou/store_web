import {commonEmptyPost} from "@/requests/common";


export interface UpdateItemParam {
    id: number,
    images: string[],
    name: string,           // 货号
    size: string,              // 颜色
    color: string,               // 产品名称
    unit: string,               // 规格
    price: number | string,            // 标准售价
    cost: number | string,             // 进货价
    number: string,              // 颜色
    barcode: string,            // 条码
    notes: string,
    cates: number[] | null,
    cate1_id: number|string,             // 产品大类
    cate2_id: number|string,             // 产品小类
}

export function makeUpdateCustomerParamNotNull(param: UpdateItemParam) {
    let cate1_id = 0
    let cate2_id = 0
    if (param.cates && param.cates.length > 0) {
        cate1_id = param.cates[0]
    }
    if (param.cates && param.cates.length > 1) {
        cate2_id = param.cates[1]
    }
    let notNullParam: UpdateItemParam = {
        cates: param.cates || [],
        cate1_id: cate1_id,             // 产品大类
        cate2_id: cate2_id,             // 产品小类
        number: param.number||'',
        color: param.color || '',              // 颜色
        name: param.name || '',               // 产品名称
        size: param.size || '',               // 规格
        unit: param.unit || '',               // 单位
        barcode: param.barcode || '',            // 条码
        price: param.price|| 0,            // 标准售价
        cost: param.cost|| 0,             // 进货价
        images: param.images || [],
        notes: param.notes || '',
        id: param.id || 0
    }

    return notNullParam
}


export async function updateItem(url: string, {arg}: { arg: UpdateItemParam }) {
    return commonEmptyPost(url, makeUpdateCustomerParamNotNull(arg))
}
