import React, {FC, useEffect, useState} from "react";
import {Modal, Form, Input, message, InputNumber, Cascader, UploadFile, Select} from "antd";
import useSWRMutation from "swr/mutation";
import {UpdateEmbryoParam, updateItem, UpdateItemParam} from "@/requests/item";
import useCates from "@/hooks/useCates";
import MultipleImageUploader from "@/components/uploader/MultipleImageUploader";
import {DataResponse, Option} from "@/types";
import useGlobalSettings from "@/hooks/useGlobalSettings";
import useColorValue from "@/hooks/useColorValue";
import {Embryo} from "@/types/embryo";


type imageReponse = {
    url: string
}
type UploadImageResponse = DataResponse<imageReponse>

interface Props {
    open: boolean,
    closeFn: (success: boolean) => void,
    obj: Embryo | undefined
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

    const {isLoading: gsLoading, key: gsKey, globalSettings} = useGlobalSettings()

    // set form values.
    const [formValues, setFormValues] = useState<UpdateItemParam | undefined>(undefined)

    useEffect(() => {
        if (!open) {
            return
        }

        let cates = null
        let _formValues: UpdateEmbryoParam = {
            barcode: obj?.barcode || '',
            cates: cates,
            // todo
            price: obj?.price || '',
            cost: obj?.cost || '',
            number: obj?.number || '',
            // cate1_id and cate2_id are useless
            cate1_id: obj?.cate1_id || '',
            cate2_id: obj?.cate2_id || '',
            color: obj?.color || '',
            name: obj?.name || '',
            size: obj?.size || '',
            unit: obj?.unit || '',
            images: obj?.images || [],
            notes: obj?.notes || '',
            id: obj?.id || 0
        }
        console.log(_formValues)

        let ufs = (obj?.images || []).map((image: string, index: number) => {
            let uf: UploadFile =
                {
                    uid: (index - (obj?.images || []).length).toString(),
                    name: 'image.png',
                    status: 'done',
                    url: image,
                };

            return uf
        })
        setFileList(ufs)

        setFormValues(_formValues)
        form.setFieldsValue(_formValues)
    }, [open]);

    const {colorValues, key: cvKey, isLoading: cvLoading} = useColorValue()
    const [cvOptions, setCvOptions] = useState<Option[]>([])
    useEffect(() => {
        if (cvLoading) {
            return
        }

        let ops = colorValues.map(cv => {
            let op: Option = {
                children: [],
                label: cv.color,
                value: cv.color
            }
            return op
        });
        setCvOptions(ops)
    }, [cvLoading, colorValues]);

    const [unitOptions, setUnitOptions] = useState<Option[]>([])
    useEffect(() => {
        if (gsLoading) {
            return
        }

        let ops = (globalSettings?.units || []).map(unit => {
            let op: Option = {
                children: [],
                label: unit,
                value: unit
            }

            return op
        })

        setUnitOptions(ops)

    }, [gsLoading, globalSettings]);
    // set cates options
    const [options, setOptions] = useState<Option[]>([])

    useEffect(() => {
        if (isLoading) {
            return
        }

        let ops: Option[] = []
        for (let cate of cates) {
            let op: Option = {
                children: [],
                label: cate.name,
                value: cate.id.toString()
            }

            cate.sub_cates.map(sub_cate => {
                op.children?.push({
                    children: [],
                    label: sub_cate.name,
                    value: sub_cate.id.toString()
                })
            })

            ops.push(op)
        }

        if (ops.length > 0) {
            setOptions(ops)
        }
    }, [cates, isLoading])

    const {
        trigger: callUpdateAPI,
        isMutating: callingUpdateAPI
    } = useSWRMutation("/api/item/edit", updateItem)

    const [fileList, setFileList] = useState<UploadFile[]>([])
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
                            <MultipleImageUploader fileList={fileList} handleNewFileList={(newFileList) => {
                                setFileList(newFileList)
                            }}/>
                        </Form.Item>
                    </div>

                    <div className='grid grid-cols-2'>
                        <Form.Item
                            label="名称"
                            name="name"
                            rules={[{required: true, message: '请输入名称!'}]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="类别"
                            name="cates"
                            rules={[{required: true, message: '请选择类别!'}]}
                        >
                            {/*<CatesCascader/>*/}
                            <Cascader options={options}/>
                        </Form.Item>

                        <Form.Item
                            label="编号"
                            name="number"
                            rules={[{required: true, message: '请输入编号!'}]}
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
                            label="颜色"
                            name="color"
                            rules={[{required: true, message: '请选择颜色!'}]}
                        >
                            <Select options={cvOptions}/>
                        </Form.Item>

                        <Form.Item
                            label="单位"
                            name="unit"
                        >
                            <Select options={unitOptions}/>
                        </Form.Item>
                    </div>

                    <div className='grid grid-cols-2 mt-6'>
                        <Form.Item
                            label="售价"
                            name="price"
                            rules={[{required: true, message: '请输入售价!'}]}

                        >
                            <InputNumber style={{width: 180}}/>
                        </Form.Item>
                        <Form.Item
                            label="成本"
                            name="cost"
                            rules={[{required: true, message: '请输入成本!'}]}
                        >
                            <InputNumber style={{width: 180}}/>
                        </Form.Item>
                    </div>

                    <div className='grid grid-cols-2 mt-6'>
                        <Form.Item
                            label="条码"
                            name="barcode"
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
