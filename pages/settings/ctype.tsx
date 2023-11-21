import {Table, Button} from 'antd';
import LayoutWithMenu from "@/components/Layouts/LayoutWithMenu";
import {ColumnsType} from "antd/es/table";
import React, {useState} from "react";
import {useSWRConfig} from "swr"
import {CustomerTypeSettings} from "@/types/settings";
import EditModal from "@/components/settings/ctype/EditModal";
import DeleteModal from "@/components/settings/ctype/DeleteModal";
import useCustomerTypes from "@/hooks/useCustomerTypes";


export default function () {
    const {customerTypes, key, isLoading} = useCustomerTypes()
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
    const {mutate} = useSWRConfig()

    const columns: ColumnsType<CustomerTypeSettings> = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: "客户类型",
            dataIndex: 'ty_pe'
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

                    <a href='#' onClick={(event)=> {
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

    const [refresh, setRefresh] = useState<boolean>(false)
    const [editObj, setEditObj] = useState<CustomerTypeSettings | undefined>()

    return (
        <LayoutWithMenu>
            <EditModal open={isEditModalOpen} closeFn={(success)=> {
                setIsEditModalOpen(false)
                if (success) {
                    setRefresh(true)
                    mutate(key).finally(() => setRefresh(false))
                }
            }} obj={editObj} />

            <DeleteModal open={isDeleteModalOpen} closeFn={(success)=> {
                setIsDeleteModalOpen(false)
                if (success) {
                    setRefresh(true)
                    mutate(key).finally(() => setRefresh(false))
                }
            }} obj={editObj} />

            <div className='p-5 m-2 bg-white rounded'>
                <div className='mb-2 gap-4 flex flex-row justify-start'>
                    <Button
                        className='mb-4'
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
                        className='mb-4'
                        type="primary"
                        onClick={() => {
                            setEditObj(undefined)
                            setIsEditModalOpen(true)
                        }}
                    >
                        添加
                    </Button>
                </div>

                <div className='w-128 h-96 border-2 border-gray-50'>
                    <Table
                        rowKey={`id`}
                        size={"small"}
                        loading={isLoading || refresh}
                        columns={columns}
                        dataSource={customerTypes}
                    />
                </div>

            </div>
        </LayoutWithMenu>
    );
};
