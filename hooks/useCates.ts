import useSWR from 'swr'
import {fetcher} from "@/utils/utils";
import {host} from "@/utils/const";
import {ListReponse} from "@/types/common";
import Cate from '@/types/item'

export default function useCates() {

    const key = `${host}/api/cates`
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
