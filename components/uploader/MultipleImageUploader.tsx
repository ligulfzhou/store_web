import React, {FC, useState} from "react";
import {Modal, Upload, UploadFile, UploadProps} from "antd";
import {RcFile} from "antd/es/upload";
import {PlusOutlined} from "@ant-design/icons";
import {getBase64} from "@/utils/antd";
import {host} from "@/utils/const";

interface Props {
    fileList: UploadFile[]
    handleNewFileList: (newFileList: UploadFile[]) => void
}

const MultipleImageUploader: FC<Props> = (
    {
        fileList=[],
        handleNewFileList
    }
) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    // const [fileList, setFileList] = useState<UploadFile[]>([])
    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    // const handleChange: UploadProps['onChange'] = ({fileList: newFileList}) =>
    //     setFileList(newFileList);
    const handleChange: UploadProps['onChange'] = ({fileList: newFileList}) =>
        handleNewFileList(newFileList);

    const uploadButton = (
        <div>
            <PlusOutlined/>
            <div style={{marginTop: 8}}>上传图片</div>
        </div>
    );

    return (
        <div>
            <Upload
                action={`${host}/api/upload/image`}
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                accept={'.jpeg,.png,.jpg'}
            >
                {fileList.length >= 8 ? null : uploadButton}
            </Upload>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{width: '100%'}} src={previewImage}/>
            </Modal>
        </div>
    )
}


export default MultipleImageUploader
