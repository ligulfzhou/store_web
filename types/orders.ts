
export interface StepIndexCount {
    step: number;
    index: number;
    count: number;
}

export interface OneProgress {
    id: number,
    order_item_id: number,
    step: number,
    index: number,
    account_id: number,
    account_name: string,
    department: string,
    done: boolean,
    notes: string,
    dt: string,
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
    steps: StepIndexCount[];
}

export interface OrderGoods {
    id: number,
    order_id: number,
    goods_id: number,
    order_no: string,
    images: string[],
    name: string,
    package_card: string,
    package_card_des: string

    is_next_action: boolean,
    current_step: number, // 如果 is_next_action=false，这里的值则没有意义
    current_index: number,
    steps: StepIndexCount[],
    items: OrderItem[],
}

export interface OrderItem {
    id: number,
    order_goods_id: number,
    order_id: number,
    sku_id: number,
    sku_no: string,
    color: string,
    count: number,
    unit: string,
    unit_price: number | null,
    total_price: number | null,
    notes_images: string[],
    notes: string | null

    is_next_action: boolean,
    current_step: number,
    steps: OneProgress[],
}

export interface OrderPlainItemsModel {
    id: number;
    name: string;
    images: string[];
    sku_no: string;
    count: number;
    unit: string;
    unit_price: number;
    total_price: number;
    notes: string;
    package_card: string,
    is_next_action: boolean;
    current_index: number;
    current_step: number;
    current_notes: string;
}

export interface DateWithOrders {
    date: string;
    orders: Order[];
}


// ----- ----- ----- ----- -----

export interface OrderSearchParms {
    order_no: string|undefined,
    order_date_start: string|undefined,
    order_date_end: string|undefined,
    delivery_date_start: string|undefined,
    delivery_date_end: string|undefined,
    is_return_order: boolean|undefined,
    is_urgent: boolean|undefined,
    is_special: boolean|undefined,
    page: number,
    pageSize: number,
    // sorter_field: string|undefined,
    // sorter_order: string|undefined
}
