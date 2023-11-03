import React, {FC, useEffect} from "react";
import {Form, Input, DatePicker, Checkbox, Col, Button} from "antd";
import useRouterUtils from "@/hooks/useRouterUtils";
import moment from "moment";
import {OrderSearchParms} from "@/types";
import {dateFormat} from "@/utils/const";
import useParameters from "@/hooks/useParameters";

const {RangePicker} = DatePicker;

interface Props {
    customerNo: string
}

const OrderSearchForm: FC<Props> = (
    {
        customerNo
    }
) => {
    const {removeParams, reloadPage} = useRouterUtils();

    const {
        pageSize,
        order_no, order_date_start, order_date_end, delivery_date_start, delivery_date_end, is_return_order, is_urgent
    } = useParameters()

    const [form] = Form.useForm();

    useEffect(() => {
        // 用户切换tab时，清掉form
        let values = {}
        if (order_no) {
            // @ts-ignore
            values['order_no'] = order_no
        } else {
            // @ts-ignore
            values['order_no'] = undefined
        }
        if (order_date_start && order_date_end) {
            // @ts-ignore
            values['order_date'] = [moment(order_date_start, dateFormat), moment(order_date_end, dateFormat)]
        } else {
            // @ts-ignore
            values['order_date'] = undefined
        }
        if (delivery_date_start && delivery_date_end) {
            // @ts-ignore
            values['delivery_date'] = [moment(delivery_date_start, dateFormat), moment(delivery_date_end, dateFormat)]
        } else {
            // @ts-ignore
            values['delivery_date'] = undefined
        }
        if (is_urgent) {
            // @ts-ignore
            values['is_urgent'] = true
        } else {
            // @ts-ignore
            values['is_urgent'] = undefined
        }
        if (is_return_order) {
            // @ts-ignore
            values['is_return_order'] = true
        } else {
            // @ts-ignore
            values['is_return_order'] = undefined
        }

        form.setFieldsValue(values)
    }, [customerNo]);

    const searchOrders = () => {
        const formParams: {
            order_no: string | undefined,
            is_return_order: boolean | undefined,
            is_special: boolean | undefined,
            is_urgent: boolean | undefined,
            order_date: moment.Moment[] | undefined,
            delivery_date: moment.Moment[] | undefined,
        } = form.getFieldsValue();
        let order_date_start: string | undefined = undefined;
        let order_date_end: string | undefined = undefined;
        if (formParams.order_date && formParams.order_date.length == 2) {
            order_date_start = formParams.order_date[0].format(dateFormat)
            order_date_end = formParams.order_date[1].format(dateFormat)
        }

        let delivery_date_start: string | undefined = undefined;
        let delivery_date_end: string | undefined = undefined;
        if (formParams.delivery_date && formParams.delivery_date.length == 2) {
            delivery_date_start = formParams.delivery_date[0].format(dateFormat)
            delivery_date_end = formParams.delivery_date[1].format(dateFormat)
        }
        let params: OrderSearchParms = {
            delivery_date_end,
            delivery_date_start,
            order_date_end,
            order_date_start,
            is_return_order: formParams['is_return_order'],
            is_urgent: formParams['is_urgent'],
            is_special: formParams['is_special'],
            order_no: formParams['order_no'],
            page: 1,
            pageSize: pageSize,
        }

        reloadPage(params)
    }
    const reset = () => {
        let obj: OrderSearchParms = {
            delivery_date_end: "",
            delivery_date_start: "",
            is_return_order: false,
            is_urgent: false,
            is_special: false,
            order_date_end: "",
            order_date_start: "",
            order_no: "",
            page: 1,
            pageSize: pageSize,
        }
        removeParams(Object.keys(obj))
        form.resetFields()
    }

    return (
        <div>
            <Form
                form={form}
                name="basic"
                layout={'horizontal'}
            >
                <div className='flex flex-row justify-around flex-wrap items-start'>
                    <div className='w-80'>
                        <Form.Item
                            label="订单编号"
                            name="order_no"
                        >
                            <Input placeholder={'订单编号'}/>
                        </Form.Item>
                    </div>

                    <div className='w-80'>
                        <Form.Item
                            label="下单时间"
                            name="order_date"
                        >
                            <RangePicker/>
                        </Form.Item>
                    </div>

                    <div className='w-80'>
                        <Form.Item
                            label="交付时间"
                            name="delivery_date"
                        >
                            <RangePicker/>
                        </Form.Item>
                    </div>
                    <div className='w-80 flex flex-row items-center gap-2 justify-center'>
                        <div className='w-25'>
                            <Form.Item
                                label="返单"
                                name="is_return_order"
                                valuePropName='checked'
                            >
                                <Checkbox/>
                            </Form.Item>
                        </div>
                        <div className='w-25'>
                            <Form.Item
                                label="加急"
                                name="is_urgent"
                                valuePropName='checked'
                            >
                                <Checkbox/>
                            </Form.Item>
                        </div>
                        <div className='w-25'>
                            <Form.Item
                                label="特别客人"
                                name="is_special"
                                valuePropName='checked'
                            >
                                <Checkbox/>
                            </Form.Item>
                        </div>
                    </div>
                    <Col span={6}>
                        <Form.Item>
                            <div className='flex flex-row justify-center gap-2'>
                                <Button type="primary" htmlType="submit"
                                        onClick={(event) => {
                                            console.log(form.getFieldsValue())
                                            event.preventDefault()
                                            searchOrders()
                                        }}>
                                    搜索
                                </Button>

                                <Button
                                    htmlType="submit"
                                    onClick={() => {
                                        reset()
                                    }}>
                                    重置
                                </Button>
                            </div>
                        </Form.Item>
                    </Col>
                </div>
            </Form>
        </div>
    )
}

export default OrderSearchForm
