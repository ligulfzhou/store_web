import {commonEmptyPost} from "@/requests/common";


export interface UpdateItemParam {
    id: number,
    brand: string,              // 品牌
    cates: string[] | null,
    cates1: string,             // 产品大类
    cates2: string,             // 产品小类
    goods_no: string,           // 货号
    color: string,              // 颜色
    name: string,               // 产品名称
    size: string,               // 规格
    unit: string,               // 单位
    barcode: string,            // 条码
    sell_price: number | string,            // 标准售价
    buy_price: number | string,             // 进货价

    images: string[],
    supplier: string,
    material: string,
    pcs: number | string,
    weight: number | string,
    english_name: string,
    description: string,
    notes: string
}

export function makeUpdateCustomerParamNotNull(param: UpdateItemParam) {
    let cate1 = ''
    let cate2 = ''
    if (param.cates && param.cates.length > 0) {
        cate1 = param.cates[0]
    }
    if (param.cates && param.cates.length > 1) {
        cate2 = param.cates[1]
    }
    let notNullParam: UpdateItemParam = {
        brand: param.brand || '',              // 品牌
        cates: param.cates || [],
        cates1: cate1,             // 产品大类
        cates2: cate2,             // 产品小类
        goods_no: param.goods_no || '',           // 货号
        color: param.color || '',              // 颜色
        name: param.name || '',               // 产品名称
        size: param.size || '',               // 规格
        unit: param.unit || '',               // 单位
        barcode: param.barcode || '',            // 条码
        sell_price: param.sell_price || 0,            // 标准售价
        buy_price: param.buy_price || 0,             // 进货价

        images: param.images || [],
        supplier: param.supplier || '',
        material: param.material || '',
        pcs: param.pcs || 0,
        weight: param.weight || 0,
        english_name: param.english_name || '',
        description: param.description || '',
        notes: param.notes || '',
        id: param.id || 0
    }

    return notNullParam
}


export async function updateItem(url: string, {arg}: { arg: UpdateItemParam }) {
    return commonEmptyPost(url, makeUpdateCustomerParamNotNull(arg))
}
