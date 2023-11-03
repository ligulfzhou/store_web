import useSWR from 'swr'
import {fetcher} from "@/utils/utils";
import useParameters from "./useParameters";
import {host} from "@/utils/const";
import {ListReponse} from "@/types/common";
import {DateWithOrders} from "@/types/orders";

export default function useOrderDates(customerNo: string) {
    const {page, pageSize} = useParameters()

    const key = `${host}/api/orders/by/dates?page=${page}&pageSize=${pageSize}&customer_no=${customerNo}`;
    const {data, error} = useSWR<ListReponse<DateWithOrders>>(
        key,
        fetcher
    )

    let dateWithOrders: DateWithOrders[] = []
    let total: number = 0
    if (data !== undefined && data.data !== undefined && data.data.list) {
        dateWithOrders = data.data.list
        total = data.data.total
    }

    return {
        key,
        dateWithOrders,
        total,
        isLoading: !error && !data,
        isError: error
    }
}
