import React, {FC} from "react";
import {Button, Modal, Spin} from "antd";
import useOrderDetail from "@/hooks/useOrderDetail";


interface Props {
    open: boolean,
    closeFn: (success: boolean) => void,
    id: number | undefined,
}

const OrderPrintModal: FC<Props> = (
    {

        open,
        closeFn,
        id
    }
) => {
    const {order, key, isLoading} = useOrderDetail(id || 0)
    const printOrder = () => {
        var prtContent = document.getElementById("toPrint");
        var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
        if (!prtContent || !WinPrint) {
            // won't happen
            return
        }
        WinPrint.document.write(prtContent.innerHTML);
        WinPrint.document.close();
        WinPrint.focus();
        WinPrint.print();
        // WinPrint.close();
    }

    console.log(`loading: ${isLoading}, order: ${order}, order.items: ${order?.items || []}`)

    // @ts-ignore
    return (
        <div>
            <Modal
                width={'1200px'}
                open={open}
                centered={true}
                title={'打印订单'}
                onCancel={(e) => {
                    e.preventDefault()
                    closeFn(false)
                }}
                footer={null}
                closable={true}
            >
                {(order?.items || []).length > 0 ? (
                    <div
                        id='toPrint'
                        className='flex flex-col justify-center'
                    >
                        <div className='center'>
                            <div className='text-center text-xl font-bold'>订货单</div>
                        </div>
                        <div>
                            <table className="border w-full">
                                <thead>
                                <tr className="center">
                                    <td className='bg-blue-100 border text-left'>序号</td>
                                    <td className='bg-blue-100 border text-left'>品名</td>
                                    <td className='bg-blue-100 border text-left'>规格</td>
                                    <td className='bg-blue-100 border text-left'>单位</td>
                                    <td className='bg-blue-100 border text-left'>数量</td>
                                    <td className='bg-blue-100 border text-left'>单价</td>
                                    <td className='bg-blue-100 border text-left'>金额</td>
                                </tr>
                                </thead>
                                <tbody>

                                {(order?.items || []).length > 0 ? (
                                    <>
                                        {order?.items.map((item, index) => (
                                            <tr>
                                                <td className='border text-left'>{index}</td>
                                                <td className='border text-left'>{item.name}</td>
                                                <td className='border text-left'>{item.size}</td>
                                                <td className='border text-left'>{item.count}</td>
                                                <td className='border text-left'>{item.count}</td>
                                                <td className='border text-left'>{item.price / 100}</td>
                                                <td className='border text-left'>{item.total_price / 100}</td>
                                            </tr>
                                        ))}
                                    </>
                                ) : null}
                                <tr>
                                    <td colSpan={2}>采购员:</td>
                                    <td colSpan={2}>传真/电话:</td>
                                    <td colSpan={2} className="center">
                                        采购部(盖章)
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className='flex flex-row justify-center'>
                        <Spin/>
                    </div>
                )}


                {/* buttons */}
                <div className='flex flex-row justify-end mt-2'>
                    <Button onClick={printOrder}>
                        打印
                    </Button>
                </div>
            </Modal>
        </div>
    )
}

export default OrderPrintModal
