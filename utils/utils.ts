import {maxTableColumnStrLen, progresses} from '@/utils/const'
import {format} from "date-fns";
import {customAlphabet} from "nanoid";

export function containsOnlyNumbers(str: string) {
    return /^\d+$/.test(str);
}

export async function fetcher<JSON = any>(
    input: RequestInfo,
    init?: RequestInit
): Promise<JSON> {
    const res = await fetch(input, {
        credentials: 'include',
        mode: 'cors',
        ...init
    })
    return res.json()
}

export function getOptionsForStep(n: number) {
    for (let progress of progresses) {
        if (progress.step == n) {
            return [
                {
                    'value': 0,
                    'label': '请选择'
                },
                ...progress.options.map(option => ({
                    'value': option.index,
                    'label': option.name
                }))]
        }
    }

    return []
}

export function formatDate(date: number | Date) {
    return format(date, "yyyy-MM-dd");
}

export function formatDateTime(date: number | Date) {
    return format(date, "yyyy-MM-dd HH:mm:ss");
}

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 10);

export function generateKey(): string {
    return nanoid();
}


export function parseQueryParam(v: string[] | string | undefined) {
    if (v === undefined) {
        return ''
    } else if (typeof v == "string") {
        return v
    } else {
        return v.join(',')
    }
}

export function parseQueryParamToNumber(p: string[] | string | undefined) {
    let pstr = parseQueryParam(p)
    if (pstr) {
        return parseInt(pstr)
    }
    return 0
}

export function parseQueryParamToBoolean(p: string[] | string | undefined) {
    let pstr = parseQueryParam(p)
    return pstr == 'true';
}


export function parseQueryParamToNumberArray(p: string[] | string | undefined) {
    let res: number[] = []
    let pstr = parseQueryParam(p)
    if (pstr) {
        res = pstr.split(',').map(i => parseInt(i));
    }
    return res
}


export function formatFloat(f: number) {
    let s = f.toFixed(2)
    if (s.endsWith('.00')) {
        return s.substr(0, s.length - 3)
    } else if (s.endsWith('0')) {
        return s.substr(0, s.length - 1)
    } else {
        return s
    }
}

export function formatPercent(f: number) {
    let s = (f * 100).toFixed(2)
    let x = ''
    if (s.endsWith('.00')) {
        x = s.substr(0, s.length - 3)
    } else if (s.endsWith('0')) {
        x = s.substr(0, s.length - 1)
    } else {
        x = s
    }
    return x + '%'
}

export function formatLargeNumber(f: number) {
    if (f > 1000000) {
        return formatFloat(f / 1000000) + "m"
    } else if (f > 1000) {
        return formatFloat(f / 1000) + "k"
    } else {
        return formatFloat(f)
    }
}

export function formatMonthDay(x: number) {
    if (x < 10) {
        return '0' + x.toString()
    }
    return x.toString()
}

export function isNullString(str: string | undefined | null) {
    if (str === undefined || str === null || str === '') {
        return true
    }
    return false
}

export function truncateTailing(str: string, len = maxTableColumnStrLen) {
    return str.substr(0, len - 3) + '...'
}

export function capitalizeStr(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function removeValueFromArray<T>(arr: T[], val: T) {
    let res: T[] = []
    for (let index in arr) {
        if (arr[index] !== val) {
            res.push(arr[index])
        }
    }
    return res
}

export function keyToString(key: React.Key) {
    if (typeof key == "number") {
        return key.toString()
    } else {
        return key
    }
}

export function shorter(s: string | undefined, len: number = 20) {
    if (isNullString(s)) {
        return ''
    }
    if (s == undefined) {
        return ''
    }
    if (s.length > len) {
        return s.slice(0, len - 4) + '..'
    } else {
        return s
    }
}


export function maxOf<T>(arr: Array<T>) {
    let res: T = arr[0]
    for (let i = 1; i++; i++) {
        if (arr[i] > res) {
            res = arr[i]
        }
    }
    return res
}
