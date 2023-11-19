import {Button, Space, Table} from 'antd';
import LayoutWithMenu from "@/components/Layouts/LayoutWithMenu";
import React, {useState} from "react";
import {useSWRConfig} from "swr"
import useCates from "@/hooks/useCates";
import {ColumnsType} from "antd/es/table";
import {Cate} from "@/types";
import EditModal from "@/components/items/cates/EditModal";
import SubCatesModal from "@/components/items/cates/SubCatesModal";
import DeleteModal from "@/components/items/cates/DeleteModal";


export default function () {
    const {mutate} = useSWRConfig()
    const [refresh, setRefresh] = useState<boolean>(false)
    const {cates, key, isLoading, isError} = useCates()
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
            title: "子类数",
            dataIndex: "sub_cates",
            render: (_, record) => (
                <div className='flex flex-row gap-4'>
                    {record.sub_cates.length}
                    {record.sub_cates.length > 0 ? (
                        <div>
                            ({record.sub_cates.map(item => item.name).join(",")})
                        </div>
                    ) : null}
                </div>
            )
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
                        setIsSubCatesModalOpen(true)
                    }}>
                        查看子类
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
    const [isSubCatesModalOpen, setIsSubCatesModalOpen] = useState<boolean>(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)

    // const [parentId, setParentId] = useState<number>(0)

    return (
        <LayoutWithMenu>
            <EditModal
                open={isEditModalOpen}
                closeFn={(success) => {
                    setIsEditModalOpen(false)
                    if (success) {
                        setRefresh(true)
                        mutate(key).finally(() => setRefresh(false))
                    }
                }}
                obj={editObj}
                parent_id={parentId}
            />

            <SubCatesModal
                open={isSubCatesModalOpen}
                closeFn={(success) => {
                    if (success) {/* todo */
                    }
                    setIsSubCatesModalOpen(false)
                }}
                parentKey={key}
                obj={editObj}
            />

            <DeleteModal
                open={isDeleteModalOpen}
                closeFn={(success) => {
                    if (success) {/* todo */
                        setRefresh(true)
                        mutate(key).finally(() => setRefresh(false))
                    }
                    setIsDeleteModalOpen(false)
                }}
                obj={editObj}
            />

            <div className='p-5 m-2 bg-white rounded flex flex-row gap-4'>
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
                        setEditObj(undefined)
                        setParentId(0)
                        setIsEditModalOpen(true)
                    }}
                >
                    新增大类
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
        </LayoutWithMenu>
    );
};
