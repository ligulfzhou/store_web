import {Table, Button, Tag, Form, Input, Image, TableColumnsType, message} from 'antd';
import {ColumnsType} from "antd/es/table";
import React, {useState} from "react";
import LayoutWithoutMenu from "@/components/Layouts/LayoutWithoutMenu";
import useSWRMutation from "swr/mutation";
import {getOrderItemProgress, GetOrderItemProgressParam} from "@/requests/order";
import {OneProgress, OrderGoods, OrderItem} from "@/types";
import {
    formatDateTime,
    getColorWithStepAndIndex,
    getDepartmentAndNotesWithStepAndIndex,
    getNotesForOneProgress
} from "@/utils/utils";
import MarkProgressModal from "@/components/order/MarkProgressModal";
import RevokeProgressModal from "@/components/order/RevokeProgressModal";


export default function Index() {
    const [orderGoodsId, setOrderGoodsId] = useState<number>(0)
    const [orderItemId, setOrderItemId] = useState<number>(0)
    const [currentStep, setCurrentStep] = useState<number>(0)

    const openMarkProgressModal = (params: {
        order_goods_id: number,
        order_item_id: number,
        currentStep: number,
    }) => {
        setIsOpenMarkProgressModal(true)
        setOrderGoodsId(params.order_goods_id)
        setOrderItemId(params.order_item_id)
        setCurrentStep(params.currentStep)
    }
    const [isOpenMarkProgressModal, setIsOpenMarkProgressModal] = useState<boolean>(false);

    const [isOpenRevokeProgressModal, setIsOpenRevokeProgressModal] = useState<boolean>(false);
    const [progressToTrigger, setProgressToTrigger] = useState<OneProgress | undefined>(undefined)

    const triggerRevokeProgressModal = (progress: OneProgress) => {
        setIsOpenRevokeProgressModal(true)
        setProgressToTrigger(progress)
    }

    const columns: ColumnsType<OrderGoods> = [
        {
            title: "商品编号",
            dataIndex: "goods_no",
        },
        {
            title: "名称",
            dataIndex: "name",
        },
        {
            title: "商品",
            dataIndex: "image",
            width: "150px",
            render: (_, record) => (
                <Image.PreviewGroup>
                    <div className='flex flex-row gap-1'>
                        {record.images.map((image_url, index) => (
                            <Image
                                key={`image-${index}`}
                                width={60}
                                height={60}
                                src={image_url}
                                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="/>
                        ))}
                    </div>
                </Image.PreviewGroup>
            )
        },
        {
            title: "包装卡片",
            dataIndex: "package_card",
            width: "80px",
            render: (_, record) => (
                <Image
                    width={60}
                    height={60}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                    src={record.package_card}/>
            )
        },
        {
            title: "包装卡片说明",
            dataIndex: "package_card_des",
        },
        {
            title: "流程进度",
            dataIndex: "step_count",
            render: (_, record) => {
                return (
                    <>
                        {record.steps.map(step => (
                            <Tag
                                key={`${record.id}-${step.step}-${step.index}`}
                                color={getColorWithStepAndIndex(step.step, step.index)}
                            >
                                <div className='text-black'>
                                    {getDepartmentAndNotesWithStepAndIndex(step.step, step.index)}: {step.count}
                                </div>
                            </Tag>
                        ))}
                    </>
                )
            }
        },
        {
            title: "操作",
            dataIndex: "action",
            render: (_, record) => {
                return (
                    <>
                        {record.is_next_action ? (
                            <a href='#' onClick={() => {
                                openMarkProgressModal({
                                    order_goods_id: record.id,
                                    order_item_id: 0,
                                    currentStep: record.current_step
                                })
                            }}>
                                标记流程
                            </a>
                        ) : null}
                    </>
                )
            }
        },
    ]
    const expandableColumns: TableColumnsType<OrderItem> = [
        {
            title: "sku_no",
            dataIndex: "sku_no",
        },
        {
            title: "颜色",
            dataIndex: "color",
            width: "120px",
        },
        {
            title: "数量",
            dataIndex: "count",
            width: "120px",
        },
        {
            title: "单位",
            dataIndex: "unit",
        },
        {
            title: "单价",
            dataIndex: "unit_price",
        },
        {
            title: "总价",
            dataIndex: "total_price",
        },
        {
            title: "流程进度",
            dataIndex: "steps",
            render: (_, record) => {
                return (
                    <>
                        {record.steps.map((step, index) => (
                            <div
                                key={`${step.id}`}
                                className=''
                            >
                                <div className='inline-block'>
                                    {formatDateTime(new Date(step.dt))}: {step.account_name}({step.department}): {getNotesForOneProgress(step)}
                                    {index == record.steps.length - 1 ? (
                                        <a href='#' onClick={(event) => {
                                            event.preventDefault()
                                            triggerRevokeProgressModal(step)
                                            console.log("delete progress...")
                                        }}> 撤销 </a>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </>
                )
            }
        },
        {
            title: "操作",
            dataIndex: "action",
            render: (_, record) => {
                return (
                    <>
                        {record.is_next_action ? (
                            <a href='#' onClick={() => {
                                openMarkProgressModal({
                                    order_goods_id: 0,
                                    order_item_id: record.id,
                                    currentStep: record.current_step
                                })
                            }}>
                                标记流程
                            </a>
                        ) : null}
                    </>
                )
            }
        },
    ]

    const [form] = Form.useForm();

    const {
        trigger: callGetOrderItemProgress,
        isMutating: callingGetOrderItemProgress
    } = useSWRMutation('/api/get/order/item/progress', getOrderItemProgress);


    const [orderGoods, setOrderGoods] = useState<OrderGoods[]>([])
    const [param, setParam] = useState<GetOrderItemProgressParam | undefined>(undefined)
    const fetchOrderItemProgress = (values: GetOrderItemProgressParam | undefined = undefined) => {
        let pp: GetOrderItemProgressParam
        if (values) {
            pp = values
        } else if (param) {
            pp = param
        } else {
            message.error("应该不太可能出现")
            return
        }

        callGetOrderItemProgress(pp).then(data => {
            console.log(data)
            if (data.code !== 0) {
                message.error(data.msg)
            } else {
                setOrderGoods(data.data.list)
            }
        })
    }

    const onFinish = (values: GetOrderItemProgressParam) => {
        setParam(values)
        console.log(values)
        fetchOrderItemProgress(values)
    };

    return (
        <LayoutWithoutMenu>
            <div className='p-5 m-2 bg-white rounded'>
                <Form
                    onFinish={onFinish}
                    labelCol={{span: 8}}
                    wrapperCol={{span: 8}}
                    form={form}
                >
                    <Form.Item label="订单号" name="order_no" rules={[{required: true}]}>
                        <Input/>
                    </Form.Item>

                    <Form.Item label="商品编号" name="goods_no" rules={[{required: true}]}>
                        <Input/>
                    </Form.Item>

                    <div className='flex flex-row justify-center'>
                        <Form.Item label="">
                            <Button type="primary" htmlType="submit">
                                查询
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </div>

            <div className='p-5 m-2 bg-white rounded overflow-auto'>
                <MarkProgressModal
                    open={isOpenMarkProgressModal}
                    closeFn={(success) => {
                        setIsOpenMarkProgressModal(false)
                        if (success) {
                            fetchOrderItemProgress()
                        }
                    }}
                    order_goods_id={orderGoodsId}
                    order_item_id={orderItemId}
                    currentStep={currentStep}
                />

                <RevokeProgressModal
                    open={isOpenRevokeProgressModal}
                    closeFn={(success) => {
                        setIsOpenRevokeProgressModal(false)
                        if (success) {
                            fetchOrderItemProgress()
                        }
                    }}
                    progress={progressToTrigger}
                />
                <Table
                    rowKey={'id'}
                    className='mx-1 overflow-auto'
                    size={"small"}
                    loading={callingGetOrderItemProgress}
                    bordered={true}
                    columns={columns}
                    dataSource={orderGoods}
                    pagination={false}
                    expandable={{
                        defaultExpandAllRows: true,
                        columnTitle: "查看SKU",
                        expandedRowRender: ((record, index, indent, expanded) => (
                            <div
                                key={`${record.id}-${index}`}
                                className='p-2'>
                                <Table
                                    size={"small"}
                                    rowKey={`${record.id}-${index}`}
                                    bordered={true}
                                    pagination={false}
                                    dataSource={record.items}
                                    columns={expandableColumns}
                                />
                            </div>
                        ))
                    }}
                />
            </div>
        </LayoutWithoutMenu>
    );
};
