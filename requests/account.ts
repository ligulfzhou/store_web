import {commonEmptyPost} from "@/requests/common";


interface LoginParam {
    account: string,
    password: string
}


export async function login(key: string, {arg}: {arg: LoginParam}) {
    return commonEmptyPost(key, arg)
}


export async function logout(key: string) {
    return commonEmptyPost(key, {})
}
