import React, {FC} from "react";
import {Modal, Form, Input, message, Select} from "antd";
import useSWRMutation from "swr/mutation";
import {updateEmbryo, UpdateItemParam} from "@/requests/item";
import {Embryo} from "@/types/embryo";


interface Props {
    open: boolean,
    closeFn: (success: boolean) => void,
    obj: Embryo | undefined
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
    } = useSWRMutation("/api/embryo/edit", updateEmbryo)

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

    return (
        <div>
            <Modal
                width={700}
                open={open}
                centered={true}
                title={`${obj ? "修改" : "添加"}库存胚`}
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
                    <div className='grid grid-cols-2'>
                        <Form.Item
                            label="颜色"
                            name="color"
                            rules={[{required: true, message: '请选择颜色!'}]}
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
                            label="名称"
                            name="name"
                            rules={[{required: true, message: '请输入名称!'}]}
                        >
                            <Input/>
                        </Form.Item>

                    </div>
                </Form>
            </Modal>
        </div>
    )
}

export default StorageModal
