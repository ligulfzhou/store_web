import React, {FC, useState} from "react";
import {Modal, Button, Table, message} from "antd";
import {Cate} from "@/types";
import useSubCates from "@/hooks/useSubCates";
import {useSWRConfig} from "swr";
import {ColumnsType} from "antd/es/table";
import EditModal from "@/components/items/cates/EditModal";
import DeleteModal from "@/components/items/cates/DeleteModal";


interface Props {
    open: boolean,
    closeFn: (success: boolean) => void,
    obj: Cate | undefined,
    parentKey: string
}

const SubCatesModal: FC<Props> = (
    {
        open,
        closeFn,
        obj,
        parentKey
    }
) => {

    const {cates, key, isLoading} = useSubCates(obj?.id || 0)
    const {mutate} = useSWRConfig()
    const [refresh, setRefresh] = useState<boolean>(false)
    console.log(cates)

    const columns: ColumnsType<Cate> = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: "类名",
            dataIndex: "name",
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <div className='flex flex-row gap-2'>
                    <a href='#' onClick={(event) => {
                        event.preventDefault()
                        setEditObj(record)
                        setIsEditModalOpen(true)
                    }}>
                        查看
                    </a>

                    <a href='#' onClick={(event) => {
                        event.preventDefault()
                        setEditObj(record)
                        setIsDeleteModalOpen(true)
                    }}>
                        删除
                    </a>
                </div>
            ),
        },
    ];
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
    const [editObj, setEditObj] = useState<Cate | undefined>(undefined)
    const [parentId, setParentId] = useState<number>(0)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)

    return (
        <div>
            <DeleteModal
                open={isDeleteModalOpen}
                closeFn={(success) => {
                    if (success) {/* todo */
                        setRefresh(true)
                        mutate(key).finally(() => setRefresh(false))
                        mutate(parentKey).then(r => null)
                    }
                    setIsDeleteModalOpen(false)
                }}
                obj={editObj}
            />

            <Modal
                width={'1000px'}
                open={open}
                centered={true}
                title={`查看'${obj?.name + "'"+'的'||''}子类`}
                onCancel={(e) => {
                    e.preventDefault()
                    closeFn(false)
                }}
                footer={null}
                closable={true}
            >
                <EditModal
                    open={isEditModalOpen}
                    closeFn={(success) => {
                        setIsEditModalOpen(false)
                        if (success) {
                            setRefresh(true)
                            mutate(parentKey).then(r => null)
                            mutate(key).finally(() => setRefresh(false))
                        }
                    }}
                    obj={editObj}
                    parent_id={parentId}
                />

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

                    <Button
                        loading={refresh}
                        type="primary"
                        onClick={() => {
                            if (!obj) {
                                message.error("请关掉所有弹框重试")
                                return
                            }

                            setEditObj(undefined)
                            setParentId(obj?.id)
                            setIsEditModalOpen(true)
                        }}
                    >
                        新增小类
                    </Button>
                </div>

                <div className='p-5 m-2 bg-white rounded'>
                    <Table
                        rowKey={`id`}
                        size={"small"}
                        loading={isLoading || refresh}
                        columns={columns}
                        dataSource={cates}
                    />
                </div>
            </Modal>
        </div>
    );
}

export default SubCatesModal
