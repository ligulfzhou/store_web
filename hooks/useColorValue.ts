import useSWR from 'swr'
import {fetcher} from "@/utils/utils";
import {host} from "@/utils/const";
import {ListReponse} from "@/types/common";
import {ColorToValue} from "@/types/settings";

export default function useColorValue(byColor: boolean=true) {
    let key = `${host}/api/settings/color/value/sort/by/color`
    if (!byColor) {
        key = `${host}/api/settings/color/value`
    }

    const { data, error } = useSWR<ListReponse<ColorToValue>>(
        key,
        fetcher
    )

    let colorValues: ColorToValue[] = []
    if (data !== undefined && data.data !== undefined && data.data.list) {
        colorValues = data.data.list
    }

    return {
        key,
        colorValues,
        isLoading: !error && !data,
        isError: error
    }
}
