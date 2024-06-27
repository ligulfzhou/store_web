import React, {FC, useState} from "react";
import {Modal, Button, Table} from "antd";
import {useSWRConfig} from "swr";
import {ColumnsType} from "antd/es/table";
import {ItemInout} from "@/types/embryo";
import useRouterUtils from "@/hooks/useRouterUtils";
import {viaToString} from "@/utils/stock";
import {Item} from "@/types";
import useItemInouts from "@/hooks/useItemInouts";
import {formatUTCDateTime} from "@/utils/utils";
import useParameters from "@/hooks/useParameters";
import {defaultPageSize} from "@/utils/const";


interface Props {
    open: boolean,
    closeFn: (success: boolean) => void,
    obj: Item | undefined,
}

const InoutListModal: FC<Props> = (
    {
        open,
        closeFn,
        obj,
    }
) => {
    const {total, inouts, key, isLoading} = useItemInouts(obj?.id || 0)
    const {mutate} = useSWRConfig()
    const {mpage, mpageSize} = useParameters()
    const [refresh, setRefresh] = useState<boolean>(false)
    const {reloadPage, removeParams} = useRouterUtils()

    const columns: ColumnsType<ItemInout> = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: "名称",
            dataIndex: "name",
            render: (_, record) => (
                <div>
                    {record.item_name}
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
            title: "数量",
            dataIndex: "name",
            render: (_, record) => (
                <div>
                    {Math.abs(record.count)}
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
                // <div className='text-center w-full'>
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
                    {formatUTCDateTime(record.create_time)}
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
                title={`查看'${obj?.name + "'" + '的' || ''}出入库`}
                onCancel={(e) => {
                    e.preventDefault()
                    removeParams(['mpage', 'mpageSize'])
                    closeFn(false)
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
                        pagination={{
                            total: total,
                            current: mpage,
                            pageSize: mpageSize,
                            defaultPageSize: defaultPageSize,
                            onChange: (thisPage, thisPageSize) => {
                                reloadPage({
                                    page: thisPage,
                                    pageSize: thisPageSize
                                })
                            }
                        }}
                    />
                </div>
            </Modal>
        </div>
    );
}

export default InoutListModal
