import useSWR from 'swr'
import {fetcher} from "@/utils/utils";
import {host} from "@/utils/const";
import {ListReponse} from "@/types/common";
import {ItemInoutBucket} from "@/types/item";
import useParameters from "@/hooks/useParameters";

export default function useItemInoutGroupList() {
    const {page, pageSize, in_out} = useParameters()
    let key = `${host}/api/item/inout/group/list?page=${page}&page_size=${pageSize}`
    if (in_out!= undefined) {
        key = `${host}/api/item/inout/group/list?page=${page}&page_size=${pageSize}&in_out=in_out`
    }
    const { data, error } = useSWR<ListReponse<ItemInoutBucket>>(
        key,
        fetcher
    )

    let total = 0
    let buckets: ItemInoutBucket[] = []
    if (data !== undefined && data.data !== undefined && data.data.list) {
        buckets = data.data.list
        total = data.data.total
    }

    return {
        key,
        total,
        buckets,
        isLoading: !error && !data,
        isError: error
    }
}
