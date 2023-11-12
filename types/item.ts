export interface Cate {
    id: number,                // SERIAL
    index: number,             // 顺序
    name: string,           // 类名
    sub_cates: string[], // 子类
}

export interface CateModel {
    id: number,        // SERIAL
    index: number,     // 顺序
    name: string,   // 类名
    cate_type: number, // 大类小类， 0 大类， 1小类，再变大，则更小
    parent_id: number, // 父类ID
}

export interface Cates {
    id: number,        // SERIAL
    index: number,     // 顺序
    name: string,   // 类名
    cate_type: number, // 大类小类， 0 大类， 1小类，再变大，则更小
    parent_id: number, // 父类ID
    sub_cates: Cate[],
}

export interface Item {
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
    sell_price: number,            // 标准售价
    buy_price: number,             // 进货价
    create_time: string, // 创建时间

    images: string[],
    supplier: string,
    material: string,
    pcs: number,
    weight: number,
    english_name: string,
    description: string,
    notes: string
}
