import React, {FC, useEffect, useState} from "react";
import {Form, Input, Modal, Select} from "antd";
import {Option} from "@/types";
import ExcelImporter from "@/components/uploader/ExcelImporter";
import useCustomers from "@/hooks/useCustomers";

interface Props {
    open: boolean,
    closeFn: (success: boolean) => void,
}

const ImportOrderExcelModal: FC<Props> = (
    {
        open,
        closeFn,
    }
) => {
    const [form] = Form.useForm();

    const [customerId, setCustomerId] = useState<number>(0)
    const {customers, isLoading: isCustomersLoading} = useCustomers()
    const [customerOptions, setCustomerOptions] = useState<Option[]>([])

    useEffect(() => {
        if (!open) {
            return
        }

        form.setFieldsValue({
            'customerId': ''
        })
        setCustomerId(0)
    }, [open]);

    useEffect(() => {
        if (isCustomersLoading) {
            return
        }

        let options = customers.map(customer => {
            let op: Option = {
                label: customer.name,
                value: customer.id.toString()
            }
            return op
        })
        setCustomerOptions(options)
    }, [customers, isCustomersLoading]);

    return (
        <div>
            <Modal
                open={open}
                centered={true}
                title='导入客户订单'
                onCancel={(e) => {
                    e.preventDefault()
                    closeFn(false)
                }}
                footer={null}
            >
                <Form
                    form={form}
                    name="basic"
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                >
                    <Form.Item
                        label="客户"
                        name="customerId"
                        rules={[{required: true, message: '请输入客户名称!'}]}
                    >
                        <Select
                            onChange={(value) => {
                                console.log(`customerId: ${parseInt(value)}`)
                                setCustomerId(parseInt(value))
                            }}
                            loading={isCustomersLoading}
                            style={{width: 200}}
                            options={customerOptions}
                        />
                    </Form.Item>

                    <Form.Item
                        label="导入订单"
                        name="excel"
                    >
                        <ExcelImporter
                            extra={
                                {'customer_id': 1}
                            }
                            callback={() => {
                            }}
                            tp={'order'}
                            disabled={!customerId}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default ImportOrderExcelModal
