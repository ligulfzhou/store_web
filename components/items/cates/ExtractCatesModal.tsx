import React, {FC} from "react";
import {message, Modal} from "antd";
import useSWRMutation from "swr/mutation";
import {deleteOrder} from "@/requests/order";
import {Order} from "@/types";


interface Props {
    open: boolean,
    closeFn: (success: boolean) => void,
}

const ExtractCatesModal: FC<Props> = (
    {
        open,
        closeFn,
    }
) => {
    const {
        trigger: callDeleteOrderAPI,
        isMutating: callingDeleteOrderAPI
    } = useSWRMutation('/api/order/delete', deleteOrder)

    const onOk = ()=> {
        message.error("未实现，不明觉厉")
        // callDeleteOrderAPI({id: order?.id}).then((data)=>{
        //     if(data.code!==0) {
        //         message.error(data.msg)
        //     } else {
        //         message.success("删除成功")
        //         closeFn(true)
        //     }
        // })
    }

    return (
        <div>
            <Modal
                width={'400px'}
                open={open}
                centered={true}
                title="请确认"
                onCancel={(e) => {
                    closeFn(false)
                }}
                closable={true}
                onOk={onOk}
                okText={"确定"}
                cancelText={"取消"}
                confirmLoading={callingDeleteOrderAPI}
            >
                从产品中提取类别
            </Modal>
        </div>
    )
}

export default ExtractCatesModal
