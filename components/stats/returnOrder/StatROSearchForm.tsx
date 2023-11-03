import React, {FC, useEffect} from "react";
import {Form, Col, Button, Select} from "antd";
import useRouterUtils from "@/hooks/useRouterUtils";
import useParameters from "@/hooks/useParameters";

interface StatROSearchParms {
    // ro_search: string|undefined,
    customer_no: string|undefined,
    page: number,
    pageSize: number,
}

const OrderSearchForm: FC = () => {
    const {removeParams, reloadPage} = useRouterUtils();
    const {pageSize, ro_search, customer_no} = useParameters()
    const [form] = Form.useForm();

    useEffect(() => {
        // 用户切换tab时，清掉form
        let values = {}
        // if (ro_search) {
        //     // @ts-ignore
        //     values['ro_search'] = ro_search
        // } else {
        //     // @ts-ignore
        //     values['ro_search'] = undefined
        // }

        if (ro_search) {
            // @ts-ignore
            values['customer_no'] = customer_no
        } else {
            // @ts-ignore
            values['customer_no'] = ''
        }
        form.setFieldsValue(values)
    });

    const searchOrders = () => {
        const formParams: {
            ro_search: string | undefined,
            customer_no: string | undefined,
        } = form.getFieldsValue();

        let params: StatROSearchParms = {
            customer_no: formParams['customer_no'] || '',
            // ro_search: formParams['ro_search'],
            page: 1,
            pageSize: pageSize
        }

        reloadPage(params)
    }
    const reset = () => {
        let obj: StatROSearchParms = {
            customer_no: '',
            // ro_search: '',
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
                    {/*<div className='w-80'>*/}
                    {/*    <Form.Item*/}
                    {/*        label="类型"*/}
                    {/*        name="ro_search"*/}
                    {/*    >*/}
                    {/*        <Select*/}
                    {/*            options={[*/}
                    {/*                {*/}
                    {/*                    value: 'goods',*/}
                    {/*                    label: '款式',*/}
                    {/*                },*/}
                    {/*                {*/}
                    {/*                    value: 'items',*/}
                    {/*                    label: '款式+颜色',*/}
                    {/*                },*/}
                    {/*            ]}*/}
                    {/*        />*/}
                    {/*    </Form.Item>*/}
                    {/*</div>*/}

                    <div className='w-80'>
                        <Form.Item
                            label="客户"
                            name="customer_no"
                        >
                            <Select
                                options={[
                                    {
                                        value: '',
                                        label: '全部客户',
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
