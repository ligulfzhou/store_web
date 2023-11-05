import {commonEmptyPost} from "@/requests/common";


export interface UpdateItemParam {
    id: number,
    brand: string,              // 品牌
    cates1: string,             // 产品大类
    cates2: string,             // 产品小类
    goods_no: string,           // 货号
    color: string,              // 颜色
    name: string,               // 产品名称
    size: string,               // 规格
    unit: string,               // 单位
    barcode: string,            // 条码
    sell_price: number|string,            // 标准售价
    buy_price: number|string,             // 进货价
}

export function makeUpdateCustomerParamNotNull(param: UpdateItemParam) {
    let notNullParam: UpdateItemParam = {
        brand: param.brand||'',              // 品牌
        cates1: param.cates1||'',             // 产品大类
        cates2: param.cates2||'',             // 产品小类
        goods_no: param.goods_no||'',           // 货号
        color: param.color||'',              // 颜色
        name: param.name||'',               // 产品名称
        size: param.size||'',               // 规格
        unit: param.unit||'',               // 单位
        barcode: param.barcode||'',            // 条码
        sell_price: param.sell_price,            // 标准售价
        buy_price: param.buy_price,             // 进货价
        id: param.id || 0
    }

    return notNullParam
}


export async function updateItem(url: string, {arg}: { arg: UpdateItemParam}) {
    return commonEmptyPost(url, makeUpdateCustomerParamNotNull(arg))
}
