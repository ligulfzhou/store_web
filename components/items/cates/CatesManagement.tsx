import useCates from "@/hooks/useCates";
import {FC, useEffect, useState} from "react";
import cx from "classnames";
import {Button, Input, message} from "antd";
import {CloseCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {TrashIcon} from "@radix-ui/react-icons";
// import ExtractCatesModal from "@/components/items/cates/ExtractCatesModal";
import {removeIndex} from "@/utils/arr";

interface Props {
    callback: (cate1: string, cate2: string) => void
}

type cateSubCates = Record<number, string[]>

export const CatesManagement: FC<Props> = () => {
    const {cates, key, isLoading} = useCates()
    const [cate1, setCate1] = useState<number>(0)
    const [cate2, setCate2] = useState<number>(0)

    const [trigger, setTrigger] = useState<boolean>(false)
    const [newNames, setNewNames] = useState<string[]>([])
    const [newSubCates, setNewSubCates] = useState<cateSubCates>({})

    useEffect(() => {
        let subNames: cateSubCates = {}
        let newNames_: string[] = []
        let cates_dup = JSON.parse(JSON.stringify(cates));
        for (let idx = 0; idx < cates_dup.length; idx++) {
            subNames[idx] = cates_dup[idx].sub_cates
            newNames_.push(cates_dup[idx].name)
        }

        setNewSubCates(subNames)
        setNewNames(newNames_)
    }, [cates])

    const cate2s = () => {
        let res: string[] = []

        if (cate1 in newSubCates) {
            return newSubCates[cate1]
        }
        return res
    }

    const needsCallUpdateApi = () => {
        if (cates.length !== newNames.length) {
            console.log("cates.length !== newNames.length")
            return true
        }

        for (var i = 0; i < cates.length; i++) {
            if (cates[i].name != newNames[i]) {
                console.log(`cates[${i}].name != newNames[${i}]`)
                return true
            }
            let sub_cates = cates[i].sub_cates;
            if (sub_cates.length != newSubCates[i].length) {
                console.log(`sub_cates.length: ${sub_cates.length}, ${sub_cates} != newSubCates[${i}].length: ${newSubCates[i].length}`)
                console.log(cates)
                return true
            }
            for (var ii = 0; ii < sub_cates.length; ii++) {
                // @ts-ignore
                if (sub_cates[ii] != newSubCates[i][ii]) {
                    console.log(`sub_cates[${ii}]!= newSubCates[${i}][${ii}]`)
                    return true
                }
            }
        }

        return false
    }

    const emptyExist = () => {
        if (newNames.filter(name => name === '').length > 0) {
            message.error("有空白的大类存在")
            return true
        }
        for (var i = 0; i < newNames.length; i++) {
            if (i in newSubCates) {
                if (newSubCates[i].filter(name => name === '').length > 0) {
                    message.error(`大类#${newNames[i]}有空白的小类存在`)
                    return true
                }
            }
        }

        return false
    }

    const updateCates = () => {
        console.log(cates)
        // 检查数据是否有空
        if (emptyExist()) {
            return;
        }
        // 检查是否需要更新
        if (!needsCallUpdateApi()) {
            return
        }

        // 调接口更新
        message.error("等待调用更新cates的接口")
        console.log("update cates....")
    }

    const [isExtractCatesModalOpen, setIsExtractCatesModalOpen] = useState<boolean>(false)

    return (
        <div className='w-1/2 flex flex-col justify-center items-center mx-auto'>

            {/*<ExtractCatesModal*/}
            {/*    open={isExtractCatesModalOpen}*/}
            {/*    closeFn={(success) => {*/}
            {/*        setIsExtractCatesModalOpen(false)*/}
            {/*    }}*/}
            {/*/>*/}

            {/* 产品类别 + 提取按钮 */}
            <div className='w-full flex flex-row justify-around mb-3 items-center gap-4'>
                <div className='font-bold'>
                    产品类别
                </div>
                <Button
                    size='small'
                    type="default"
                    // loading={loadings[2]}
                    onClick={() => {
                        setIsExtractCatesModalOpen(true)
                    }}
                >
                    自动提取
                </Button>
            </div>

            <div className='h-128 flex flex-row justify-center gap-4'>
                {/* 产品大类 */}
                <div className='border-2 border-gray-100 w-72 rounded h-full flex flex-col grow-0'>
                    <div
                        className='text-center h-12 border-b-2 border-gray-100 flex flex-col justify-center items-center'>
                        <>
                            产品大类
                        </>
                    </div>

                    {/* 大类列表 */}
                    <div className='overflow-auto grow'>
                        {newNames.map((cate_name, index) => (
                            <>
                                <div
                                    className={cx(
                                        cate1 == index ? "bg-blue-200" : "hover:bg-blue-100",
                                        cate_name === '' && "bg-blue-100 border-2 border-blue-200",
                                        'w-full h-8'
                                    )}>
                                    <Input
                                        suffix={
                                            <>
                                                {cate_name === '' ? (
                                                    <div
                                                        onClick={() => {
                                                            setNewNames(removeIndex(newNames, index))
                                                            setTrigger(!trigger)
                                                        }}
                                                    >
                                                        <CloseCircleOutlined/>
                                                    </div>
                                                ) : null}
                                            </>
                                        }
                                        onChange={(env) => {
                                            newNames[index] = env.target.value
                                            setNewNames(newNames)
                                            setTrigger(!trigger)
                                        }}
                                        onClick={() => {
                                            setCate1(index)
                                        }}
                                        className='cursor-pointer'
                                        defaultValue={cate_name}
                                        bordered={false}
                                    />
                                </div>
                            </>
                        ))}
                    </div>

                    <div className='grow-0 flex flex-row justify-between border-t-2 border-gray-100'>
                        <div className=''>
                            <Button
                                size='small'
                                type="default"
                                icon={<PlusOutlined/>}
                                onClick={() => {
                                    if (newNames.filter(name => name === '').length > 0) {
                                        return
                                    }
                                    newNames.push('')
                                    setCate1(newNames.length - 1)
                                    setNewNames(newNames)
                                    setTrigger(!trigger)
                                }}
                            />
                        </div>
                        <div>
                            <Button
                                size='small'
                                icon={<TrashIcon/>}
                                onClick={() => {
                                    setNewNames([])
                                    setNewSubCates({})
                                    setTrigger(!trigger)
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* 产品小类 */}
                <div className='border-2 border-gray-100 w-72 rounded h-full flex flex-col grow-0'>
                    <div
                        className='text-center h-12 border-b-2 border-gray-100 flex flex-col justify-center items-center'>
                        <>
                            产品小类
                        </>
                    </div>

                    {/* 小类列表 */}
                    <div className='overflow-auto grow'>
                        {cate2s().map((cate_name, index) => (
                            <div
                                className={cx(
                                    cate2 == index ? "bg-blue-200" : "hover:bg-blue-100",
                                    cate_name === '' && "bg-blue-50 border-2 border-blue-200",
                                    'w-full'
                                )}>
                                <Input
                                    suffix={
                                        <>
                                            {cate1 in newSubCates && newSubCates[cate1][index] === '' ? (
                                                <div
                                                    onClick={() => {
                                                        console.log(index)
                                                        newSubCates[cate1] = removeIndex(newSubCates[cate1], index)
                                                        setNewSubCates(newSubCates)
                                                        setTrigger(!trigger)
                                                    }}
                                                >
                                                    <CloseCircleOutlined/>
                                                </div>
                                            ) : null}
                                        </>
                                    }
                                    onChange={(env) => {
                                        newSubCates[cate1][index] = env.target.value
                                        setTrigger(!trigger)
                                    }}
                                    onClick={
                                        () => {
                                            console.log(cate_name)
                                            setCate2(index)
                                        }
                                    }
                                    className='cursor-pointer'
                                    defaultValue={cate_name}
                                    bordered={false}
                                />
                            </div>
                        ))}
                    </div>

                    <div className='grow-0 flex flex-row justify-between border-t-2 border-gray-100'>
                        <div className=''>
                            <Button
                                size='small'
                                type="default"
                                icon={<PlusOutlined/>}
                                onClick={() => {
                                    if (cate1 in newSubCates) {
                                        if (newSubCates[cate1].filter(name => name == '').length > 0) {
                                            return
                                        }
                                        newSubCates[cate1].push("")
                                    } else {
                                        newSubCates[cate1] = [""]
                                    }
                                    setCate2(newSubCates[cate1].length - 1)
                                    setNewSubCates(newSubCates)
                                    setTrigger(!trigger)
                                }}
                            />
                        </div>
                        <div>
                            <Button
                                size='small'
                                icon={<TrashIcon/>}
                                onClick={() => {
                                    newSubCates[cate1] = []
                                    setNewSubCates(newSubCates)
                                    setTrigger(!trigger)
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 确认按钮 */}
            <div className='w-full flex flex-row justify-around mt-4'>
                <div>

                </div>
                <Button
                    type='primary'
                    onClick={() => {
                        updateCates()
                    }}
                >
                    确认
                </Button>
            </div>
        </div>
    )
}
