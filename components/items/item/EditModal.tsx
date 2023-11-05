import React, {FC, useEffect, useState} from "react";
import {Modal, Form, Input, message, DatePicker, Select} from "antd";
import useSWRMutation from "swr/mutation";
import {Item} from "@/types/item";
import {updateItem, UpdateItemParam} from "@/requests/item";


interface Props {
    open: boolean,
    closeFn: (success: boolean) => void,
    obj: Item | undefined
}

const EditModal: FC<Props> = (
    {
        open,
        closeFn,
        obj
    }
) => {
    const [form] = Form.useForm();

    const onFinish = (values: UpdateItemParam) => {
        let id = 0
        if (obj) {
            id= obj.id
        }

        values['id'] = id
        console.log(values)

        callUpdateAPI(values).then((res)=> {
            if (res.code==0) {
                message.success(`${obj?"修改": "添加"}成功`)
                closeFn(true)
                form.resetFields()
            } else {
                message.error(res.msg)
            }
        })
    };

    const [formValues, setFormValues] = useState<UpdateItemParam | undefined>(undefined)

    useEffect(() => {
        let _formValues: UpdateItemParam = {
            barcode: obj?.barcode||'',
            brand: obj?.brand||'',
            buy_price: obj?.buy_price||'',
            cates1: obj?.cates1||'',
            cates2: obj?.cates2||'',
            color: obj?.color||'',
            goods_no: obj?.goods_no||'',
            name: obj?.name||'',
            sell_price: obj?.sell_price||'',
            size: obj?.size||'',
            unit: obj?.unit||'',
            id: obj?.id||0
        }
        setFormValues(_formValues)
        form.setFieldsValue(_formValues)
    }, [obj])

    const {
        trigger: callUpdateAPI,
        isMutating: callingUpdateAPI
    } = useSWRMutation("/api/item/edit", updateItem)

    return (
        <div>
            <Modal
                width={700}
                open={open}
                centered={true}
                title={`${obj? "修改": "添加"}产品`}
                onCancel={(e) => {
                    e.preventDefault()
                    form.resetFields()
                    closeFn(false)
                }}
                onOk={() => form.submit()}
                closable={true}
                confirmLoading={callingUpdateAPI}
            >
                <Form
                    form={form}
                    name="basic"
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    initialValues={{formValues}}
                    onFinish={onFinish}
                >
                    <div className='grid grid-cols-2'>
                        <Form.Item
                            label="产品名"
                            name="name"
                            rules={[{required: true, message: '请输入产品名!'}]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="负责人"
                            name="head"
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="手机号"
                            name="phone"
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="生日"
                            name="birthday"
                        >
                            <DatePicker style={{width: 200}} />
                        </Form.Item>


                        <Form.Item
                            label="Email"
                            name="email"
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="QQ"
                            name="qq"
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="客户类型"
                            name="ty_pe"
                            rules={[{required: true, message: '请选择客户类型!'}]}
                        >
                            <Select
                                style={{ width: 200 }}
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

                        <Form.Item
                            label="地址"
                            name="address"
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="客户编号"
                            name="customer_no"
                            rules={[{required: true, message: '请输入客户编号!'}]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="备注"
                            name="notes"
                            rules={[{required: false, message: '请输入备注!'}]}
                        >
                            <Input/>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </div>
    )
}

export default EditModal
