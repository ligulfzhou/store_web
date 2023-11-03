import {Goods, Sku} from "@/types/goods";


export interface ReturnOrderStatsByItem {
    sku: Sku,
    count: number,
    sum: number
}

export interface ReturnOrderStatsByGoods {
    goods: Goods,
    skus: ReturnOrderStatsByItem[],
    count: number,
    sum: number
}
