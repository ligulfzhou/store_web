import React, {FC, useEffect} from "react";
import {Form, Input, message, Modal} from "antd";
import useSWRMutation from "swr/mutation";
import {CustomerTypeSettings, UpdateCustomerTypeParams} from "@/types/settings";
import {updateCustomerType} from "@/requests/settings";


interface Props {
    open: boolean,
    closeFn: (success: boolean) => void,
    obj: CustomerTypeSettings | undefined
}

const EditModal: FC<Props> = (
    {
        open,
        closeFn,
        obj
    }
) => {
    const [form] = Form.useForm();

    const onFinish = (values: UpdateCustomerTypeParams) => {
        values['id'] = obj?.id || 0
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

    // const [formValues, setFormValues] = useState<UpdateCustomerTypeParams | undefined>(undefined)

    useEffect(() => {
        let _formValues: UpdateCustomerTypeParams = {
            ty_pe: obj?.ty_pe ? obj.ty_pe : '',
            id: obj?.id || 0
        }
        // setFormValues(_formValues)
        form.setFieldsValue(_formValues)
    }, [open])

    const {
        trigger: callUpdateAPI,
        isMutating: callingUpdateAPI
    } = useSWRMutation("/api/settings/edit/customer/type", updateCustomerType)

    return (
        <div>
            <Modal
                width={'400px'}
                open={open}
                centered={true}
                title={`${obj ? "修改" : "添加"}客户类型`}
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
                    // initialValues={{formValues}}
                    onFinish={onFinish}
                >
                    <div className=''>
                        <Form.Item
                            label="客户类型"
                            name="ty_pe"
                            rules={[{required: true, message: '请输入客户类型!'}]}
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
