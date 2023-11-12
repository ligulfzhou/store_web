import React, {FC, useEffect, useState} from "react";
import {Modal, Form, Input, message, InputNumber} from "antd";
import useSWRMutation from "swr/mutation";
import {ColorToValue, UpdateColorValueParams} from "@/types/settings";
import {updateColorValue} from "@/requests/settings";


interface Props {
    open: boolean,
    closeFn: (success: boolean) => void,
    colorValue: ColorToValue | undefined
}

const EditModal: FC<Props> = (
    {
        open,
        closeFn,
        colorValue
    }
) => {
    const [form] = Form.useForm();

    const onFinish = (values: UpdateColorValueParams) => {
        let id = 0
        if (colorValue) {
            id = colorValue.id
        }

        values['id'] = id
        console.log(values)

        callUpdateAPI(values).then((res) => {
            if (res.code == 0) {
                message.success(`${colorValue ? "修改" : "添加"}成功`)
                closeFn(true)
                form.resetFields()
            } else {
                message.error(res.msg)
            }
        })
    };

    const [formValues, setFormValues] = useState<UpdateColorValueParams | undefined>(undefined)

    useEffect(() => {
        let _formValues: UpdateColorValueParams = {
            value: colorValue?.value? colorValue.value: '',
            color: colorValue?.color ? colorValue.color: '',
            id: colorValue?.id || 0
        }
        setFormValues(_formValues)
        form.setFieldsValue(_formValues)
    }, [colorValue])

    const {
        trigger: callUpdateAPI,
        isMutating: callingUpdateAPI
    } = useSWRMutation("/api/settings/edit/color/value", updateColorValue)

    return (
        <div>
            <Modal
                width={'400px'}
                open={open}
                centered={true}
                title={`${colorValue ? "修改" : "添加"}客户`}
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
                    wrapperCol={{span: 12}}
                    initialValues={{formValues}}
                    onFinish={onFinish}
                >
                    <div className=''>
                        <Form.Item
                            label="颜色"
                            name="color"
                            rules={[{required: true, message: '请输入颜色!'}]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="对应数值"
                            name="value"
                            rules={[{required: true, message: '请输入颜色对应的数值!'}]}
                        >
                            <InputNumber />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </div>
    )
}

export default EditModal
