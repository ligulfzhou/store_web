import {Table, Space, Button, Tag} from 'antd';
import LayoutWithMenu from "@/components/Layouts/LayoutWithMenu";
import {ColumnsType} from "antd/es/table";
import {getColorWithStepAndIndex, getDepartmentAndNotesWithStepAndIndex, parseQueryParam} from "@/utils/utils";
import useParameters from "@/hooks/useParameters";
import {useState} from "react";
import {useSWRConfig} from "swr";
import StockOutModal from "@/components/stock/StockOutModal";
import useItemInoutGroupList from "@/hooks/useItemInoutGroupList";
import {ItemInoutBucket} from "@/types/embryo";


export default function Index() {
    const {page, pageSize} = useParameters()
    const {key, isLoading, buckets} = useItemInoutGroupList()
    const [refresh, setRefresh] = useState<boolean>(false);
    const {mutate} = useSWRConfig()

    const columns: ColumnsType<ItemInoutBucket> = [
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
            title: '操作',
            key: 'action',
            render: () => (
                <Space size="middle">
                </Space>
            ),
        },
    ];

    const [isStockOutModalOpen, setIsStockOutModalOpen] = useState<boolean>(false)

    return (
        <LayoutWithMenu>
            <StockOutModal open={isStockOutModalOpen} closeFn={(success)=> {
                setIsStockOutModalOpen(false)
                console.log('stock-out-modal closed...')
                if (success) {
                    console.log('success......')
                }
            }} />

            <div className='p-5 m-2 bg-white rounded flex flex-row gap-2'>
                <Button
                    loading={refresh}
                    onClick={() => {
                        setRefresh(true)
                        // mutate(key).finally(() => setRefresh(false))
                    }}
                    type="primary">
                    刷新
                </Button>

                <Button
                    loading={refresh}
                    onClick={() => {
                        setIsStockOutModalOpen(true)
                    }}
                    type="primary">
                    出库
                </Button>
            </div>

            <div className='p-5 m-2 bg-white rounded overflow-auto'>
                <Table
                    rowKey={`id`}
                    size={"small"}
                    loading={isLoading || refresh}
                    columns={columns}
                    pagination={{total: 10, current: page, pageSize: pageSize}}
                    dataSource={buckets}
                />
            </div>
        </LayoutWithMenu>
    );

};
