import React, {FC, useState} from "react";
import {Modal, Button, Table} from "antd";
import {useSWRConfig} from "swr";
import {ColumnsType} from "antd/es/table";
import useRouterUtils from "@/hooks/useRouterUtils";
import useOrderDetail from "@/hooks/useOrderDetail";
import {OrderItem} from "@/types";


interface Props {
    open: boolean,
    closeFn: (success: boolean) => void,
    id: number | undefined,
}

const OrderDetailModal: FC<Props> = (
    {
        open,
        closeFn,
        id,
    }
) => {
    const {order, key, isLoading} = useOrderDetail(id || 0)
    const {mutate} = useSWRConfig()
    const [refresh, setRefresh] = useState<boolean>(false)
    const {reloadPage} = useRouterUtils()

    const columns: ColumnsType<OrderItem> = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: "名称",
            dataIndex: "name",
            render: (_, record) => (
                <div>
                    {record.name}
                </div>
            )
        },
        {
            title: "编号",
            dataIndex: "name",
            render: (_, record) => (
                <div>
                    {record.number}
                </div>
            )
        },
        {
            title: "数量",
            dataIndex: "name",
            render: (_, record) => (
                <div>
                    {Math.abs(record.count / 10)}
                </div>
            )
        },
        {
            title: "图片",
            dataIndex: "images",
            render: (_, record) => (
                <div>
                    {record.images}
                </div>
            )
        },
        {
            title: "时间",
            dataIndex: "name",
            render: (_, record) => (
                <div>
                    {record.create_time}
                </div>
            )
        },
    ];

    return (
        <div>
            <Modal
                width={'1000px'}
                open={open}
                centered={true}
                title='查看订单详情'
                onCancel={(e) => {
                    e.preventDefault()
                    closeFn(false)
                }}
                footer={null}
                closable={true}
            >
                <div className='flex flex-row gap-4'>
                    <Button
                        loading={isLoading || refresh}
                        type="primary"
                        onClick={() => {
                            setRefresh(true)
                            mutate(key).finally(() => setRefresh(false))
                        }}
                    >
                        刷新
                    </Button>
                </div>

                <div className='p-5 m-2 bg-white rounded'>
                    <Table
                        rowKey={`id`}
                        size={"small"}
                        loading={isLoading || refresh}
                        columns={columns}
                        dataSource={order?.items || []}
                        onChange={(pagination, filters, sorter) => {
                            reloadPage({
                                mpage: pagination.current,
                                mpageSize: pagination.pageSize,
                            })
                        }}
                    />
                </div>
            </Modal>
        </div>
    );
}

export default OrderDetailModal
