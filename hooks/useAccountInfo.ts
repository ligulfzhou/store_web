import useSWR from 'swr'
import {fetcher} from "@/utils/utils";
import {host} from "@/utils/const";
import {DataResponse} from "@/types/common";
import {Account} from "@/types/account";

export default function useAccountInfo () {

    const key = `${host}/api/account/info`
    const { data, error } = useSWR<DataResponse<Account>>(
        key,
        fetcher
    )

    let account: Account | undefined= undefined
    let code: number = 0
    let msg: string = ''
    if (data !== undefined) {
        account = data.data
        code = data.code
        msg = data.msg
    }

    return {
        code,
        msg,
        account,
        isLoading: !error && !data,
        isError: error
    }
}
