import React, {FC, useState} from "react";
import {Modal, Button, Table} from "antd";
import {useSWRConfig} from "swr";
import {ColumnsType} from "antd/es/table";
import {EmbryoInout, ItemInout} from "@/types/embryo";
import useRouterUtils from "@/hooks/useRouterUtils";
import {viaToString} from "@/utils/stock";
import useParameters from "@/hooks/useParameters";
import useEmbryoInoutsOfBucket from "@/hooks/useEmbryoInoutsOfBucket";


interface Props {
    open: boolean,
    closeFn: (success: boolean) => void,
    bucketId: number | undefined,
}

const InoutListOfBucketModal: FC<Props> = (
    {
        open,
        closeFn,
        bucketId,
    }
) => {
    const {mutate} = useSWRConfig()
    const {mpage, mpageSize} = useParameters()
    const [refresh, setRefresh] = useState<boolean>(false)
    const {reloadPage, removeParams} = useRouterUtils()
    const {inouts, key, isLoading, total} = useEmbryoInoutsOfBucket(bucketId || 0)

    const columns: ColumnsType<EmbryoInout> = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: "名称",
            dataIndex: "name",
            render: (_, record) => (
                <div>
                    {record.embryo_name}
                </div>
            )
        },
        {
            title: "出/入库",
            dataIndex: "name",
            render: (_, record) => (
                <div>
                    {record.in_true_out_false ? "入库" : "出库"}
                </div>
            )
        },
        {
            title: "编号",
            dataIndex: "number",
        },
        {
            title: "条码",
            dataIndex: "barcode",
        },
        {
            title: "数量",
            dataIndex: "name",
            render: (_, record) => (
                <div>
                    {Math.abs(record.count / 10)} ({record.unit})
                </div>
            )
        },
        {
            title: "经手人",
            dataIndex: "name",
            render: (_, record) => (
                <div>
                    {record.account}
                </div>
            )
        },
        {
            title: "方式：(导入/手动/订单)",
            dataIndex: "name",
            render: (_, record) => (
                <div>
                    {viaToString(record.via)}
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
                width={'1200px'}
                open={open}
                centered={true}
                title='查看出入库'
                onCancel={(e) => {
                    e.preventDefault()
                    closeFn(false)
                    removeParams(['mpage', 'mpageSize'])
                }}
                footer={null}
                closable={true}
            >
                <div className='flex flex-row gap-4'>
                    <Button
                        loading={refresh}
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
                        dataSource={inouts}
                        pagination={{total: total, current: mpage, pageSize: mpageSize}}
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

export default InoutListOfBucketModal
