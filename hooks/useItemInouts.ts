import useSWR from 'swr'
import {fetcher} from "@/utils/utils";
import {host} from "@/utils/const";
import {ListReponse} from "@/types/common";
import {ItemInout} from "@/types/embryo";
import useParameters from "@/hooks/useParameters";

export default function useItemInouts(itemId: number) {
    const {mpage, mpageSize} = useParameters()
    const key = `${host}/api/item/inout/list?page=${mpage}&page_size=${mpageSize}&item_id=${itemId}`
    const { data, error } = useSWR<ListReponse<ItemInout>>(
        key,
        fetcher
    )

    let total = 0
    let inouts: ItemInout[] = []
    if (data !== undefined && data.data !== undefined && data.data.list) {
        inouts = data.data.list
        total = data.data.total
    }

    return {
        key,
        inouts,
        total,
        isLoading: !error && !data,
        isError: error
    }
}
