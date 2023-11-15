export function removeIndex<T>(arr: T[], idx: number) {
    let n = arr.filter((_, index) => index !== idx)
    console.log(`remove index#${idx} of arr#${arr}, we got arr#${n} `)
    return n
}

export function isArrSame<T>(arrA: T[], arrB: T[]) {
    if (arrA.length != arrB.length) {
        return false
    }

    for (let i = 0; i < arrA.length; i++) {
        if (arrA[i] != arrB[i]) {
            return false
        }
    }

    return true
}
