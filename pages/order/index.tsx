import {Table, Space, Button, Tag} from 'antd';
import LayoutWithMenu from "@/components/Layouts/LayoutWithMenu";
import {ColumnsType} from "antd/es/table";
import useOrders from "@/hooks/useOrders";
import {Order} from '@/types'
import {useRouter} from "next/router";
import {parseQueryParam} from "@/utils/utils";
import useParameters from "@/hooks/useParameters";
import {useState} from "react";
import {useSWRConfig} from "swr";
import ReceiptModal from "@/components/ReceiptModal";
import CreateOrderModal from "@/components/order/CreateOrderModal";


export default function Order() {
    const router = useRouter()
    const {page, pageSize} = useParameters()
    let customerNo = parseQueryParam(router.query.customerNo)
    const {orders, total, isLoading, isValidating, key} = useOrders(customerNo)
    const [refresh, setRefresh] = useState<boolean>(false);
    const {mutate} = useSWRConfig()

    const columns: ColumnsType<Order> = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: "订单编号",
            dataIndex: "order_no",
            render: (text) => (
                <div className='font-medium'>
                    {text}
                </div>
            )
        },
        {
            title: "下单时间",
            dataIndex: "order_date"
        },
        {
            title: "交付时间",
            dataIndex: "delivery_date"
        },
        {
            title: "返单/加急",
            key: "return_order_or_urgent",
            dataIndex: 'return_order_or_urgent',
            render: (_, record) => (
                <>
                    {record.is_return_order ? <Tag color='red'>返单</Tag> : null}
                    {record.is_urgent ? <Tag className='yellow'>加急单</Tag> : null}
                </>
            )
        },
        {
            title: "流程进度",
            key: "step_count",
            dataIndex: 'step_count',
            width: "500px",
            render: (_, record) => (
                <>
                    ...
                </>
            )
        },
        {
            title: '操作',
            key: 'action',
            render: () => (
                <Space size="middle">
                </Space>
            ),
        },
    ];

    const [isSellModalOpen, setIsSellModalOpen] = useState<boolean>(false)

    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false)

    return (
        <LayoutWithMenu>
            <ReceiptModal
                open={isReceiptModalOpen}
                closeFn={() => {
                    setIsReceiptModalOpen(false)
                }}
            />

            <CreateOrderModal open={isSellModalOpen} closeFn={(success) => {
                setIsSellModalOpen(false)
            }}/>

            <div className='p-5 m-2 bg-white rounded  flex flex-row gap-3'>
                <Button
                    loading={refresh}
                    onClick={() => {
                        setRefresh(true)
                        mutate(key).finally(() => setRefresh(false))
                    }}
                    type="primary">
                    刷新
                </Button>

                <Button
                    loading={refresh}
                    onClick={() => {
                        setIsSellModalOpen(true)
                    }}
                    type="primary">
                    添加订单
                </Button>
            </div>

            <div className='p-5 m-2 bg-white rounded overflow-auto'>
                <Table
                    rowKey={`id`}
                    size={"small"}
                    loading={isLoading || (refresh && isValidating)}
                    columns={columns}
                    pagination={{total: total, current: page, pageSize: pageSize}}
                    dataSource={orders}
                />
            </div>
        </LayoutWithMenu>
    );

};
