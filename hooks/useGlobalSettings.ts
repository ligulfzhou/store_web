import useSWR from 'swr'
import {fetcher} from "@/utils/utils";
import {host} from "@/utils/const";
import {DataResponse} from "@/types/common";
import {GlobalSettings} from "@/types/settings";

export default function useGlobalSettings() {
    const key = `${host}/api/settings/global`
    const { data, error } = useSWR<DataResponse<GlobalSettings>>(
        key,
        fetcher
    )

    let globalSettings: GlobalSettings|undefined = undefined
    if (data !== undefined && data.data !== undefined) {
        globalSettings = data.data
    }

    return {
        key,
        globalSettings,
        isLoading: !error && !data,
        isError: error
    }
}
