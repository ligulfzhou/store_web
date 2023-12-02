
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
    number: string|undefined,

    page: number,
    pageSize: number,
}
