import useSWR from 'swr'
import {fetcher} from "@/utils/utils";
import {host} from "@/utils/const";
import {ListReponse} from "@/types/common";
import {EmbryoInout, ItemInout} from "@/types/embryo";
import useParameters from "@/hooks/useParameters";

export default function useEmbryoInoutsOfBucket(bucket_id: number) {
    const {mpage, mpageSize} = useParameters()
    const key = `${host}/api/embryo/inout/list/of/bucket?page=${mpage}&page_size=${mpageSize}&bucket_id=${bucket_id}`
    const {data, error} = useSWR<ListReponse<EmbryoInout>>(
        key,
        fetcher
    )

    let inouts: EmbryoInout[] = []
    let total = 0
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
