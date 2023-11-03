import React, {FC, useEffect, useState} from "react";
import {Modal, Form, Select, SelectProps, message, Input} from "antd";
import useRouterUtils from "@/hooks/useRouterUtils";
import useSWRMutation from "swr/mutation";
import {markProgress, MarkProgressParam} from "@/requests/order";
import {getOptionsForStep} from "@/utils/utils";

const {TextArea} = Input;
export interface MarkProgressProps{
    open: boolean,
    closeFn: (success: boolean) => void,
    order_goods_id: number,
    order_item_id: number,
    currentStep: number,
}

const MarkProgressModal: FC<MarkProgressProps> = (
    {
        open,
        closeFn,
        order_goods_id,
        order_item_id,
        currentStep,
    }
) => {
    const {removeParams} = useRouterUtils();
    const [form] = Form.useForm();

    const [formValues, setFormValues] = useState<MarkProgressParam | undefined>(undefined)
    const [index, setIndex] = useState<number>(0)
    const options: SelectProps['options'] = getOptionsForStep(currentStep)

    useEffect(() => {
        let _formValues: MarkProgressParam = {
            order_item_id: order_item_id,
            order_goods_id: order_goods_id,
            index: 0,
            notes: '',
        }
        setFormValues(_formValues)
        form.setFieldsValue(_formValues)
    }, [order_goods_id, order_item_id])

    const {
        trigger: callMarkProgressAPI,
        isMutating: callingMarkProgressAPI
    } = useSWRMutation('/api/mark/progress', markProgress)

    const onFinish = (values: MarkProgressParam) => {
        if (values['index']==0) {
            message.error("请先选择正确的流程");
            return
        }
        if (!values.notes) {
            values.notes = ''
        }
        values['order_goods_id'] = order_goods_id
        values['order_item_id'] = order_item_id
        callMarkProgressAPI(values).then((res)=> {
            console.log(res)
            if (res.code==0) {
                message.success("流程设置成功")
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
                width={'400px'}
                open={open}
                centered={true}
                title={`标记流程`}
                onCancel={(e) => {
                    form.resetFields()
                    removeParams(['order_id', 'order_no'])
                    closeFn(false)
                }}
                closable={true}
                onOk={() => {
                    form.submit()
                }}
                okText={"确定"}
                cancelText={"取消"}
                confirmLoading={callingMarkProgressAPI}
            >
                <Form
                    form={form}
                    name="basic"
                    layout={'horizontal'}
                    initialValues={formValues}
                    labelCol={{span: 6}}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="订单编号"
                        name="index"
                        rules={[{required: true, message: '请输入订单编号!'}]}
                    >
                        <Select options={options} onChange={(value)=> {
                            setIndex(value)
                        }}>
                        </Select>
                    </Form.Item>

                    {index === 1 ? (
                        <Form.Item
                            label="备注"
                            name="notes"
                            rules={[{required: true, message: '请输入备注信息!'}]}
                        >
                            <TextArea placeholder={'备注信息'}/>
                        </Form.Item>
                    ): null}
                </Form>
            </Modal>
        </div>
    )
}

export default MarkProgressModal
