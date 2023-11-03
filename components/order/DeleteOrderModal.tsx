import React, {FC} from "react";
import {message, Modal} from "antd";
import useSWRMutation from "swr/mutation";
import {deleteOrder} from "@/requests/order";
import {Order} from "@/types";


interface Props {
    open: boolean,
    closeFn: (success: boolean) => void,
    order: Order | undefined,
    orderNo: string,
}

const DeleteOrderModal: FC<Props> = (
    {
        open,
        closeFn,
        order,
        orderNo
    }
) => {
    const {
        trigger: callDeleteOrderAPI,
        isMutating: callingDeleteOrderAPI
    } = useSWRMutation('/api/order/delete', deleteOrder)

    const onOk = ()=> {
        if (!order){
            message.error("请关掉弹框重试")
            return
        }
        callDeleteOrderAPI({id: order?.id}).then((data)=>{
            if(data.code!==0) {
                message.error(data.msg)
            } else {
                message.success("删除成功")
                closeFn(true)
            }
        })
    }

    return (
        <div>
            <Modal
                width={'400px'}
                open={open}
                centered={true}
                title="订单"
                onCancel={(e) => {
                    closeFn(false)
                }}
                closable={true}
                onOk={onOk}
                okText={"确定"}
                cancelText={"取消"}
                confirmLoading={callingDeleteOrderAPI}
            >
                确认删除订单({orderNo})
            </Modal>
        </div>
    )
}

export default DeleteOrderModal
