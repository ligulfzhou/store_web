import React, {FC} from "react";
import {Modal, Form, message} from "antd";
import useSWRMutation from "swr/mutation";
import {commonDeleteAPI} from "@/requests/common";


interface Props {
    open: boolean,
    closeFn: (success: boolean) => void,
    id: number
}

const DeleteModal: FC<Props> = (
    {
        open,
        closeFn,
        id = 0
    }
) => {
    const [form] = Form.useForm();

    const onFinish = () => {
        if (!id) {
            message.error("请关掉弹框 并重试")
            return
        }

        callAPI({id: id}).then((res) => {
            if (res.code == 0) {
                message.success("删除成功")
                closeFn(true)
            } else {
                message.error(res.msg)
            }
        })
    };

    const {
        trigger: callAPI,
        isMutating: callingAPI
    } = useSWRMutation("/api/order/delete", commonDeleteAPI)

    return (
        <div>
            <Modal
                width={'400px'}
                open={open}
                centered={true}
                title='删除'
                onCancel={(e) => {
                    e.preventDefault()
                    form.resetFields()
                    closeFn(false)
                }}
                onOk={onFinish}
                closable={true}
                confirmLoading={callingAPI}
            >
                确认删除订单
            </Modal>
        </div>
    )
}

export default DeleteModal
