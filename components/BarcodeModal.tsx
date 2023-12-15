import React, {FC} from "react";
import {Button, Modal} from "antd";
import Barcode from "react-barcode";
import html2canvas from "html2canvas";


interface Props {
    open: boolean,
    closeFn: (success: boolean) => void,
    text: string,
}

const BarcodeModal: FC<Props> = (
    {

        open,
        closeFn,
        text = ''
    }
) => {
    const wrapper_ref = React.useRef<HTMLDivElement | null>(null);
    const onClick = () => {
        const opt = {
            scale: 4
        }
        const elem = wrapper_ref.current;
        // @ts-ignore
        html2canvas(elem, opt).then(canvas => {
            const iframe = document.createElement('iframe')
            iframe.name = 'printf'
            iframe.id = 'printf'
            iframe.height = '0';
            iframe.width = '0';
            document.body.appendChild(iframe)

            // @ts-ignore
            const imgUrl = canvas.toDataURL({
                format: 'jpeg',
                quality: '1.0'
            })

            const style = `
            height:100vh;
            width:100vw;
            position:absolute;
            left:0:
            top:0;
        `;

            const url = `<img style="${style}" src="${imgUrl}"/>`;
            // @ts-ignore
            var newWin = window.frames["printf"];
            newWin.document.write(`<body onload="window.print()">${url}</body>`);
            newWin.document.close();

        });
    }

    // @ts-ignore
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
                {/* @ts-ignore*/}
                <div
                    ref={wrapper_ref}
                    className='flex flex-row justify-center'
                >
                    <Barcode value={text} width={2} height={50}/>
                </div>

                {/* buttons */}
                <div className='flex flex-row justify-end'>
                    <Button onClick={onClick}>
                        打印
                    </Button>
                </div>
            </Modal>
        </div>
    )
}

export default BarcodeModal
