import useSWR from 'swr'
import {fetcher} from "@/utils/utils";
import {host} from "@/utils/const";
import {ListReponse} from "@/types/common";
import {ItemInoutBucket} from "@/types/embryo";
import useParameters from "@/hooks/useParameters";

export default function useItemInoutGroupList() {
    const {page, pageSize} = useParameters()
    const key = `${host}/api/item/inout/group/list?page=${page}&pageSize=${pageSize}`
    const { data, error } = useSWR<ListReponse<ItemInoutBucket>>(
        key,
        fetcher
    )

    let buckets: ItemInoutBucket[] = []
    if (data !== undefined && data.data !== undefined && data.data.list) {
        buckets = data.data.list
    }

    return {
        key,
        buckets,
        isLoading: !error && !data,
        isError: error
    }
}
