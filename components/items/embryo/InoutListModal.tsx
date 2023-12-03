import React, {FC, useState} from "react";
import {Modal, Button, Table} from "antd";
import {useSWRConfig} from "swr";
import {ColumnsType} from "antd/es/table";
import {Embryo, EmbryoInout} from "@/types/embryo";
import useEmbryoInouts from "@/hooks/useEmbryoInouts";
import useRouterUtils from "@/hooks/useRouterUtils";
import {viaToString} from "@/utils/stock";


interface Props {
    open: boolean,
    closeFn: (success: boolean) => void,
    obj: Embryo | undefined,
}

const InoutListModal: FC<Props> = (
    {
        open,
        closeFn,
        obj,
    }
) => {
    const {inouts, key, isLoading} = useEmbryoInouts(obj?.id || 0)
    const {mutate} = useSWRConfig()
    const [refresh, setRefresh] = useState<boolean>(false)
    const {reloadPage} = useRouterUtils()

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
                    {record.embryo.name}
                </div>
            )
        },
        {
            title: "出/入库",
            dataIndex: "name",
            render: (_, record) => (
                <div>
                    {record.in_true_out_false ? "入库": "出库"}
                </div>
            )
        },
        {
            title: "数量",
            dataIndex: "name",
            render: (_, record) => (
                <div>
                    {record.count}
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
                width={'750px'}
                open={open}
                centered={true}
                title={`查看'${obj?.name + "'" + '的' || ''}出入库`}
                onCancel={(e) => {
                    e.preventDefault()
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

export default InoutListModal
