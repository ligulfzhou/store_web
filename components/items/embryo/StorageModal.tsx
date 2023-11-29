import React, {FC} from "react";
import {Modal, Form, message, Select, InputNumber} from "antd";
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
        message.error("不着急，还没实现")
        return
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
                    <div className=''>
                        <Form.Item
                            label="增加/减少库存"
                            name="incOrDec"
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
                            name="name"
                            rules={[{required: true, message: '请输入数量!'}]}
                        >
                            <InputNumber style={{width: 250}} />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </div>
    )
}

export default StorageModal
