import {Table, Button, Image} from 'antd';
import LayoutWithMenu from "@/components/Layouts/LayoutWithMenu";
import {ColumnsType} from "antd/es/table";
import useRouterUtils from "@/hooks/useRouterUtils";
import useParameters from "@/hooks/useParameters";
import {defaultPageSize} from "@/utils/const";
import React, {useState} from "react";
import {useSWRConfig} from "swr"
import EditModal from "@/components/items/item/EditModal";
import CustomerSearchForm from "@/components/customer/CustomerSearchForm";
import {formatDateTime} from "@/utils/utils";
import useItems from "@/hooks/useItems";
import {Item} from "@/types/item";
import ExcelImporter from "@/components/uploader/ExcelImporter";
import {fallbackImage} from "@/utils/b64";


export default function Index() {
    const {page, pageSize} = useParameters()
    const {items, total, isLoading, key} = useItems();
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
    const {reloadPage} = useRouterUtils()
    const {mutate} = useSWRConfig()

    // @ts-ignore
    const columns: ColumnsType<Item> = [
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
            title: '产品名',
            dataIndex: 'name',
        },
        {
            title: "货号",
            dataIndex: "goods_no"
        },
        {
            title: '类别',
            dataIndex: 'head',
            render: (_, record) => (
                <div>
                    {record.cates1 && record.cates2 ? (
                        <>
                            {record.cates1}, {record.cates2}
                        </>
                    ) : null}
                </div>
            )
        },
        {
            title: "售价",
            dataIndex: "sell_price"
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
            title: '备注',
            dataIndex: "notes",
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <a href='#' onClick={(event) => {
                    event.preventDefault()
                    setEditItem(record)
                    setIsEditModalOpen(true)
                }}>
                    查看
                </a>
            ),
        },
    ];

    const [refresh, setRefresh] = useState<boolean>(false)
    const [editItem, setEditItem] = useState<Item | undefined>()

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
                obj={editItem}
            />

            {/*filters*/}
            <div className='bg-white p-5 m-2 rounded'>
                <CustomerSearchForm/>
            </div>

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
                            setEditItem(undefined)
                            setIsEditModalOpen(true)
                        }}
                    >
                        添加
                    </Button>

                    <ExcelImporter callback={() => {
                        console.log('.........')
                    }} tp='item'/>
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
                    dataSource={items}
                />
            </div>
        </LayoutWithMenu>
    );
};
