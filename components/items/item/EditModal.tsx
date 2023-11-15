import React, {FC, useEffect, useState} from "react";
import {Modal, Form, Input, message, InputNumber, Cascader, UploadFile, UploadProps, Upload} from "antd";
import useSWRMutation from "swr/mutation";
import {Item} from "@/types/item";
import {updateItem, UpdateItemParam} from "@/requests/item";
import useCates from "@/hooks/useCates";
import MultipleImageUploader from "@/components/uploader/MultipleImageUploader";
import {DataResponse} from "@/types";


type imageReponse = {
    url: string
}
type UploadImageResponse = DataResponse<imageReponse>

interface Option {
    value: string;
    label: string;
    children?: Option[];
}

interface Props {
    open: boolean,
    closeFn: (success: boolean) => void,
    obj: Item | undefined
}

const EditModal: FC<Props> = (
    {
        open,
        closeFn,
        obj
    }
) => {
    const {cates, isLoading} = useCates()
    const [form] = Form.useForm();

    const onFinish = (values: UpdateItemParam) => {
        let id = 0
        if (obj) {
            id = obj.id
        }
        values['id'] = id

        console.log(fileList)

        let imageList = fileList.map(file => {
            let response = file.response as UploadImageResponse
            return response.data.url
        })
        console.log(imageList)
        values['images'] = imageList

        console.log(values)

        callUpdateAPI(values).then((res) => {
            if (res.code == 0) {
                message.success(`${obj ? "修改" : "添加"}成功`)
                closeFn(true)
                form.resetFields()
            } else {
                message.error(res.msg)
            }
        })
    };

    // set form values.
    const [formValues, setFormValues] = useState<UpdateItemParam | undefined>(undefined)
    useEffect(() => {
        let cates = null
        if (obj?.cates1 && obj.cates2) {
            // cates = [obj.cates1, obj.cates2]
            // todo
            cates = [0, 1]
        }
        let _formValues: UpdateItemParam = {
            barcode: obj?.barcode || '',
            cates: cates,
            // todo
            price: 0, cost: 0, number: '', cate1_id: 0, cate2_id: 1,
            color: obj?.color || '',
            name: obj?.name || '',
            size: obj?.size || '',
            unit: obj?.unit || '',
            images: obj?.images || [],
            notes: obj?.notes || '',
            id: obj?.id || 0
        }
        console.log(_formValues)

        setFormValues(_formValues)
        form.setFieldsValue(_formValues)
    }, [obj])

    // set cates options
    const [options, setOptions] = useState<Option[]>([])
    useEffect(() => {
        if (isLoading) {
            return
        }

        let ops: Option[] = []

        // todo
        // for (let cate of cates) {
        //     let op: Option = {
        //         children: [],
        //         label: cate.name,
        //         value: cate.name
        //     }
        //
        //     cate.sub_cates.map(sub_cate => {
        //         op.children?.push({
        //             children: [],
        //             label: sub_cate,
        //             value: sub_cate
        //         })
        //     })
        //     ops.push(op)
        // }

        if (ops.length > 0) {
            setOptions(ops)
        }
    }, [cates, isLoading])

    const {
        trigger: callUpdateAPI,
        isMutating: callingUpdateAPI
    } = useSWRMutation("/api/item/edit", updateItem)

    const [fileList, setFileList] = useState<UploadFile[]>([])

    return (
        <div>
            <Modal
                width={700}
                open={open}
                centered={true}
                title={`${obj ? "修改" : "添加"}产品`}
                onCancel={(e) => {
                    e.preventDefault()
                    form.resetFields()
                    closeFn(false)
                }}
                onOk={() => form.submit()}
                closable={true}
                confirmLoading={callingUpdateAPI}
            >
                <Form
                    form={form}
                    name="basic"
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    initialValues={{formValues}}
                    onFinish={onFinish}
                >
                    <div>
                        <Form.Item
                            label={"产品图片"}
                        >
                            <MultipleImageUploader fileList={fileList} handleNewFileList={(newFileList)=> {
                                setFileList(newFileList)
                            }}/>
                        </Form.Item>
                    </div>

                    <div className='grid grid-cols-2'>
                        <Form.Item
                            label="产品名"
                            name="name"
                            rules={[{required: true, message: '请输入产品名!'}]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="英文名"
                            name="english_name"
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="类别"
                            name="cates"
                        >
                            {/*<CatesCascader/>*/}
                            <Cascader options={options}/>
                        </Form.Item>

                        <Form.Item
                            label="货号"
                            name="goods_no"
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="条码"
                            name="barcode"
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="规格"
                            name="size"
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="单位"
                            name="unit"
                        >
                            <Input/>
                        </Form.Item>
                    </div>

                    <div className='grid grid-cols-2 mt-6'>
                        <Form.Item
                            label="售价"
                            name="sell_price"
                        >
                            <InputNumber style={{width: 180}}/>
                        </Form.Item>
                        <Form.Item
                            label="进货价"
                            name="buy_price"
                        >
                            <InputNumber style={{width: 180}}/>
                        </Form.Item>
                    </div>

                    <div className='grid grid-cols-2 mt-6'>
                        <Form.Item
                            label="品牌"
                            name="brand"
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="供应商"
                            name="supplier"
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="材质"
                            name="material"
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="件数(PCS)"
                            name="pcs"
                        >
                            <InputNumber/>
                        </Form.Item>
                        <Form.Item
                            label="重量"
                            name="weight"
                        >
                            <InputNumber/>
                        </Form.Item>

                        <Form.Item
                            label="描述"
                            name="description"
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="备注"
                            name="notes"
                        >
                            <Input/>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </div>
    )
}

export default EditModal
