import {Table, Space, Button, Tag} from 'antd';
import LayoutWithMenu from "@/components/Layouts/LayoutWithMenu";
import {ColumnsType} from "antd/es/table";
import useOrders from "@/hooks/useOrders";
import {OrderInList} from '@/types'
import useParameters from "@/hooks/useParameters";
import {useState} from "react";
import {useSWRConfig} from "swr";
import ReceiptModal from "@/components/ReceiptModal";
import CreateOrderModal from "@/components/order/CreateOrderModal";
import {defaultPageSize} from "@/utils/const";
import useRouterUtils from "@/hooks/useRouterUtils";


export default function Order() {
    const {page, pageSize} = useParameters()
    const {orders, total, isLoading, isValidating, key} = useOrders()
    const [refresh, setRefresh] = useState<boolean>(false);
    const {mutate} = useSWRConfig()
    const {reloadPage} = useRouterUtils()

    const columns: ColumnsType<OrderInList> = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: "订单编号",
            dataIndex: "order_no",
            render: (_, record) => (
                <div className='font-medium'>
                    还未生成
                </div>
            )
        },
        {
            title: "客户",
            dataIndex: "customer"
        },
        {
            title: "下单时间",
            dataIndex: "create_time"
        },
        {
            title: "销售数量",
            dataIndex: "count"
        },
        {
            title: "销售金额",
            dataIndex: "total",
            render: (_, record) => (
                <div>
                    {record.total / 100}¥
                </div>
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
                if (success) {
                    setRefresh(true)
                    mutate(key).finally(() => setRefresh(false))
                }
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
                    pagination={{
                        total: total,
                        current: page,
                        defaultPageSize: defaultPageSize,
                        pageSize: pageSize,
                        onChange: (thisPage, thisPageSize) => {
                            reloadPage({
                                page: thisPage,
                                pageSize: thisPageSize
                            })
                        }
                    }}
                    dataSource={orders}
                />
            </div>
        </LayoutWithMenu>
    );

};
