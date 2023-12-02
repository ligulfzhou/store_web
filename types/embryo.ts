export interface Embryo {
    id: number,          // id
    images: string[],    // 商品图片
    name: string,        // 产品名称
    color: string,       // 颜色
    unit: string,        // 单位
    notes: string,       // 备注
    number: string,      // 货号
    create_time: string, // 创建时间
    count: number,       // 库存数
}


export interface EmbryoSearchParams {
    name: string | undefined,
    number: string | undefined,

    page: number,
    pageSize: number,
}

export interface EmbryoInout {
     id: number,
     account_id: number,            // 经手账号id
     account: string,            // 经手账号 名
     embryo_id: number,             // 产品名称
     count: number,                 // 数量
     in_true_out_false: boolean,    // 增加还是减少
     via: string,                // 规格
     create_time: string, // 创建时间
     embryo: Embryo,
}
