export default interface Cate {
    id: number,                // SERIAL
    index: number,             // 顺序
    name: string,           // 类名
    sub_cates: string[], // 子类

}

export default interface Item {
    id: number,
    num: number | null,
    size: string | null,
    buy_price: number | null,
    sell_price: number | null,
    memo: string | null
}
