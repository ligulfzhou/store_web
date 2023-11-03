import useSWR from 'swr'
import {fetcher} from "@/utils/utils";
import useParameters from "./useParameters";
import {host} from "@/utils/const";
import {ListReponse} from "@/types/common";
import {Order} from "@/types/orders";

export default function useOrders(customerNo: string) {
    const {
        page,
        pageSize,
        sorter_order,
        sorter_field,
        order_no,
        order_date_start,
        order_date_end,
        delivery_date_start,
        delivery_date_end,
        is_urgent,
        is_return_order,
        is_special
    } = useParameters()

    let key = `${host}/api/orders?page=${page}&pageSize=${pageSize}&customer_no=${customerNo}&order_no=${order_no}&order_date_start=${order_date_start}&order_date_end=${order_date_end}&delivery_date_start=${delivery_date_start}&delivery_date_end=${delivery_date_end}&is_urgent=${is_urgent}&is_return_order=${is_return_order}&is_special=${is_special}`
    if (sorter_order && sorter_field) {
        key = `${host}/api/orders?page=${page}&pageSize=${pageSize}&customer_no=${customerNo}&order_no=${order_no}&order_date_start=${order_date_start}&order_date_end=${order_date_end}&delivery_date_start=${delivery_date_start}&delivery_date_end=${delivery_date_end}&is_urgent=${is_urgent}&is_return_order=${is_return_order}&is_special=${is_special}&sorter_field=${sorter_field}&sorter_order=${sorter_order}`
    }

    const {data, error, mutate, isValidating} = useSWR<ListReponse<Order>>(
        key, fetcher
    )

    let orders: Order[] = []
    let total: number = 0
    if (data !== undefined && data.data !== undefined && data.data.list) {
        orders = data.data.list
        total = data.data.total
    }

    return {
        key,
        mutate,
        isValidating,
        orders,
        total,
        isLoading: !error && !data,
        isError: error
    }

}
