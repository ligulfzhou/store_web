import React, {FC} from "react";
import {Button, Modal} from "antd";


interface Props {
    open: boolean,
    closeFn: (success: boolean) => void,
}

const OrderPrintModal: FC<Props> = (
    {

        open,
        closeFn,
    }
) => {
    const onClick = () => {
        const opt = {
            scale: 4
        }
    }

    // @ts-ignore
    return (
        <div>
            <Modal
                width={'1200px'}
                open={open}
                centered={true}
                title={'条形码'}
                onCancel={(e) => {
                    e.preventDefault()
                    closeFn(false)
                }}
                footer={null}
                closable={true}
            >
                <div
                    className='flex flex-row justify-center'
                >

                    <head>
                        <title>订货单</title>
                        {/*<style>*/}

                        {/*    table {*/}
                        {/*    width: 100%;*/}
                        {/*    border-collapse: collapse;*/}
                        {/*    border: 1px solid #ccc;*/}
                        {/*}*/}

                        {/*    td,*/}
                        {/*    th {*/}
                        {/*    border: 1px solid #dddddd;*/}
                        {/*    height: 32px;*/}
                        {/*    font-weight: normal;*/}
                        {/*}*/}

                        {/*    tr.center td {*/}
                        {/*    text-align: center;*/}
                        {/*    width: 16.666666%;*/}
                        {/*}*/}

                        {/*    .center {*/}
                        {/*    text-align: center;*/}
                        {/*}*/}
                        {/*</style>*/}
                    </head>
                    <table className="border w-full">
                        <tr>
                            <th className='bg-blue-100 border text-left'>供应商编号</th>
                            <th className='bg-blue-100 border text-left'></th>
                            <th className='bg-blue-100 border text-left'>供应商名称</th>
                            <th className='bg-blue-100 border text-left'></th>
                            <th className='bg-blue-100 border text-left'>传真\电话</th>
                            <th className='bg-blue-100 border text-left'></th>
                        </tr>
                        <tr className="center">
                            <td className='bg-blue-100 border text-left'>物品名称</td>
                            <td className='bg-blue-100 border text-left'>规格</td>
                            <td className='bg-blue-100 border text-left'>数量</td>
                            <td className='bg-blue-100 border text-left'>包装要求</td>
                            <td className='bg-blue-100 border text-left'>质量标准</td>
                            <td className='bg-blue-100 border text-left'>要求到货日期</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>

                        <tr>
                            <td colSpan={2}>采购员:</td>
                            <td colSpan={2}>传真/电话:</td>
                            <td colSpan={2} className="center">
                                采购部(盖章)
                            </td>
                        </tr>
                    </table>

                </div>

                {/* buttons */}
                <div className='flex flex-row justify-end'>
                    <Button onClick={onClick}>
                        打印
                    </Button>
                </div>
            </Modal>
        </div>
    )
}

export default OrderPrintModal
