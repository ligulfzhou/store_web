import useSWR from 'swr'
import {fetcher} from "@/utils/utils";
import {host} from "@/utils/const";
import {ListReponse} from "@/types/common";
import useParameters from "@/hooks/useParameters";
import {Customer} from "@/types/customer";

export default function useCustomers () {
    const {page, pageSize} = useParameters()

    const key = `${host}/api/customers?page=${page}&pageSize=${pageSize}`
    const { data, error } = useSWR<ListReponse<Customer>>(
        key,
        fetcher
    )

    let customers: Customer[] = []
    let total: number = 0
    if (data !== undefined && data.data !== undefined && data.data.list) {
        customers = data.data.list
        total = data.data.total
    }

    return {
        key,
        customers,
        total,
        isLoading: !error && !data,
        isError: error
    }
}
