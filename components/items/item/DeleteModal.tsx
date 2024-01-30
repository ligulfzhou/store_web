import React, {FC} from "react";
import {Modal, Form, message} from "antd";
import useSWRMutation from "swr/mutation";
import {commonDeleteAPI} from "@/requests/common";
import {Item} from "@/types";


interface Props {
    open: boolean,
    closeFn: (success: boolean) => void,
    item: Item | undefined
}

const DeleteModal: FC<Props> = (
    {
        open,
        closeFn,
        item = null
    }
) => {
    const [form] = Form.useForm();

    const onFinish = () => {
        if (!item?.id) {
            message.error("请关掉弹框 并重试")
            return
        }

        callAPI({id: item.id}).then((res) => {
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
    } = useSWRMutation("/api/item/delete", commonDeleteAPI)

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
                确认删除产品：{item?.name}
            </Modal>
        </div>
    )
}

export default DeleteModal
