import {Table, Space, Button, Tag} from 'antd';
import LayoutWithMenu from "@/components/Layouts/LayoutWithMenu";
import {ColumnsType} from "antd/es/table";
import useOrders from "@/hooks/useOrders";
import {Order} from '@/types'
import {useRouter} from "next/router";
import {getColorWithStepAndIndex, getDepartmentAndNotesWithStepAndIndex, parseQueryParam} from "@/utils/utils";
import useParameters from "@/hooks/useParameters";
import ExcelImporter from "@/components/uploader/ExcelImporter";
import React, {useState} from "react";
import OrderModal from "@/components/order/OrderModal";
import useRouterUtils from "@/hooks/useRouterUtils";
import OrderGoodsDetailModal from "@/components/order/OrderGoodsDetailModal";
import {useSWRConfig} from "swr";
import OrderSearchForm from "@/components/order/OrderSearchForm";
import DeleteOrderModal from "@/components/order/DeleteOrderModal";

export default function Order() {
    const router = useRouter()
    const {page, pageSize} = useParameters()
    let customerNo = parseQueryParam(router.query.customerNo)
    const {orders, total, isLoading, key} = useOrders(customerNo)
    const [refresh, setRefresh] = useState<boolean>(false);
    const {reloadPage} = useRouterUtils()

    const [order, setOrder] = useState<Order | undefined>();
    const [orderNo, setOrderNo] = useState<string>('');

    const columns: ColumnsType<Order> = [
        {
            title: 'ID',
            dataIndex: 'id',
            sorter: (a, b) => a.id - b.id
        },
        {
            title: "订单编号",
            dataIndex: "order_no",
            sorter: (a, b) => a.order_no.localeCompare(b.order_no),
            render: (text) => (
                <div className='font-medium'>
                    {text}
                </div>
            )
        },
        {
            title: "下单时间",
            dataIndex: "order_date",
            sorter: (a, b) => a.order_date - b.order_date,
        },
        {
            title: "交付时间",
            dataIndex: "delivery_date",
            sorter: (a, b) => a.order_date - b.order_date,
        },
        {
            title: "返单/加急/特别客人",
            key: "return_order_or_urgent",
            dataIndex: 'return_order_or_urgent',
            render: (_, record) => (
                <>
                    {record.is_return_order ? <Tag color='red'
                                                   key={`${record.id}-return`}>返单</Tag> : null}
                    {record.is_urgent ? <Tag className='yellow'
                                             key={`${record.id}-urgent`}>加急单</Tag> : null}
                    {record.is_special ? <Tag className='blue'
                                              key={`${record.id}-speical`}>特别客人: {record.special_customer}</Tag> : null}
                </>
            )
        },

        {
            title: "异常/完成/总(流程数)",
            key: "return_order_or_urgent",
            dataIndex: 'return_order_or_urgent',
            render: (_, record) => (
                <>
                    {record.exception_count}/{record.done_count}/{record.total_count}
                </>
            )
        },
        {
            title: "流程进度",
            key: "step_count",
            dataIndex: 'step_count',
            width: "300px",
            render: (_, record) => (
                <>
                    {record.steps.map(stepIndexCount => (
                        <Tag
                            color={getColorWithStepAndIndex(stepIndexCount.step, stepIndexCount.index)}
                            key={`${record.id}-${stepIndexCount.step}-${stepIndexCount.index}`}>
                            <div className='text-black'>
                                {getDepartmentAndNotesWithStepAndIndex(stepIndexCount.step, stepIndexCount.index)} {stepIndexCount.count}
                            </div>
                        </Tag>
                    ))}
                </>
            )
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a
                        key={`${record.id}-detail`}
                        href='#'
                        onClick={(event) => {
                            event.preventDefault()
                            showOrderModal(record)
                        }}>
                        查看订单
                    </a>

                    <a
                        key={`${record.id}-items`}
                        href='#'
                        onClick={
                            (event) => {
                                event.preventDefault()
                                showOrderGoodsModal(record)
                            }
                        }>
                        查看订单商品
                    </a>

                    <a
                        key={`${record.id}-delete`}
                        href='#'
                        onClick={(event) => {
                            event.preventDefault()
                            showDeleteOrderModal(record)
                        }}>
                        删除订单
                    </a>
                </Space>
            ),
        },
    ];
    const [openOrderModal, setOpenOrderModal] = useState<boolean>(false)
    const showOrderModal = (record: Order) => {
        console.log(`set order: ${record}, ${record.order_no}`)
        setOpenOrderModal(true)
        setOrder(record)
        setOrderNo(record.order_no)
    }

    const [openOrderGoodsModal, setOpenOrderGoodsModal] = useState<boolean>(false)
    const showOrderGoodsModal = (record: Order) => {
        setOpenOrderGoodsModal(true)
        setOrder(record)
        setOrderNo(record.order_no)
    }
    const {mutate} = useSWRConfig()

    const [openDeleteOrderModal, setOpenDeleteOrderModal] = useState<boolean>(false)

    const showDeleteOrderModal = (record: Order) => {
        setOpenDeleteOrderModal(true)
        setOrder(record)
        setOrderNo(record.order_no)
    }

    return (
        <LayoutWithMenu>
            <DeleteOrderModal
                open={openDeleteOrderModal}
                closeFn={(success) => {
                    setOpenDeleteOrderModal(false)
                    setOpenOrderModal(false)
                    if (success) {
                        setRefresh(true)
                        mutate(key).finally(() => setRefresh(false))
                    }
                }}
                order={order}
                orderNo={orderNo}
            />

            <OrderModal
                open={openOrderModal}
                closeFn={(success) => {
                    setOpenOrderModal(false)
                    if (success) {
                        setRefresh(true)
                        mutate(key).finally(() => setRefresh(false))
                    }
                }}
                order={order}
                orderNo={orderNo}
            />

            <OrderGoodsDetailModal
                open={openOrderGoodsModal}
                closeFn={() => setOpenOrderGoodsModal(false)}
                order={order} orderNo={orderNo}
            />

            {/*filters*/}
            <div className='bg-white p-5 m-2 rounded'>
                <OrderSearchForm customerNo={customerNo}/>
            </div>

            {/* 表格 */}
            <div className='bg-white p-5 m-2 rounded overflow-auto'>
                {/*/!* 按钮 *!/*/}
                <div className='text-black mb-2 flex flex-row gap-2'>
                    <Button
                        loading={refresh}
                        type={'primary'}
                        onClick={() => {
                            setRefresh(true)
                            mutate(key).finally(() => setRefresh(false))
                        }}
                    >
                        刷新
                    </Button>

                    <ExcelImporter callback={() => {
                        setRefresh(true)
                        mutate(key).finally(() => setRefresh(false))
                    }}/>
                </div>

                <Table
                    rowKey={"id"}
                    size={"small"}
                    bordered={true}
                    loading={isLoading || refresh}
                    columns={columns}
                    pagination={{total: total, current: page, pageSize: pageSize}}
                    dataSource={orders}
                    onChange={(pagination, filters, sorter) => {
                        var obj = {
                            page: pagination.current,
                            pageSize: pagination.pageSize,
                            sorter_field: '',
                            sorter_order: '',
                        }
                        if (!Array.isArray(sorter)) {
                            obj['sorter_field'] = sorter.field as string || ''
                            obj['sorter_order'] = sorter.order as string || ''
                        }
                        reloadPage(obj)
                    }}
                />
            </div>
        </LayoutWithMenu>
    );

};
