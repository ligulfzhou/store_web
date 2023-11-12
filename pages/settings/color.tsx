import {Table, Button} from 'antd';
import LayoutWithMenu from "@/components/Layouts/LayoutWithMenu";
import {ColumnsType} from "antd/es/table";
import React, {useState} from "react";
import {useSWRConfig} from "swr"
import useColorValue from "@/hooks/useColorValue";
import {ColorToValue} from "@/types/settings";
import EditModal from "@/components/settings/color/EditModal";


export default function () {
    const {colorValues, key, isLoading} = useColorValue()
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
    const {mutate} = useSWRConfig()

    const columns: ColumnsType<ColorToValue> = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: "颜色",
            dataIndex: 'color'
        },
        {
            title: '对应数值',
            dataIndex: 'value',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <a href='#' onClick={(event) => {
                    event.preventDefault()
                    setEditObj(record)
                    setIsEditModalOpen(true)
                }}>
                    查看
                </a>
            ),
        },
    ];

    const [refresh, setRefresh] = useState<boolean>(false)
    const [editObj, setEditObj] = useState<ColorToValue | undefined>()

    return (
        <LayoutWithMenu>
            <EditModal open={isEditModalOpen} closeFn={(success)=> {
                setIsEditModalOpen(false)
                if (success) {
                    setRefresh(true)
                    mutate(key).finally(() => setRefresh(false))
                }
            }} colorValue={editObj} />
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
                        dataSource={colorValues}
                    />
                </div>

            </div>
        </LayoutWithMenu>
    );
};
