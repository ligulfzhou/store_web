import useSWR from 'swr'
import {fetcher} from "@/utils/utils";
import {host} from "@/utils/const";
import {DataResponse} from "@/types/common";
import {OrderDetail} from "@/types/orders";

export default function useOrderDetail(id: number) {

    const key = `/api/order/detail?order_id=${id}`
    const {data, error, mutate} = useSWR<DataResponse<OrderDetail>>(
        `${host}${key}`,
        fetcher
    )

    let order: OrderDetail|undefined = undefined
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
