import React, {FC, useEffect, useState} from "react";
import {Modal, Form, Input, message, DatePicker, Select} from "antd";
import {Customer, Option} from "@/types";
import {updateCustomer, UpdateCustomerParam} from "@/requests";
import useSWRMutation from "swr/mutation";
import useCustomerTypes from "@/hooks/useCustomerTypes";

interface Props {
    open: boolean,
    closeFn: (success: boolean) => void,
    customer: Customer | undefined
}

const EditCustomerModal: FC<Props> = (
    {
        open,
        closeFn,
        customer
    }
) => {
    const [form] = Form.useForm();

    const onFinish = (values: UpdateCustomerParam) => {
        let id = 0
        if (customer) {
            id = customer.id
        }

        values['id'] = id
        console.log(values)

        callUpdateCustomerAPI(values).then((res) => {
            if (res.code == 0) {
                message.success(`${customer ? "修改" : "添加"}成功`)
                closeFn(true)
                form.resetFields()
            } else {
                message.error(res.msg)
            }
        })
    };

    const {customerTypes, key, isLoading} = useCustomerTypes()
    const [typeOptions, setTypeOptions] = useState<Option[]>([])

    useEffect(() => {
        if(isLoading) {return}

        let typeOptions = customerTypes.map(type=> {
            let op: Option = {
                label: type.ty_pe,
                value: type.id.toString()
            }
            return op
        })
        setTypeOptions(typeOptions)
    }, [customerTypes, isLoading]);

    const [formValues, setFormValues] = useState<UpdateCustomerParam | undefined>(undefined)
    useEffect(() => {
        if (!open) {
            return
        }
        let _formValues: UpdateCustomerParam = {
            address: customer?.address || '',
            birthday: customer?.birthday || null,
            email: customer?.email || '',
            head: customer?.head || '',
            name: customer?.name || '',
            notes: customer?.notes || '',
            phone: customer?.phone || '',
            ty_pe: customer?.ty_pe.toString() || '',
            id: customer?.id || 0
        }
        setFormValues(_formValues)
        form.setFieldsValue(_formValues)
    }, [open])

    const {
        trigger: callUpdateCustomerAPI,
        isMutating: callingUpdateCustomerAPI
    } = useSWRMutation("/api/customer/edit", updateCustomer)

    return (
        <div>
            <Modal
                width={700}
                open={open}
                centered={true}
                title={`${customer ? "修改" : "添加"}客户`}
                onCancel={(e) => {
                    e.preventDefault()
                    form.resetFields()
                    closeFn(false)
                }}
                onOk={() => form.submit()}
                closable={true}
                confirmLoading={callingUpdateCustomerAPI}
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
                            label="客户名称"
                            name="name"
                            rules={[{required: true, message: '请输入客户名称!'}]}
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
                            <DatePicker style={{width: 200}}/>
                        </Form.Item>


                        <Form.Item
                            label="Email"
                            name="email"
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="客户类型"
                            name="ty_pe"
                            rules={[{required: true, message: '请选择客户类型!'}]}
                        >
                            <Select
                                style={{width: 200}}
                                loading
                                options={typeOptions}
                            />
                        </Form.Item>

                        <Form.Item
                            label="地址"
                            name="address"
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

export default EditCustomerModal
