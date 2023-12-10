import useSWR from 'swr'
import {fetcher} from "@/utils/utils";
import {host} from "@/utils/const";
import {ListReponse} from "@/types/common";
import {EmbryoInout} from "@/types/embryo";
import useParameters from "@/hooks/useParameters";

export default function useEmbryoInouts(embryoId: number) {
    const {mpage, mpageSize} = useParameters()
    const key = `${host}/api/embryo/inout/list?page=${mpage}&page_size=${mpageSize}&embryo_id=${embryoId}`
    const { data, error } = useSWR<ListReponse<EmbryoInout>>(
        key,
        fetcher
    )

    let inouts: EmbryoInout[] = []
    if (data !== undefined && data.data !== undefined && data.data.list) {
        inouts = data.data.list
    }

    return {
        key,
        inouts,
        isLoading: !error && !data,
        isError: error
    }
}
