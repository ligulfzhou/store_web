export interface OrderInList {
    id: number,
    account_id: number,
    account: string,
    customer_id: number,
    customer: string,
    item_images: string[],
    create_time: string,
    total: number,
    count: number,
}

export interface Order {
    id: number,
    tp: number,
    order_no: string
    account_id: number
    account: string
    customer_id: number
    customer: string
    create_time: string
    order_date: string
    delivery_date: string
}

export interface OrderItem {
    id: number
    order_id: number
    index: number
    item_id: number
    item_images: string[]
    count: number
    origin_price: number
    price: number
    total_price: number
    discount: number
    create_time: string
}

export interface OrderDetail {
    order: Order
    items: OrderItem[]
}


// ----- ----- ----- ----- -----

export interface OrderSearchParms {
    order_no: string | undefined,
    order_date_start: string | undefined,
    order_date_end: string | undefined,
    delivery_date_start: string | undefined,
    delivery_date_end: string | undefined,
    is_return_order: boolean | undefined,
    is_urgent: boolean | undefined,
    is_special: boolean | undefined,
    page: number,
    pageSize: number,
    // sorter_field: string|undefined,
    // sorter_order: string|undefined
}
