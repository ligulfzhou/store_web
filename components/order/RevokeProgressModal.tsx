import React, {FC} from "react";
import {message, Modal} from "antd";
import useSWRMutation from "swr/mutation";
import {revokeProgress} from "@/requests/order";
import {OneProgress} from "@/types";
import {formatDateTime, getNotesForOneProgress} from "@/utils/utils";


interface Props {
    open: boolean,
    closeFn: (success: boolean) => void,
    progress: OneProgress|undefined
}

const RevokeProgressModal: FC<Props> = (
    {
        open,
        closeFn,
        progress,
    }
) => {
    const {
        trigger: callRevokeProgressAPI,
        isMutating: callingRevokeProgressAPI
    } = useSWRMutation('/api/revoke/progress', revokeProgress)

    console.log(progress)

    const onOk = ()=> {
        if (!progress){
            return
        }
        callRevokeProgressAPI({id:progress.id}).then((data)=>{
            if(data.code!==0) {
                message.error(data.msg)
            } else {
                message.success("撤销成功")
                closeFn(true)
            }
        })
    }

    return (
        <div>
            <Modal
                width={'400px'}
                centered={true}
                open={open}
                title="撤销流程"
                onCancel={(e) => {
                    closeFn(false)
                }}
                closable={true}
                onOk={onOk}
                okText={"确定"}
                cancelText={"取消"}
                confirmLoading={callingRevokeProgressAPI}
            >
                确认撤销流程:
                <div className='block'>
                    {progress? (
                        <>
                            {formatDateTime(new Date(progress.dt))}: {progress.account_name}({progress.department}): {getNotesForOneProgress(progress)}
                        </>
                    ): null}

                </div>
            </Modal>
        </div>
    )
}

export default RevokeProgressModal
