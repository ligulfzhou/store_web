import React, {useEffect} from "react";
import {Form, Input, DatePicker, Col, Button, Select} from "antd";
import useRouterUtils from "@/hooks/useRouterUtils";
import moment from "moment";
import {dateFormat} from "@/utils/const";
import useParameters from "@/hooks/useParameters";
import {CustomerSearchParams} from '@/types/customer'

const {RangePicker} = DatePicker;

const CustomerSearchForm = () => {
    const {removeParams, reloadPage} = useRouterUtils();

    const {
        pageSize,
        ty_pe,
        phone,
        name,
        create_time_st,
        create_time_ed,
    } = useParameters()

    const [form] = Form.useForm();

    useEffect(() => {
        // 用户切换tab时，清掉form
        let values = {}
        if (phone) {
            // @ts-ignore
            values['phone'] = phone
        } else {
            // @ts-ignore
            values['phone'] = undefined
        }

        if (name) {
            // @ts-ignore
            values['name'] = name
        } else {
            // @ts-ignore
            values['name'] = undefined
        }

        // @ts-ignore
        values['ty_pe'] = ty_pe
        if (create_time_ed && create_time_st) {
            // @ts-ignore
            values['create_time'] = [moment(create_time_st, dateFormat), moment(create_time_ed, dateFormat)]
        } else {
            // @ts-ignore
            values['create_time'] = undefined
        }

        form.setFieldsValue(values)
    });

    const doSearch = () => {
        const formParams: {
            name: string | undefined,
            head: string | undefined,
            ty_pe: number,
            phone: string | undefined,
            create_time: moment.Moment[] | undefined
        } = form.getFieldsValue();
        let create_time_st: string | undefined = undefined;
        let create_time_ed: string | undefined = undefined;
        if (formParams.create_time && formParams.create_time.length == 2) {
            create_time_st = formParams.create_time[0].format(dateFormat)
            create_time_ed = formParams.create_time[1].format(dateFormat)
        }
        let params: CustomerSearchParams = {
            create_time_ed: create_time_ed,
            head: formParams.head,
            create_time_st: create_time_st,
            name: formParams.name,
            phone: formParams.phone,
            ty_pe: formParams.ty_pe,
            page: 1,
            pageSize: pageSize
        };

        reloadPage(params)
    }
    const reset = () => {
        let obj: CustomerSearchParams = {
            create_time_ed: undefined,
            create_time_st: undefined,
            name: undefined,
            phone: undefined,
            ty_pe: 0,
            head: undefined,
            page: 1,
            pageSize: pageSize
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
                            label="客户名称"
                            name="name"
                        >
                            <Input/>
                        </Form.Item>

                    </div>
                    <div>
                        <Form.Item
                            label="负责人"
                            name="head"
                        >
                            <Input/>
                        </Form.Item>
                    </div>

                    <div>

                        <Form.Item
                            label="手机号"
                            name="phone"
                        >
                            <Input/>
                        </Form.Item>
                    </div>

                    <div>
                        <Form.Item
                            label="客户类型"
                            name="order_no"
                        >
                            <Select
                                style={{width: 200}}
                                loading
                                options={
                                    [
                                        {
                                            label: '请选择',
                                            value: '',
                                        },
                                        {
                                            label: '普通客户',
                                            value: 1,
                                        },
                                        {
                                            label: 'VIP客户',
                                            value: 2,
                                        }
                                    ]}
                            />
                        </Form.Item>
                    </div>

                    <div className='w-80'>
                        <Form.Item
                            label="创建时间"
                            name="create_time"
                        >
                            <RangePicker/>
                        </Form.Item>
                    </div>

                    <Col span={6}>
                        <Form.Item>
                            <div className='flex flex-row justify-center gap-2'>
                                <Button type="primary" htmlType="submit"
                                        onClick={(event) => {
                                            console.log(form.getFieldsValue())
                                            event.preventDefault()
                                            doSearch()
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

export default CustomerSearchForm
