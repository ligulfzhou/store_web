import React, {FC} from "react";
import {Modal} from "antd";


interface Props {
    open: boolean,
    closeFn: (success: boolean) => void,
    id: number,
    title: string,
    deleteFn: (id: number) => void,
    deleting: boolean
}

const EditModal: FC<Props> = (
    {

        open,
        closeFn,
        id,
        title,
        deleteFn,
        deleting = false
    }
) => {
    return (
        <div>
            <Modal
                width={'400px'}
                open={open}
                centered={true}
                title={title}
                onCancel={(e) => {
                    e.preventDefault()
                    closeFn(false)
                }}
                onOk={() => deleteFn(id)}
                closable={true}
                confirmLoading={deleting}
            >

            </Modal>
        </div>
    )
}

export default EditModal
