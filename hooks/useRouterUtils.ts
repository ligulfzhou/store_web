import {useRouter} from "next/router";

export default function useRouterUtils() {

    const router = useRouter();

    const removeParams = (params: string[]) => {
        console.log(`remove param: ${params}`)
        let curParams = JSON.parse(JSON.stringify(router.query))
        params.map(param=> delete curParams[param])

        router.push({
            pathname: router.asPath.split("?")[0], query: curParams
        }, undefined, {
            shallow: true
        })
    }

    const removeParam = (param: string) => {
        console.log(`remove param: ${param}`)

        let params = JSON.parse(JSON.stringify(router.query))
        delete params[param]

        router.push({
            pathname: router.asPath.split("?")[0], query: params
        }, undefined, {
            shallow: true
        })
    }

    const reload = () => {
        let params = JSON.parse(JSON.stringify(router.query))
        params['random'] = Math.floor(Math.random() * 100)
        router.push({
            pathname: router.asPath.split("?")[0],
            query: params
        }, undefined, {
            shallow: true
        })
    }

    const reloadPage = (obj: object, force: boolean = false) => {
        if (!needReload(obj) && !force) {
            return
        }

        let params = JSON.parse(JSON.stringify(router.query))
        params = {
            ...params, ...obj
        }

        router.push({
            pathname: router.asPath.split("?")[0], query: params
        }, undefined, {
            shallow: true
        })
    }

    const needReload = (obj: object) => {
        let params = JSON.parse(JSON.stringify(router.query))
        for (const k in obj) {
            // @ts-ignore
            if (params[k] !== obj[k]) {
                return true
            }
        }
        return false
    }

    return {
        removeParam,
        removeParams,
        reload,
        reloadPage
    }
}
