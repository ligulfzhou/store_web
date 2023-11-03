import React, {FC, useEffect, useState} from "react";
import {Modal, Form, Input, message} from "antd";
import {Customer} from "@/types";
import {UpdateOrderParam} from "@/requests/order";
import moment from "moment/moment";
import {updateCustomer, UpdateCustomerParam} from "@/requests";
import useSWRMutation from "swr/mutation";


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
    const [savePRError, setSavePRError] = useState<string>('')
    const [form] = Form.useForm();

    const onFinish = (values: UpdateCustomerParam) => {
        if (!customer?.id){
            return
        }

        values['id'] = customer?.id
        callUpdateCustomerAPI(values).then((res)=> {
            if (res.code==0) {
                message.success("修改成功")
                closeFn(true)
                form.resetFields()
            } else {
                message.error(res.msg)
            }
        })
    };

    const [formValues, setFormValues] = useState<UpdateCustomerParam | undefined>(undefined)

    useEffect(() => {
        let _formValues: UpdateCustomerParam = {
            id: 0,
            customer_no: customer?.customer_no || '',
            notes: customer?.notes || ''
        }
        setFormValues(_formValues)
        form.setFieldsValue(_formValues)
    }, [customer])

    const {
        trigger: callUpdateCustomerAPI,
        isMutating: callingUpdateCustomerAPI
    } = useSWRMutation("/api/customer/update", updateCustomer)

    return (
        <div>
            <Modal
                open={open}
                centered={true}
                title='修改客户'
                onCancel={(e) => {
                    e.preventDefault()
                    form.resetFields()
                    setSavePRError('')
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
                    style={{maxWidth: 600}}
                    initialValues={{formValues}}
                    onFinish={onFinish}
                >
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
                </Form>
            </Modal>
        </div>
    )
}

export default EditCustomerModal
