import {UploadOutlined} from '@ant-design/icons';
import type {UploadProps} from 'antd';
import {Button, message, Upload} from 'antd';
import React, {FC} from 'react';
import {host} from "@/utils/const";
import {EmptyResponse} from "@/types";
import {MessageType} from "antd/lib/message";

type ExcelTp = 'item' | 'customer' | 'order' | 'embryo'

interface Props {
    callback: () => void
    tp: ExcelTp
}

const ExcelImporter: FC<Props> = (
    {
        callback,
        tp
    }
) => {
    const key = 'excel_importer';
    let loadingMessage: MessageType | null = null;

    const tpToName = () => {
        if (tp == 'item') {
            return '产品'
        } else if (tp == 'customer') {
            return '客户'
        } else if (tp == 'embryo') {
            return '库存胚'
        } else {
            return '订单'
        }
    }
    const titleToType = (title: ExcelTp) => {
        switch (title) {
            case "item" :
                return 0;
            case "embryo":
                return 1;
            case "customer":
                return 2;
            case "order":
                return 3;
        }
    }

    const props: UploadProps = {
        name: 'file',
        multiple: false,
        showUploadList: false,
        data: {tp: titleToType(tp)},
        action: `${host}/api/upload/excel`,
        accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        onChange(info) {
            if (info.file.status === 'uploading') {
                if (!loadingMessage) {
                    loadingMessage = message.loading({content: "正在上传excel..", key: key, duration: 0})
                    console.log(info.file, info.fileList);
                }
            }

            if (info.file.status === 'done') {
                let res = info.file.response as EmptyResponse;
                if (res.code == 0) {
                    message.destroy(key)
                    message.success('导入成功');
                    callback()
                } else {
                    message.destroy(key)
                    message.error(`导入失败: ${res.msg}`);
                }
            } else if (info.file.status === 'error') {
                let res = info.file.response as EmptyResponse;
                message.destroy(key)
                message.error(`导入失败: ${res.msg}`);
            }
        },
    };

    return (
        <>
            <Upload {...props}>
                <Button icon={<UploadOutlined/>}>导入{tpToName()}</Button>
            </Upload>
        </>
    )
}


export default ExcelImporter;
