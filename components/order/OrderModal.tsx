import React, {FC, useEffect, useState} from "react";
import {Modal, Form, Input, Select, DatePicker, Radio, message, Spin} from "antd";
import useRouterUtils from "@/hooks/useRouterUtils";
import moment from "moment";
import useSWRMutation from "swr/mutation";
import {updateOrder, UpdateOrderParam} from "@/requests/order";
import {Order} from "@/types";
import {dateFormat} from "@/utils/const";


// const dateFormat = 'YYYY-MM-DD';

interface Props {
    open: boolean,
    closeFn: (success: boolean) => void,
    order: Order | undefined,
    orderNo: string,
}

const OrderModal: FC<Props> = (
    {
        open,
        closeFn,
        order,
        orderNo
    }
) => {
    const {removeParams} = useRouterUtils();

    // const {order, isLoading} = useOrderDetail(orderNo)
    const isEdit = !!order;
    const [form] = Form.useForm();

    const [formValues, setFormValues] = useState<UpdateOrderParam | undefined>(undefined)

    useEffect(() => {
        let _formValues: UpdateOrderParam = {
            id: 0,
            customer_no: order?.customer_no ? order.customer_no : '',
            order_no: order?.order_no ? order.order_no : '',
            order_date: order?.order_date ? moment(order.order_date) : undefined,
            delivery_date: order?.delivery_date ? moment(order.delivery_date) : undefined,
            is_return_order: order?.is_return_order ? order.is_return_order : false,
            is_urgent: order?.is_urgent ? order.is_urgent : false,
            is_special: order?.is_special ? order.is_special : false,
            special_customer: order?.special_customer ? order.special_customer : ''
        }
        setFormValues(_formValues)
        form.setFieldsValue(_formValues)
    }, [order])

    const {
        trigger: callUpdateOrderAPI,
        isMutating: callingUpdateOrderAPI
    } = useSWRMutation('/api/order/update', updateOrder)

    const onFinish = (values: UpdateOrderParam) => {
        if (!order?.id) {
            return
        }

        values["id"] = order.id
        if (values['order_date'] && values['order_date'] instanceof moment) {
            values['order_date'] = values['order_date'].format(dateFormat)
        }
        if (values['delivery_date'] && values['delivery_date'] instanceof moment) {
            values['delivery_date'] = values['delivery_date'].format(dateFormat)
        }
        if(!values['is_special']) {
            values['special_customer'] = ''
        }

        callUpdateOrderAPI(values).then((res) => {
            if (res.code == 0) {
                console.log(res)
                message.success("修改成功")
                closeFn(true)
                form.resetFields()
            } else {
                message.error(res.msg)
            }
        })
    };

    return (
        <div>
            <Modal
                width={'400px'}
                open={open}
                centered={true}
                title={`${isEdit ? "编辑" : "添加"}订单`}
                onCancel={(e) => {
                    form.resetFields()
                    removeParams(['order_id', 'order_no'])
                    closeFn(false)
                }}
                closable={true}
                onOk={() => {
                    form.submit()
                }}
                okText={"确定"}
                cancelText={"取消"}
                confirmLoading={callingUpdateOrderAPI}
            >
                <Form
                    form={form}
                    name="basic"
                    layout={'horizontal'}
                    initialValues={formValues}
                    labelCol={{span: 6}}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="客户编号"
                        name="customer_no"
                        // initialValue={curOrder?.customer_no || ""}
                        rules={[{required: true, message: '请输入客户编号!'}]}
                    >
                        <Select
                            options={[
                                {
                                    value: '',
                                    label: '请选择',
                                },
                                {
                                    value: 'L1001',
                                    label: 'L1001',
                                },
                                {
                                    value: 'L1002',
                                    label: 'L1002',
                                },
                                {
                                    value: 'L1003',
                                    label: 'L1003',
                                },
                                {
                                    value: 'L1004',
                                    label: 'L1004',
                                },
                                {
                                    value: 'L1005',
                                    label: 'L1005',
                                },
                                {
                                    value: 'L1006',
                                    label: 'L1006',
                                },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        label="订单编号"
                        name="order_no"
                        rules={[{required: true, message: '请输入订单编号!'}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="下单时间"
                        name="order_date"
                        rules={[{required: true, message: '请选择下单时间!'}]}
                    >
                        <DatePicker/>
                    </Form.Item>

                    <Form.Item
                        label="交付时间"
                        name="delivery_date"
                    >
                        <DatePicker/>
                    </Form.Item>

                    <Form.Item
                        label="返单"
                        name="is_return_order"
                        rules={[{required: true, message: '请选择是否返单!'}]}
                    >
                        <Radio.Group>
                            <Radio value={true}>是</Radio>
                            <Radio value={false}>否</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="加急单"
                        name="is_urgent"
                        rules={[{required: true, message: '请选择是否加急单!'}]}
                    >
                        <Radio.Group>
                            <Radio value={true}>是</Radio>
                            <Radio value={false}>否</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="特别客人单"
                        name="is_special"
                        rules={[{required: true, message: '请选择是否特别客人单!'}]}
                    >
                        <Radio.Group>
                            <Radio value={true}>是</Radio>
                            <Radio value={false}>否</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="特别客人"
                        name="special_customer"
                    >
                        <Input/>
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    )
}

export default OrderModal
