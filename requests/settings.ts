import {commonDataPost} from "@/requests/common";
import {Customer} from "@/types";
import {UpdateColorValueParams} from "@/types/settings";


export async function updateColorValue(url: string, {arg}: { arg: UpdateColorValueParams}) {
    return commonDataPost<Customer>(url, arg)
}
