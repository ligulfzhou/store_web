import React, {FC} from "react";
import {Button, Modal} from "antd";
import Barcode from "react-barcode";


interface Props {
    open: boolean,
    closeFn: (success: boolean) => void,
    text: string,
}

const BarcodeModal: FC<Props> = (
    {

        open,
        closeFn,
        text=''
    }
) => {
    return (
        <div>
            <Modal
                width={'400px'}
                open={open}
                centered={true}
                title={'条形码'}
                onCancel={(e) => {
                    e.preventDefault()
                    closeFn(false)
                }}
                footer={null}
                closable={true}
            >
                {/* 条形码 */}
                <div className='flex flex-row justify-center'>
                    <Barcode value={text} />,
                </div>

                {/* buttons */}
                <div className='flex flex-row justify-end'>
                    <Button>
                        打印
                    </Button>
                </div>
            </Modal>
        </div>
    )
}

export default BarcodeModal
