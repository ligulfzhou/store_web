import useSWR from 'swr'
import {fetcher} from "@/utils/utils";
import {host} from "@/utils/const";
import {ListReponse} from "@/types/common";
import {CustomerTypeSettings} from "@/types/settings";

export default function useCustomerTypes() {
    const key = `${host}/api/settings/customer/types`
    const { data, error } = useSWR<ListReponse<CustomerTypeSettings>>(
        key,
        fetcher
    )

    let customerTypes: CustomerTypeSettings[] = []
    if (data !== undefined && data.data !== undefined && data.data.list) {
        customerTypes = data.data.list
    }

    return {
        key,
        customerTypes,
        isLoading: !error && !data,
        isError: error
    }
}
