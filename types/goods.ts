export interface Goods {
    id: number,                  // SERIAL,
    customer_no: string,      // 客户ID
    goods_no: string,         // 类目编号
    images: string[],            // 图片
    image_des: string,        // 图片描述
    name: string,             // 名称
    plating: string,          // 电镀
    package_card: string,     // 标签图片
    package_card_des: string, // 标签说明
    notes: string,            // 备注
}

export interface Sku {
    id: number,
    sku_no: string,
    customer_no: string,
    name: string,
    goods_no: string,      // 产品编号 (暂时没有)
    goods_id: number,         // 产品ID
    images: string[], // 商品图片
    package_card: string,
    plating: string,       // 电镀
    color: string,         // 颜色
    color2: string,
    notes: string, // 备注
}
