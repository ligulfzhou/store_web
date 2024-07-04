import useOrderDetail from "@/hooks/useOrderDetail";
import {useRouter} from 'next/router'
import {formatUTCDateTime, parseQueryParamToNumber} from "@/utils/utils";
import {OrderItem} from "@/types";
import {Spin} from "antd";
import React from "react";
import useAccountInfo from "@/hooks/useAccountInfo";


export default function PrintOrder() {
    const router = useRouter()
    let id = parseQueryParamToNumber(router.query.id)
    console.log(`order_id: ${id}`)

    const {account, isLoading: accountLoading} = useAccountInfo()
    const {order, key, isLoading} = useOrderDetail(id)

    const sum_count = (items: OrderItem[]) => {
        if (items.length == 0) return 0
        return items.map(item => item.count).reduce((a, b) => a + b)
    }
    const sum_total_price = (items: OrderItem[]) => {
        if (items.length == 0) return 0
        return items.map(item => item.total_price).reduce((a, b) => a + b) / 100
    }

    return (
        <div
            id='toPrint'
            className='flex flex-col justify-center mx-4'
        >
            <div className='w-full h-full border-b-2 border-black mt-4'>
                <div className='text-center text-xl font-bold p-3'>连卡西销售单</div>
            </div>

            {(order?.items || []).length > 0 ? (
                <>
                    {/*order info*/}
                    <div className='mt-2 flex flex-row justify-around'>
                        <div>
                            <div>
                                销售单号: NOOMI-{id.toString().padStart(4, '0')}
                            </div>
                            <div>
                                销售员: {account?.account}
                            </div>
                            <div>
                                送货地址: {order?.customer.address}
                            </div>
                            <div>
                                备注:
                            </div>
                        </div>

                        <div>
                            <div>
                                客户名称: {order?.order.customer}
                            </div>
                            <div>
                                销售时间: {formatUTCDateTime(order?.order.create_time || '')}
                            </div>
                        </div>

                        <div>
                            <div>联系电话: {order?.customer.phone}</div>
                        </div>
                    </div>

                    {/*order table*/}
                    <div className='mt-2'>
                        <table className="border w-full">
                            <thead>
                            <tr className="center">
                                <td className='bg-blue-100 border text-center'>序号</td>
                                <td className='bg-blue-100 border text-center'>品名</td>
                                <td className='bg-blue-100 border text-center'>规格</td>
                                <td className='bg-blue-100 border text-center'>单位</td>
                                <td className='bg-blue-100 border text-center'>数量</td>
                                <td className='bg-blue-100 border text-center'>单价</td>
                                <td className='bg-blue-100 border text-center'>金额</td>
                            </tr>
                            </thead>
                            <tbody>

                            {(order?.items || []).length > 0 ? (
                                <>
                                    {order?.items.map((item, index) => (
                                        <tr>
                                            <td className='border text-center'>{index}</td>
                                            <td className='border text-left'>{item.name}</td>
                                            <td className='border text-center'>{item.size}</td>
                                            <td className='border text-center'>{item.count}</td>
                                            <td className='border text-center'>{item.count}</td>
                                            <td className='border text-right'>{item.price / 100}</td>
                                            <td className='border text-right'>{item.total_price / 100}</td>
                                        </tr>
                                    ))}
                                </>
                            ) : null}
                            <tr>
                                <td className='border'>总计</td>
                                <td className='border'></td>
                                <td className='border'></td>
                                <td className='border'></td>
                                <td className='border text-center'>{sum_count(order?.items || [])}</td>
                                <td className='border'></td>
                                <td className='border text-right'>{sum_total_price(order?.items || [])}</td>
                            </tr>
                            <tr>
                                <td colSpan={7}>总金额: {sum_total_price(order?.items || [])}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    {/*签名区*/}
                    <div className='flex flex-row justify-around mt-4 gap-2'>
                        <div className='flex flex-row w-1/3'>
                            <div className='grow-0'>
                                制单人:
                            </div>
                            <div className='border-b-2 grow p-2'>

                            </div>
                        </div>
                        <div className='flex flex-row w-1/3'>
                            <div className='grow-0'>
                                日期:
                            </div>
                            <div className='border-b-2 grow p-2'>

                            </div>
                        </div>
                        <div className='flex flex-row w-1/3'>
                            <div className='grow-0'>
                                客户签字:
                            </div>
                            <div className='border-b-2 grow p-2'>

                            </div>
                        </div>
                    </div>
                    {/*print button*/}
                    {/*<div className='flex flex-row justify-end mt-2'>*/}
                    {/*    <Button onClick={()=> print()}>*/}
                    {/*        打印*/}
                    {/*    </Button>*/}
                    {/*</div>*/}
                </>
            ) : (
                <div className='mt-5 h-full flex flex-row justify-center'>
                    <Spin/>
                </div>
            )}
        </div>
    )
};
