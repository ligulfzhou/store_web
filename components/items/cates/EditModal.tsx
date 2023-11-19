import React, {FC, useEffect, useState} from "react";
import {Modal, Form, Input, message} from "antd";
import useSWRMutation from "swr/mutation";
import {Cate, UpdateCateParams} from "@/types";
import {updateCate} from "@/requests/item";


interface Props {
    open: boolean,
    closeFn: (success: boolean) => void,
    obj: Cate | undefined,
    parent_id: number
}

const EditModal: FC<Props> = (
    {
        open,
        closeFn,
        obj,
        parent_id = 0
    }
) => {
    const [form] = Form.useForm();

    const onFinish = (values: UpdateCateParams) => {
        let id = 0
        if (obj) {
            id = obj.id
        }

        values['id'] = id
        values['index'] = 0
        let cate_type = 0
        let pid = 0
        if (obj) {
            cate_type = obj.cate_type
            pid = obj.parent_id
        } else if(parent_id) {
            cate_type = 1
            pid = parent_id
        }
        // @ts-ignore
        values['cate_type'] = cate_type
        values['parent_id'] = pid
        console.log(values)

        callAPI(values).then((res) => {
            if (res.code == 0) {
                message.success(`${obj ? "修改" : "添加"}成功`)
                closeFn(true)
                form.resetFields()
            } else {
                message.error(res.msg)
            }
        })
    };

    const [formValues, setFormValues] = useState<UpdateCateParams | undefined>(undefined)

    useEffect(() => {
        let cate_type = 0
        if (obj) {
            cate_type = obj.cate_type
        } else if(parent_id) {
            cate_type = 1
        }

        let _formValues: UpdateCateParams = {
            name: obj?.name ? obj.name : '',
            index: obj?.index ? obj.index : 0,
            parent_id: obj ? obj.parent_id : parent_id,
            cate_type: cate_type,
            id: obj?.id || 0
        }
        setFormValues(_formValues)
        form.setFieldsValue(_formValues)
    }, [obj])

    const {
        trigger: callAPI,
        isMutating: callingAPI
    } = useSWRMutation("/api/edit/cates", updateCate)

    return (
        <div>
            <Modal
                width={'400px'}
                open={open}
                centered={true}
                title={`${obj ? "修改" : "添加"}类名`}
                onCancel={(e) => {
                    e.preventDefault()
                    form.resetFields()
                    closeFn(false)
                }}
                onOk={() => form.submit()}
                closable={true}
                confirmLoading={callingAPI}
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
                            label="类名"
                            name="name"
                            rules={[{required: true, message: '请输入类名!'}]}
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
