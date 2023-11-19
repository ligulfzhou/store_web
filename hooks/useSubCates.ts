import useSWR from 'swr'
import {fetcher} from "@/utils/utils";
import {host} from "@/utils/const";
import {ListReponse} from "@/types/common";
import {Cate} from '@/types/item'

export default function useSubCates(parent_cate_id: number) {
    const key = `${host}/api/cates/sub/cates?id=${parent_cate_id}`
    const { data, error } = useSWR<ListReponse<Cate>>(
        key,
        fetcher
    )

    let cates: Cate[] = []
    if (data !== undefined && data.data !== undefined && data.data.list) {
        cates = data.data.list
    }

    return {
        key,
        cates,
        isLoading: !error && !data,
        isError: error
    }
}
