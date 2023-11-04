import useCates from "@/hooks/useCates";
import {FC, useState} from "react";
import {cx} from "class-variance-authority";

interface Props {
    callback: (cate1: string, cate2: string) => void
}

export const CatesManagement: FC<Props> = () => {
    const {cates, key, isLoading} = useCates()
    const [cate1, setCate1] = useState<string>('')
    const [cate2, setCate2] = useState<string>('')

    const cate2s = ()=> {
        let res: string[] = []
        let cate = cates.filter(item=> item.name==cate1);
        if (cate.length==0) {
            return res
        }
        return cate[0].sub_cates
    }

    return (
        <div className='h-128 flex flex-row justify-center gap-4'>
            {/* 产品大类 */}
            <div className='border-2 border-gray-100 w-72 rounded'>
                <div className='text-center h-12 border-b-2 border-gray-100 flex flex-col justify-center items-center'>
                    <>
                        产品大类
                    </>
                </div>

                {/* 大类列表 */}
                <div className='overflow-auto'>
                    {cates.map(cate => (
                        <div
                            className={cx(
                                cate1 == cate.name ? "bg-blue-200" : "hover:bg-blue-100",
                                'w-full'
                            )}
                            onClick={() => {
                                setCate1(cate.name)
                            }}>
                            <div className='p-1'>
                                {cate.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 产品小类 */}
            <div className='border-2 border-gray-100 w-72 rounded'>
                <div className='text-center h-12 border-b-2 border-gray-100 flex flex-col justify-center items-center'>
                    <>
                        产品小类
                    </>
                </div>

                {/* 小类列表 */}
                <div className='overflow-auto'>
                    {cate2s().map(cate_name => (
                        <div
                            className={cx(
                                cate2 == cate_name ? "bg-blue-200" : "hover:bg-blue-100",
                                'w-full'
                            )}
                            onClick={() => {
                                setCate2(cate_name)
                            }}>
                            <div className='p-1'>
                                {cate_name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
