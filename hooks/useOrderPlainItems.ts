import useSWR from 'swr'
import {fetcher} from "@/utils/utils";
import useParameters from "./useParameters";
import {host} from "@/utils/const";
import {ListReponse} from "@/types/common";
import {OrderPlainItemsModel} from "@/types/orders";

export default function useOrderPlainItems(order_id: number=0, order_no: String='') {
    const {page, pageSize} = useParameters()

    const key = `${host}/api/order/plain/items?page=${page}&pageSize=${pageSize}&order_no=${order_no}&order_id=${order_id}`
    const {data, error} = useSWR<ListReponse<OrderPlainItemsModel>>(
        key, fetcher
    )

    let orderItems: OrderPlainItemsModel[] = []
    let total: number = 0
    if (data !== undefined && data.data !== undefined && data.data.list) {
        orderItems = data.data.list
        total = data.data.total
    }

    return {
        key,
        orderItems,
        total,
        isLoading: !error && !data,
        isError: error
    }
}
