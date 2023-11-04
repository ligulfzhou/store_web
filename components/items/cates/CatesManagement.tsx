import useCates from "@/hooks/useCates";
import {FC, useEffect, useState} from "react";
import cx from "classnames";
import {Button, Input} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {TrashIcon} from "@radix-ui/react-icons";
import {ca} from "date-fns/locale";

interface Props {
    callback: (cate1: string, cate2: string) => void
}

type cateSubCates = Record<string, string[]>
type cateToNewName = Record<string, string>

export const CatesManagement: FC<Props> = () => {
    const {cates, key, isLoading} = useCates()
    const [cate1, setCate1] = useState<string>('')
    const [cate2, setCate2] = useState<string>('')

    const [newCatesName, setNewCatesName] = useState<cateToNewName>({})
    const [newSubCates, setNewSubCates] = useState<cateSubCates>({})

    useEffect(()=> {
        if(!isLoading) {
            let newNames: cateToNewName = {}
            let newSubCateNames: cateSubCates = {}
            for(let cate of cates) {
                newNames[cate.name] = cate.name
                newSubCateNames[cate.name] = cate.sub_cates
            }

            setNewSubCates(newSubCateNames)
            setNewCatesName(newNames)
        }
    }, [cates, isLoading])
    const cate2s = () => {
        let res: string[] = []
        let cate = cates.filter(item => item.name == cate1);
        if (cate.length == 0) {
            return res
        }
        return cate[0].sub_cates
    }

    return (
        <div className='h-128 flex flex-row justify-center gap-4'>
            {/* 产品大类 */}
            <div className='border-2 border-gray-100 w-72 rounded h-full flex flex-col grow-0'>
                <div className='text-center h-12 border-b-2 border-gray-100 flex flex-col justify-center items-center'>
                    <>
                        产品大类
                    </>
                </div>

                {/* 大类列表 */}
                <div className='overflow-auto grow'>
                    {cates.map((cate, index) => (
                        <div
                            className={cx(
                                cate1 == cate.name ? "bg-blue-200" : "hover:bg-blue-100",
                                'w-full'
                            )}>
                            <Input
                                onClick={() => {
                                    setCate1(cate.name)
                                    // console.log(catesEdit)
                                }}
                                className='cursor-pointer'
                                defaultValue={cate.name}
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
                            // loading={loadings[2]}
                            onClick={() => {
                                console.log("+++++++++++")
                            }}
                        />
                    </div>
                    <div>
                        <Button
                            size='small'
                            icon={<TrashIcon/>}
                            // loading={loadings[2]}
                            onClick={() => {
                                console.log("+++++++++++")
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* 产品小类 */}
            <div className='border-2 border-gray-100 w-72 rounded h-full flex flex-col grow-0'>
                <div className='text-center h-12 border-b-2 border-gray-100 flex flex-col justify-center items-center'>
                    <>
                        产品小类
                    </>
                </div>

                {/* 小类列表 */}
                <div className='overflow-auto grow'>
                    {cate2s().map((cate_name, index) => (
                        <div
                            className={cx(
                                cate2 == cate_name ? "bg-blue-200" : "hover:bg-blue-100",
                                'w-full'
                            )}>
                            <Input
                                onChange={()=> {
                                }}
                                onClick={
                                    () => {
                                        console.log(cate_name)
                                        setCate2(cate_name)
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
                            // loading={loadings[2]}
                            onClick={() => {
                                console.log("+++++++++++")
                            }}
                        />
                    </div>
                    <div>
                        <Button
                            size='small'
                            icon={<TrashIcon/>}
                            // loading={loadings[2]}
                            onClick={() => {
                                console.log("+++++++++++")
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
