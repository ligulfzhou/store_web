import useSWR from 'swr'
import {fetcher} from "@/utils/utils";
import useParameters from "./useParameters";
import {host} from "@/utils/const";
import {DataResponse} from "@/types/common";
import {Order} from "@/types/orders";

export default function useOrderDetail(orderNo: string='') {
    const {order_id, order_no} = useParameters()

    const key = `/api/order/detail?order_id=${order_id}&order_no=${orderNo?orderNo:order_no}`
    const {data, error, mutate} = useSWR<DataResponse<Order>>(
        `${host}${key}`,
        fetcher
    )

    let order: Order|undefined = undefined
    if (data !== undefined && data.data !== undefined) {
        order=data.data
    }

    return {
        key,
        order,
        mutate,
        isLoading: !error && !data,
        isError: error
    }
}
