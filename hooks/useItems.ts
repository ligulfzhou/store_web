import useSWR from 'swr'
import {fetcher} from "@/utils/utils";
import {host} from "@/utils/const";
import {ListReponse} from "@/types/common";
import useParameters from "@/hooks/useParameters";
import Item from "@/types/item";

export default function useItems() {
    const {
        page,
        pageSize,

        name,
        brand,
        cates1,
        cates2,
        goods_no
    } = useParameters()

    const key = `${host}/api/items?brand=${brand}&name=${name}&cates2=${cates1}&cates2=${cates2}&goods_no=${goods_no}&page=${page}&pageSize=${pageSize}`
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
