import useSWR from 'swr'
import {fetcher} from "@/utils/utils";
import useParameters from "./useParameters";
import {host} from "@/utils/const";
import {ListReponse} from "@/types/common";
import {OrderGoods} from "@/types/orders";

export default function useOrderGoodsItems(order_id: number=0, order_no: String='') {
    const {mpage, mpageSize} = useParameters()

    const key = `${host}/api/order/items?page=${mpage}&pageSize=${mpageSize}&order_no=${order_no}&order_id=${order_id}`
    const {data, error} = useSWR<ListReponse<OrderGoods>>(
        key, fetcher
    )

    let orderGoods: OrderGoods[] = []
    let total: number = 0
    if (data !== undefined && data.data !== undefined && data.data.list) {
        orderGoods = data.data.list
        total = data.data.total
    }

    return {
        key,
        orderGoods,
        total,
        isLoading: !error && !data,
        isError: error,
    }
}
