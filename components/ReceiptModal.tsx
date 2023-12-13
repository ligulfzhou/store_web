import {Br, Cut, Line, Printer, Text, Row, render} from 'react-thermal-printer';
import React, {FC} from "react";
import {Button, Modal} from "antd";
import html2canvas from "html2canvas";


interface Props {
    open: boolean,
    closeFn: (success: boolean) => void,
}

const ReceiptModal: FC<Props> = (
    {

        open,
        closeFn,
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
            iframe.height = '100px';
            iframe.width = '200px';
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
                width={'1200px'}
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
                    <Printer type="epson" width={300} characterSet="china">
                        <Text size={{width: 2, height: 2}}>9,500</Text>
                        <Text bold={true}>测试</Text>
                        <Br/>
                        <Line/>
                        <Row left="测试" right="测试"/>
                        <Row left="测试" right="123456**********"/>
                        <Row left="测试" right="测试"/>
                        <Row left="测试" right="9,500"/>
                        <Row left="测试" right="863"/>
                        <Row left="测试" right="8,637"/>
                        <Line/>
                        <Row left="测试 X 2" right="11,000"/>
                        <Text>测试</Text>
                        <Row left="(-) 测试" right="- 500"/>
                        <Br/>
                        <Line/>
                        <Row left="测试" right="9,500"/>
                        <Row left="(-) 测试 2%" right="- 1,000"/>
                        <Line/>
                        <Row left="测试" right=""/>
                        <Row left="测试" right="000-00-00000"/>
                        <Row left="测试" right="0000-0000"/>
                        <Row left="测试" right=""/>
                        <Line/>
                        <Br/>
                        <Text align="center">Wifi: some-wifi / PW: 123123</Text>
                        <Cut/>
                    </Printer>
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

export default ReceiptModal
