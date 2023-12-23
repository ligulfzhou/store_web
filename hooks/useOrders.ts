import useSWR from 'swr'
import {fetcher} from "@/utils/utils";
import useParameters from "./useParameters";
import {host} from "@/utils/const";
import {ListReponse} from "@/types/common";
import {OrderInList} from "@/types/orders";

export default function useOrders() {
    const {
        page,
        pageSize,
        sorter_order,
        sorter_field,
        account_id,
        customer_id,
        order_no,
        create_time_ed,
        create_time_st
    } = useParameters()

    let key = `${host}/api/orders/list?page=${page}&page_size=${pageSize}&order_no=${order_no}&account_id=${account_id}&customer_id=${customer_id}&create_time_st=${create_time_st}&create_time_ed=${create_time_ed}`
    if (sorter_order && sorter_field) {
        key = `${host}/api/orders/list?page=${page}&page_size=${pageSize}&order_no=${order_no}&account_id=${account_id}&customer_id=${customer_id}&create_time_st=${create_time_st}&create_time_ed=${create_time_ed}&sorter_field=${sorter_field}&sorter_order=${sorter_order}`
    }

    const {data, error, mutate, isValidating} = useSWR<ListReponse<OrderInList>>(
        key, fetcher
    )

    let orders: OrderInList[] = []
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
