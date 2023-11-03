import React, {FC, useState} from "react";
import useSWRMutation from "swr/mutation";
import {Modal, Form, Button, Input, message, Spin} from "antd";
import {addCustomer} from "@/requests";


interface Props {
    open: boolean,
    closeFn: (success: boolean) => void,
}

const AddCustomerModal: FC<Props> = (
    {
        open,
        closeFn,
    }
) => {
    const [savePRError, setSavePRError] = useState<string>('')
    const {
        trigger: callAddCustomerAPI,
        isMutating: callingAddCustomerAPI
    } = useSWRMutation('/api/customers', addCustomer)

    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        callAddCustomerAPI(values).then((res) => {
            if (res.code == 0) {
                console.log(res)
                message.success("添加成功")
            } else {
                message.error(res.msg)
            }
        })
    };

    return (
        <div>
            <Modal
                open={open}
                title='添加客户'
                centered={true}
                onCancel={(e) => {
                    e.preventDefault()
                    form.resetFields()
                    setSavePRError('')
                    closeFn(false)
                }}
                closable={true}
                footer={
                    null
                }
            >
                <Form
                    form={form}
                    name="basic"
                    labelCol={{span: 6}}
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

                    <Form.Item wrapperCol={{offset: 8, span: 16}}>
                        <Button
                            disabled={callingAddCustomerAPI}
                            loading={callingAddCustomerAPI}
                            type="primary"
                            htmlType="submit"
                        >
                            添加
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default AddCustomerModal
