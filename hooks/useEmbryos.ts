import useSWR from 'swr'
import {fetcher} from "@/utils/utils";
import {host} from "@/utils/const";
import {ListReponse} from "@/types/common";
import useParameters from "@/hooks/useParameters";
import {Embryo} from "@/types/embryo";

export default function useEmbryos() {
    const {
        page,
        pageSize,

        name,
        number,
    } = useParameters()

    const key = `${host}/api/embryos?name=${name}&number=${number}&page=${page}&page_size=${pageSize}`
    const {data, error} = useSWR<ListReponse<Embryo>>(
        key,
        fetcher
    )

    let embryos: Embryo[] = []
    let total: number = 0
    if (data !== undefined && data.data !== undefined && data.data.list) {
        embryos = data.data.list
        total = data.data.total
    }

    return {
        key,
        embryos,
        total,
        isLoading: !error && !data,
        isError: error
    }
}
