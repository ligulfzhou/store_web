import {Table, Button, Image} from 'antd';
import LayoutWithMenu from "@/components/Layouts/LayoutWithMenu";
import {ColumnsType} from "antd/es/table";
import useRouterUtils from "@/hooks/useRouterUtils";
import useParameters from "@/hooks/useParameters";
import {defaultPageSize} from "@/utils/const";
import React, {useState} from "react";
import {useSWRConfig} from "swr"
import EditModal from "@/components/items/embryo/EditModal";
import {formatDateTime} from "@/utils/utils";
import ExcelImporter from "@/components/uploader/ExcelImporter";
import {fallbackImage} from "@/utils/b64";
import useEmbryos from "@/hooks/useEmbryos";
import {Embryo} from "@/types/embryo";
import SearchForm from "@/components/items/embryo/SearchForm";
import StorageModal from "@/components/items/embryo/StorageModal";


export default function Index() {
    const {page, pageSize} = useParameters()
    const {embryos, total, isLoading, key} = useEmbryos();
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
    const {reloadPage} = useRouterUtils()
    const {mutate} = useSWRConfig()

    const columns: ColumnsType<Embryo> = [
        {
            title: 'ID',
            dataIndex: 'id',
        },

        {
            title: "图片",
            dataIndex: "image",
            width: "80px",
            render: (_, record) => (
                <Image.PreviewGroup>
                    <div className='flex flex-row gap-1'>
                        {record.images.map((image_url, index) => (
                            <Image
                                key={`image-${index}`}
                                width={24}
                                height={24}
                                src={image_url}
                                fallback={fallbackImage}/>
                        ))}
                    </div>
                </Image.PreviewGroup>
            )
        },
        {
            title: "编号",
            dataIndex: "number"
        },
        {
            title: '名称',
            dataIndex: 'name',
        },
        {
            title: "颜色",
            dataIndex: "color"
        },
        {
            title: "单位",
            dataIndex: "unit"
        },
        {
            title: '备注',
            dataIndex: "notes",
        },
        {
            title: '创建时间',
            key: 'create_time',
            render: (_, record) => (
                <div>
                    {formatDateTime(new Date(record.create_time))}
                </div>
            )
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <div className='flex flex-row gap-3'>
                    <a href='#' onClick={(event) => {
                        event.preventDefault()
                        setEditItem(record)
                        setIsEditModalOpen(true)
                    }}>
                        查看
                    </a>
                    <a href='#' onClick={(event) => {
                        event.preventDefault()
                        setEditItem(record)
                        setIsEditModalOpen(true)
                    }}>
                        增减数量
                    </a>
                </div>
            ),
        },
    ];

    const [refresh, setRefresh] = useState<boolean>(false)
    const [editItem, setEditItem] = useState<Embryo | undefined>()

    const [isStorageModalOpen, setIsStorageModalOpen] = useState<boolean>(false)

    const refreshPage = ()=> {
        setRefresh(true)
        mutate(key).finally(() => setRefresh(false))
    }

    return (
        <LayoutWithMenu>
            <EditModal
                open={isEditModalOpen}
                closeFn={(success) => {
                    setIsEditModalOpen(false)
                    if (success) {
                        refreshPage()
                    }
                }}
                obj={editItem}
            />

            <StorageModal open={isStorageModalOpen} closeFn={(success)=> {
                setIsStorageModalOpen(false)
                if(success) {
                    refreshPage()
                }
            }} obj={editItem}/>
            {/*filters*/}
            <div className='bg-white p-5 m-2 rounded'>
                <SearchForm/>
            </div>

            <div className='p-5 m-2 bg-white rounded'>
                <div className='mb-2 gap-4 flex flex-row justify-start'>
                    <Button
                        className='mb-4'
                        loading={refresh}
                        type="primary"
                        onClick={() => {
                            refreshPage()
                        }}
                    >
                        刷新
                    </Button>

                    <Button
                        className='mb-4'
                        type="primary"
                        onClick={() => {
                            setEditItem(undefined)
                            setIsEditModalOpen(true)
                        }}
                    >
                        添加
                    </Button>

                    <ExcelImporter callback={() => {
                        refreshPage()
                    }} tp='embryo'/>
                </div>

                <Table
                    rowKey={'id'}
                    bordered={true}
                    size={"small"}
                    loading={isLoading || refresh}
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
                    dataSource={embryos}
                />
            </div>
        </LayoutWithMenu>
    );
};
