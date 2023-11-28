import React, {useEffect, useState} from "react";
import {Form, Input, DatePicker, Col, Button, Cascader} from "antd";
import useRouterUtils from "@/hooks/useRouterUtils";
import moment from "moment";
import {dateFormat} from "@/utils/const";
import useParameters from "@/hooks/useParameters";
import {CustomerSearchParams} from '@/types/customer'
import {ItemSearchParams} from '@/types/item'
import {Option} from "@/types";
import useCates from "@/hooks/useCates";

const {RangePicker} = DatePicker;

const SearchForm = () => {
    const {removeParams, reloadPage} = useRouterUtils();

    const {
        pageSize,
        name,
        number,
        barcode,
        cate1_id,
        cate2_id,
        create_time_st,
        create_time_ed,
    } = useParameters()

    const [form] = Form.useForm();

    const [cateOptions, setCateOptions] = useState<Option[]>([])
    const {cates, isLoading: catesLoading} = useCates()

    useEffect(() => {
        if (catesLoading) {
            return
        }

        let ops: Option[] = []
        for (let cate of cates) {
            let op: Option = {
                children: [],
                label: cate.name,
                value: cate.id.toString()
            }

            cate.sub_cates.map(sub_cate => {
                op.children?.push({
                    children: [],
                    label: sub_cate.name,
                    value: sub_cate.id.toString()
                })
            })

            ops.push(op)
        }

        if (ops.length > 0) {
            setCateOptions(ops)
        }

    }, [cates, catesLoading]);


    useEffect(() => {
        // just return when cates not fetched.
        if (cateOptions.length == 0) {
            return
        }

        // 用户切换tab时，清掉form
        let values = {}


        if (name) {
            // @ts-ignore
            values['name'] = name
        } else {
            // @ts-ignore
            values['name'] = undefined
        }

        if (number) {
            // @ts-ignore
            values['number'] = number
        } else {
            // @ts-ignore
            values['number'] = undefined
        }


        if (barcode) {
            // @ts-ignore
            values['barcode'] = barcode
        } else {
            // @ts-ignore
            values['barcode'] = undefined
        }

        if (cate1_id && cate2_id) {
            // @ts-ignore
            values['cates'] = [cate1_id.toString(), cate2_id.toString()]
        } else if (cate1_id) {
            // @ts-ignore
            values['cates'] = [cate1_id.toString()]
        } else {
            // @ts-ignore
            values['cates'] = undefined
        }

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
        console.log(form.getFieldsValue())

        const formParams: {
            name: string | undefined,
            number: string | undefined,
            barcode: string | undefined,
            cates: string[] | undefined,
            create_time: moment.Moment[] | undefined
        } = form.getFieldsValue();
        let create_time_st: string | undefined = undefined;
        let create_time_ed: string | undefined = undefined;
        if (formParams.create_time && formParams.create_time.length == 2) {
            create_time_st = formParams.create_time[0].format(dateFormat)
            create_time_ed = formParams.create_time[1].format(dateFormat)
        }
        let cate1_id = ''
        let cate2_id = ''
        if (typeof formParams.cates != 'undefined' && formParams.cates.length > 0) {
            cate1_id = formParams.cates[0]
            if (formParams.cates.length >= 2) {
                cate2_id = formParams.cates[1]
            }
        }

        let params: ItemSearchParams = {
            create_time_ed: create_time_ed,
            create_time_st: create_time_st,
            name: formParams.name,
            number: formParams.number,
            barcode: formParams.barcode,
            cate1_id,
            cate2_id,

            page: 1,
            pageSize: pageSize
        };

        reloadPage(params)
    }
    const reset = () => {
        let obj: ItemSearchParams = {
            create_time_ed: undefined,
            create_time_st: undefined,
            name: undefined,
            number: undefined,
            barcode: undefined,
            cate1_id: 0,
            cate2_id: 0,

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
                    <div className='w-60'>
                        <Form.Item
                            label="名称"
                            name="name"
                        >
                            <Input/>
                        </Form.Item>
                    </div>

                    <div className='w-60'>
                        <Form.Item
                            label="类别"
                            name="cates"
                        >
                            <Cascader options={cateOptions}/>
                        </Form.Item>
                    </div>

                    <div className='w-60'>
                        <Form.Item
                            label="货号"
                            name="number"
                        >
                            <Input/>
                        </Form.Item>
                    </div>

                    <div className='w-60'>
                        <Form.Item
                            label="条码"
                            name="barcode"
                        >
                            <Input/>
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

export default SearchForm
