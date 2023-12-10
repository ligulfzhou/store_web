import useSWR from 'swr'
import {fetcher} from "@/utils/utils";
import {host} from "@/utils/const";
import {ListReponse} from "@/types/common";
import useParameters from "@/hooks/useParameters";
import {Item} from "@/types/item";

export default function useItems() {
    const {
        page,
        pageSize,

        name,
        cate1_id,
        cate2_id,
        number,
        barcode,
        create_time_st,
        create_time_ed
    } = useParameters()

    const key = `${host}/api/items?name=${name}&cate1_id=${cate1_id}&cate2_id=${cate2_id}&number=${number}&barcode=${barcode}&create_time_st=${create_time_st}&create_time_ed=${create_time_ed}&page=${page}&page_size=${pageSize}`
    const {data, error} = useSWR<ListReponse<Item>>(
        key,
        fetcher
    )

    let items: Item[] = []
    let total: number = 0
    if (data !== undefined && data.data !== undefined && data.data.list) {
        items = data.data.list
        total = data.data.total
    }

    return {
        key,
        items,
        total,
        isLoading: !error && !data,
        isError: error
    }
}
