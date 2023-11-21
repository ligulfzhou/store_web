import {commonEmptyPost} from "@/requests/common";
import {UpdateColorValueParams, UpdateCustomerTypeParams} from "@/types/settings";


export async function updateColorValue(url: string, {arg}: { arg: UpdateColorValueParams}) {
    return commonEmptyPost(url, arg)
}

export interface UpdateGlobalSettingParams {
    units: string[],
    accounts: string[]
}

export async function updateGlobalSettings(url: string, {arg}: { arg: UpdateGlobalSettingParams}) {
    return commonEmptyPost(url, arg)
}


export async function updateCustomerType(url: string, {arg}: { arg: UpdateCustomerTypeParams}) {
    return commonEmptyPost(url, arg)
}
