import {Table, Button, Image} from 'antd';
import LayoutWithMenu from "@/components/Layouts/LayoutWithMenu";
import {ColumnsType} from "antd/es/table";
import useRouterUtils from "@/hooks/useRouterUtils";
import useParameters from "@/hooks/useParameters";
import {defaultPageSize} from "@/utils/const";
import React, {useState} from "react";
import {useSWRConfig} from "swr"
import EditModal from "@/components/items/item/EditModal";
import {formatDateTime} from "@/utils/utils";
import useItems from "@/hooks/useItems";
import {Item} from "@/types/item";
import ExcelImporter from "@/components/uploader/ExcelImporter";
import {fallbackImage} from "@/utils/b64";
import SearchForm from "@/components/items/item/SearchForm";
import StorageModal from "@/components/items/item/StorageModal";
import EmbryoStorageModal from "@/components/items/embryo/StorageModal";
import InoutListModal from "@/components/items/item/InoutListModal";
import EmbryoInoutListModal from "@/components/items/embryo/InoutListModal";
import {Embryo} from "@/types/embryo";
import BarcodeModal from "@/components/BarcodeModal";


export default function Index() {
    const {page, pageSize} = useParameters()
    const {items, total, isLoading, key} = useItems();
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
    const {reloadPage} = useRouterUtils()
    const {mutate} = useSWRConfig()

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
                                width={96}
                                height={96}
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
            title: '电镀/颜色',
            dataIndex: 'color',
        },
        {
            title: '规格',
            dataIndex: 'size',
        },
        {
            title: "货号",
            dataIndex: "number"
        },
        {
            title: "条码",
            dataIndex: "barcode"
        },
        {
            title: '类别',
            dataIndex: 'cates',
            render: (_, record) => (
                <div>
                    {record.cate1 || record.cate2 ? (
                        <>
                            {record.cate1 || ''}, {record.cate2 || ''}
                        </>
                    ) : null}
                </div>
            )
        },
        {
            title: "售价",
            dataIndex: "price",
            render: (_, record) => (
                <div>
                    {record.price / 100}
                </div>
            )
        },
        {
            title: "库存",
            dataIndex: "count",
            render: (_, record) => (
                <div>
                    <a href='#' onClick={(event) => {
                        event.preventDefault()
                        setEditItem(record)
                        setIsInoutListModalOpen(true)
                    }}>
                        {record.count / 10} ({record.unit})
                    </a>
                </div>
            )
        },
        {
            title: "库存胚",
            dataIndex: "embryo",
            render: (_, record) => (
                <div>
                    {record.embryo ? (
                        <div className='flex flex-row'>
                            <Image.PreviewGroup>
                                <div className='flex flex-row gap-1'>
                                    {record.embryo.images.map((image_url, index) => (
                                        <Image
                                            key={`image-${index}`}
                                            width={24}
                                            height={24}
                                            src={image_url}
                                            fallback={fallbackImage}/>
                                    ))}
                                </div>
                            </Image.PreviewGroup>
                            <div>
                                {record.embryo.name}:
                            </div>
                            <div>
                                <a href='#' onClick={(env) => {
                                    env.preventDefault()
                                    setEditEmbryoItem(record.embryo)
                                    setIsEmbryoInoutListModalOpen(true)
                                }}>
                                    {record.embryo.count} ({record.embryo.unit})
                                </a>
                            </div>

                            <div className='ml-3'>
                                <a href='#' onClick={(env) => {
                                    env.preventDefault()
                                    setEditEmbryoItem(record.embryo)
                                    setIsEmbryoStorageModalOpen(true)
                                }}>
                                    出入库
                                </a>
                            </div>

                        </div>
                    ) : null}
                </div>
            )
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
                        setIsStorageModalOpen(true)
                    }}>
                        出入库
                    </a>

                    <a href='#' onClick={(event) => {
                        event.preventDefault()
                        setEditItem(record)
                        setIsInoutListModalOpen(true)
                    }}>
                        查看出入库列表
                    </a>

                    <a href='#' onClick={(event) => {
                        event.preventDefault()
                        setBarcodeValue(record.barcode)
                        setIsbarcodeOpen(true)
                    }}>
                        条码
                    </a>
                </div>
            ),
        },
    ];

    const [refresh, setRefresh] = useState<boolean>(false)
    const [editItem, setEditItem] = useState<Item | undefined>()
    const [editEmbryoItem, setEditEmbryoItem] = useState<Embryo | undefined>()

    const [isStorageModalOpen, setIsStorageModalOpen] = useState<boolean>(false)
    const [isEmbryoStorageModalOpen, setIsEmbryoStorageModalOpen] = useState<boolean>(false)

    const [isInoutListModalOpen, setIsInoutListModalOpen] = useState<boolean>(false)
    const [isEmbryoInoutListModalOpen, setIsEmbryoInoutListModalOpen] = useState<boolean>(false)

    const [isbarcodeOpen, setIsbarcodeOpen] = useState<boolean>(false)
    const [barcodeValue, setBarcodeValue] = useState<string>('')

    const refreshPage = () => {
        setRefresh(true)
        mutate(key).finally(() => setRefresh(false))
    }

    return (
        <LayoutWithMenu>
            <InoutListModal open={isInoutListModalOpen} closeFn={() => {
                setIsInoutListModalOpen(false)
            }} obj={editItem}/>

            <EmbryoInoutListModal open={isEmbryoInoutListModalOpen} closeFn={() => {
                setIsEmbryoInoutListModalOpen(false)
            }} obj={editEmbryoItem}/>

            <BarcodeModal open={isbarcodeOpen} closeFn={(success) => {
                setIsbarcodeOpen(false)
            }} text={barcodeValue}/>

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

            <EmbryoStorageModal open={isEmbryoStorageModalOpen} closeFn={() => {
                setIsEmbryoStorageModalOpen(false)
            }} obj={editEmbryoItem}/>

            <StorageModal open={isStorageModalOpen} closeFn={(success) => {
                setIsStorageModalOpen(false)
                if (success) {
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
