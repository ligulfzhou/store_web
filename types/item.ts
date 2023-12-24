import {Embryo, ItemInout} from "@/types/embryo";

export interface Cate {
    id: number,        // SERIAL
    index: number,     // 顺序
    name: string,   // 类名
    cate_type: number, // 大类小类， 0 大类， 1小类，再变大，则更小
    parent_id: number, // 父类ID
    sub_cates: Cate[],
    create_time: string
}

export interface UpdateCateParams {
    id: number,    // SERIAL
    index: number, // 顺序
    name: string,  // 类名
    cate_type: number, // 大类小类， 0 大类， 1小类，再变大，则更小
    parent_id: number // 父类
}


export interface Item {
    id: number,          // id
    images: string[],    // 商品图片
    name: string,        // 产品名称
    size: string,        // 规格
    color: string,       // 颜色
    cate1_id: number,    // 大类ID
    cate2_id: number,    // 小类ID
    cate1: string,       // 产品大类
    cate2: string,       // 产品小类
    unit: string,        // 单位
    price: number,       // 标准售价
    cost: number,        // 成本
    notes: string,       // 备注
    number: string,      // 货号
    barcode: string,     // 条码
    count: number,
    create_time: string, // 创建时间
    embryo: Embryo | undefined
}


export interface ItemSearchParams {
    name: string | undefined,
    number: string | undefined,
    barcode: string | undefined,
    cate1_id: number | string | undefined,
    cate2_id: number | string | undefined,
    create_time_st: string | undefined,
    create_time_ed: string | undefined,

    page: number,
    pageSize: number,
}


export interface ItemInoutBucket {
    id: number,
    account_id: number,
    account: String,
    in_true_out_false: boolean,
    via: string,
    create_time: string,

    total_count: number,
    total_sum: number,

    items: ItemInout[],
}
