import React, {FC, useEffect, useState} from "react";
import {Modal, Form, Input, message, DatePicker, Select, InputNumber} from "antd";
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
            id = obj.id
        }

        values['id'] = id
        console.log(values)

        callUpdateAPI(values).then((res) => {
            if (res.code == 0) {
                message.success(`${obj ? "修改" : "添加"}成功`)
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
            barcode: obj?.barcode || '',
            brand: obj?.brand || '',
            buy_price: obj?.buy_price || '',
            cates1: obj?.cates1 || '',
            cates2: obj?.cates2 || '',
            color: obj?.color || '',
            goods_no: obj?.goods_no || '',
            name: obj?.name || '',
            sell_price: obj?.sell_price || '',
            size: obj?.size || '',
            unit: obj?.unit || '',
            id: obj?.id || 0
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
                title={`${obj ? "修改" : "添加"}产品`}
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
                            label="英文名"
                            name="english_name"
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="类别"
                            name="cates"
                        >
                            #todo
                        </Form.Item>

                        <Form.Item
                            label="货号"
                            name="goods_no"
                        >
                            <Input/>
                        </Form.Item>

                        {/*<DatePicker style={{width: 200}} />*/}
                        <Form.Item
                            label="条码"
                            name="barcode"
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="规格"
                            name="size"
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="单位"
                            name="unit"
                        >
                            <Input/>
                        </Form.Item>
                    </div>

                    <div className='grid grid-cols-2 mt-6'>
                        <Form.Item
                            label="售价"
                            name="sell_price"
                        >
                            <InputNumber style={{width: 180}}/>
                        </Form.Item>
                        <Form.Item
                            label="进货价"
                            name="buy_price"
                        >
                            <InputNumber style={{width: 180}}/>
                        </Form.Item>
                    </div>

                    <div className='grid grid-cols-2 mt-6'>
                        <Form.Item
                            label="品牌"
                            name="brand"
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="供应商"
                            name="supplier"
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="材质"
                            name="material"
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="件数(PCS)"
                            name="pcs"
                        >
                            <InputNumber/>
                        </Form.Item>
                        <Form.Item
                            label="重量"
                            name="weight"
                        >
                            <InputNumber/>
                        </Form.Item>

                        <Form.Item
                            label="描述"
                            name="description"
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="备注"
                            name="notes"
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
