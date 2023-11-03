import {maxTableColumnStrLen, progresses} from '@/utils/const'
import { format } from "date-fns";
import {customAlphabet} from "nanoid";
import {OneProgress} from "@/types";

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

export function getOptionsForStep(n: number){
    for (let progress of progresses) {
        if (progress.step==n) {
            return [
                {
                    'value': 0,
                    'label': '请选择'
                },
                ...progress.options.map(option=> ({
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
export const getNotesForOneProgress = (oneProgress: OneProgress)=>  {
    return getNotesWithStepAndIndex(oneProgress.step, oneProgress.index, oneProgress.notes)
}


export const getNotesWithStepAndIndex= (step: number, index: number, notes: string='')=>  {
    if (step==1 && index==0) {
        return "下订单"
    }

    if (index==1) {
        if (notes) {
            return notes
        } else {
            return "异常(备注)"
        }
    }

    for (let progress of progresses) {
        if (progress.step == step) {
            for (let option of progress.options) {
                if (option.index==index) {
                    return option.name
                }
            }
        }
    }
    return ''
}


export const getDepartmentAndNotesWithStepAndIndex= (step: number, index: number, notes: string='')=>  {
    if (step==1 && index==0) {
        return "业务部:下订单"
    }

    let department = '';
    for (let progress of progresses) {
        if (progress.step == step) {
            department = progress.department;
            break
        }
    }

    if (index==1) {
        return `${department}:异常(备注)${notes}`
    }

    for (let progress of progresses) {
        if (progress.step == step) {
            for (let option of progress.options) {
                if (option.index==index) {
                    if (department=='业务部' && step==8) {
                        return `${department}(${progress.name}):${option.name}`
                    } else {
                        return `${department}:${option.name}`
                    }
                }
            }
        }
    }
    return '不明🥲'
}

export const getColorWithStepAndIndex= (step: number, index: number)=>  {
    let color = '#C9D2DC'

    for (let progress of progresses) {
        if (progress.step == step) {
            for (let option of progress.options) {
                if (option.index==index) {
                    return option.color
                }
            }
        }
    }
    return color
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
