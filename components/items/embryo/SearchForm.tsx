import React, {useEffect, useState} from "react";
import {Form, Input, Col, Button} from "antd";
import useRouterUtils from "@/hooks/useRouterUtils";
import useParameters from "@/hooks/useParameters";
import {Option} from "@/types";
import useCates from "@/hooks/useCates";
import {EmbryoSearchParams} from "@/types/embryo";


const SearchForm = () => {
    const {removeParams, reloadPage} = useRouterUtils();

    const {
        pageSize,
        name,
        number,
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

        form.setFieldsValue(values)
    });

    const doSearch = () => {
        console.log(form.getFieldsValue())

        const formParams: {
            name: string | undefined,
            number: string | undefined,
        } = form.getFieldsValue();

        let params: EmbryoSearchParams = {
            name: formParams.name,
            number: formParams.number,

            page: 1,
            pageSize: pageSize
        };

        reloadPage(params)
    }
    const reset = () => {
        let obj: EmbryoSearchParams = {
            name: undefined,
            number: undefined,

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
                            label="编号"
                            name="number"
                        >
                            <Input/>
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
