import {Table, Space, Button, Tag} from 'antd';
import LayoutWithMenu from "@/components/Layouts/LayoutWithMenu";
import {ColumnsType} from "antd/es/table";
import useParameters from "@/hooks/useParameters";
import {useState} from "react";
import {useSWRConfig} from "swr";
import StockOutModal from "@/components/stock/StockOutModal";
import useItemInoutGroupList from "@/hooks/useItemInoutGroupList";
import {ItemInoutBucket} from "@/types/item";


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
            title: "出/入库",
            dataIndex: "in_true_out_false",
            render: (_, record) => (
                <div>
                    {record.in_true_out_false? "入库": "出库"}
                </div>
            )
        },
        {
            title: "数量",
            dataIndex: "total_count",
            render: (_, record)=> (
                <div>
                    {Math.abs(record.total_count)}
                </div>
            )
        },
        {
            title: "金额",
            dataIndex: "total_sum",
            render: (_, record)=> (
                <div>
                    {Math.abs(parseInt(String(record.total_sum / 1000)))} (元)
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

    const [isStockOutModalOpen, setIsStockOutModalOpen] = useState<boolean>(false)

    return (
        <LayoutWithMenu>
            <StockOutModal open={isStockOutModalOpen} closeFn={(success)=> {
                setIsStockOutModalOpen(false)
                console.log('stock-out-modal closed...')
                if (success) {
                    console.log('success......')
                    mutate(key).finally(() => setRefresh(false))
                }
            }} />

            <div className='p-5 m-2 bg-white rounded flex flex-row gap-2'>
                <Button
                    loading={refresh}
                    onClick={() => {
                        setRefresh(true)
                        mutate(key).finally(() => setRefresh(false))
                    }}
                    type="primary">
                    刷新
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
