


export function removeIndex<T>(arr: T[], idx: number) {
    let n = arr.filter((_, index)=> index!==idx)
    console.log(`remove index#${idx} of arr#${arr}, we got arr#${n} `)
    return n
}
