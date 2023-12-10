import useSWR from 'swr'
import {fetcher} from "@/utils/utils";
import {host} from "@/utils/const";
import {ListReponse} from "@/types/common";
import {ItemInout} from "@/types/embryo";
import useParameters from "@/hooks/useParameters";

export default function useItemInoutsOfBucket(bucket_id: number) {
    const {mpage, mpageSize} = useParameters()
    const key = `${host}/api/item/inout/list/of/bucket?page=${mpage}&page_size=${mpageSize}&bucket_id=${bucket_id}`
    const { data, error } = useSWR<ListReponse<ItemInout>>(
        key,
        fetcher
    )

    let inouts: ItemInout[] = []
    let total: number = 0
    if (data !== undefined && data.data !== undefined && data.data.list) {
        inouts = data.data.list
        total = data.data.total
    }

    return {
        key,
        total,
        inouts,
        isLoading: !error && !data,
        isError: error
    }
}
