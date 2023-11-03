export const b64Encode = (str: string)=> {
    return Buffer.from(str, 'utf8').toString('base64')
}

export const b64Decode = (str: string)=> {
    return  Buffer.from(str, 'base64').toString('utf8')
}

