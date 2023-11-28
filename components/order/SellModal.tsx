import React, {FC, useEffect, useState} from "react";
import {Modal, Form, message, Select} from "antd";
import {Option} from "@/types";
import {updateCustomer, UpdateCustomerParam} from "@/requests";
import useSWRMutation from "swr/mutation";
import useCustomers from "@/hooks/useCustomers";

interface Props {
    open: boolean,
    closeFn: (success: boolean) => void,
}

const SellModal: FC<Props> = (
    {
        open,
        closeFn,
    }
) => {
    const [form] = Form.useForm();

    const onFinish = (values: UpdateCustomerParam) => {
        let id = 0

        values['id'] = id
        console.log(values)

        callUpdateCustomerAPI(values).then((res) => {
            if (res.code == 0) {
                message.success(`添加订单成功`)
                closeFn(true)
                form.resetFields()
            } else {
                message.error(res.msg)
            }
        })
    };


    const {customers, isLoading: customersLoading} = useCustomers()
    const [customerOptions, setCustomerOptions] = useState<Option[]>([])

    useEffect(() => {
        if(customersLoading) {
            return
        }

        let customerOptions = customers.map(customer=> {
            let op: Option = {
                label: `${customer.name}-${customer.phone}-${customer.address}`,
                value: customer.id.toString()
            }
            return op
        })

        setCustomerOptions(customerOptions)

    }, [customers, customersLoading]);

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
                title='添加订单'
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
                    onFinish={onFinish}
                >
                    <div className='grid grid-cols-2'>
                        <Form.Item
                            label="客户"
                            name="ty_pe"
                            rules={[{required: true, message: '请选择客户!'}]}
                        >
                            <Select
                                style={{width: 200}}
                                loading
                                options={customerOptions}
                            />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </div>
    )
}

export default SellModal
