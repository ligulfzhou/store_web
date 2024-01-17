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
    customer_no: string,
    order_no: string,
    order_date: number
    delivery_date: number,
    is_return_order: boolean,
    is_urgent: boolean
    is_special: boolean,
    special_customer: string,
    done_count: number,
    exception_count: number,
    total_count: number,
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
