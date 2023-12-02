import React, {FC} from "react";
import {Modal, Form, message, Select, InputNumber} from "antd";
import useSWRMutation from "swr/mutation";
import {updateItemInout, UpdateItemInoutParam} from "@/requests/item";
import {Item} from "@/types";


interface Props {
    open: boolean,
    closeFn: (success: boolean) => void,
    obj: Item | undefined
}

const StorageModal: FC<Props> = (
    {
        open,
        closeFn,
        obj
    }
) => {
    const [form] = Form.useForm();

    const {
        trigger: callUpdateAPI,
        isMutating: callingUpdateAPI
    } = useSWRMutation("/api/item/inout", updateItemInout)

    const onFinish = (values: UpdateItemInoutParam) => {
        let id = 0
        if (obj) {
            id = obj.id
        }
        values['id'] = id

        if (typeof (values['in_out']) == 'string' && parseInt(values['in_out']) == 1) {
            values['in_out'] = true
        } else {
            values['in_out'] = false
        }

        console.log(values)
        callUpdateAPI(values).then((res) => {
            if (res.code == 0) {
                message.success(`修改库存成功`)
                closeFn(true)
                form.resetFields()
            } else {
                message.error(res.msg)
            }
        })
    };

    return (
        <div>
            <Modal
                open={open}
                centered={true}
                title={`修改库存胚 库存`}
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
                    onFinish={onFinish}
                >
                    <div className=''>
                        <Form.Item
                            label="增加/减少库存"
                            name="in_out"
                            rules={[{required: true, message: '请选择增加 还是 减少!'}]}
                        >
                            <Select options={[
                                {
                                    value: "1",
                                    label: "增加"
                                },
                                {
                                    value: "2",
                                    label: "减少"
                                }
                            ]}/>
                        </Form.Item>

                        <Form.Item
                            label="数量"
                            name="count"
                            rules={[{required: true, message: '请输入数量!'}]}
                        >
                            <InputNumber style={{width: 250}}/>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </div>
    )
}

export default StorageModal
