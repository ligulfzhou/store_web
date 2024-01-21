import React, {FC, useContext, useEffect, useRef, useState} from "react";
import {Modal, Button, Table, Popconfirm, FormInstance, Form, InputRef, Input, message, Select} from "antd";
import SearchInput from "@/components/ItemSearchInput";
import {Item, Option} from "@/types";
import useSWRMutation from "swr/mutation";
import useCustomers from "@/hooks/useCustomers";
import {createOrder} from "@/requests/order";

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface EditableRowProps {
    index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({index, ...props}) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: keyof DataType;
    record: DataType;
    handleSave: (record: DataType) => void;
}

const EditableCell: React.FC<EditableCellProps> = (
    {
        title,
        editable,
        children,
        dataIndex,
        record,
        handleSave,
        ...restProps
    }
) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const form = useContext(EditableContext)!;

    useEffect(() => {
        if (editing) {
            inputRef.current!.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({[dataIndex]: record[dataIndex]});
    };

    const save = async () => {
        try {
            const values = await form.validateFields();

            toggleEdit();
            handleSave({...record, ...values});
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{margin: 0}}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save}/>
            </Form.Item>
        ) : (
            <div className="editable-cell-value-wrap" style={{paddingRight: 24}} onClick={toggleEdit}>
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
    id: number
    number: string
    size: string
    count: number
    unit: string
    price: number
    discount: number
    discount_price: number
    name: string
    current_count: number
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;


interface Props {
    open: boolean,
    closeFn: (success: boolean) => void,
}

const CreateOrderModal: FC<Props> = (
    {
        open,
        closeFn,
    }
) => {
    const [selectedItem, setSelectedItem] = useState<Item | undefined>(undefined)

    useEffect(() => {
        console.log(`open ... ${open}`)
        if (!open) {
            setDataSource([])
            setValue('')
        }
    }, [open]);

    const [dataSource, setDataSource] = useState<DataType[]>([]);
    const [count, setCount] = useState(0);

    const {customers, isLoading: customersLoading} = useCustomers()
    const [customerOptions, setCustomerOptions] = useState<Option[]>([])
    const [customerId, setCustomerId] = useState<number>(0)
    useEffect(() => {
        if (customersLoading) {
            return
        }
        let customerOptions = customers.map(customer => {
            let op: Option = {
                label: `${customer.name}-${customer.phone}-${customer.address}`,
                value: customer.id.toString()
            }
            return op
        })
        setCustomerOptions(customerOptions)
    }, [customers, customersLoading]);

    const handleDelete = (key: string) => {
        const newData = dataSource.filter(item => item.id.toString() !== key);
        setDataSource(newData);
    };

    // @ts-ignore
    const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
        {
            title: '货号',
            dataIndex: 'number',
        },
        {
            title: '规格',
            dataIndex: 'size',
        },
        {
            title: '当前库存',
            dataIndex: 'current_count',
        },
        {
            title: '销售数',
            dataIndex: 'count',
            editable: true
        },
        {
            title: '单位',
            dataIndex: 'unit',
        },
        {
            title: '单价',
            dataIndex: 'price',
            // @ts-ignore
            render: (_, record: DataType) => (
                <div>
                    {record.price / 100}
                </div>
            )
        },
        {
            title: "折扣",
            dataIndex: 'discount',
            editable: true,
            // @ts-ignore
            render: (_, record: DataType) => (
                <div>
                    {record.discount} %
                </div>
            )
        },
        {
            title: "折后价",
            dataIndex: 'discount_price',
            editable: true,
            // @ts-ignore
            render: (_, record: DataType) => (
                <div>
                    {record.discount_price}
                </div>
            )
        },
        {
            title: '总金额',
            dataIndex: 'total',
            // @ts-ignore
            render: (_, record: DataType) => (
                <div>
                    {/*{record.count * record.price * record.discount / 10000}¥*/}
                    {record.count * record.discount_price}¥
                </div>
            )
        },
        {
            title: '操作',
            dataIndex: 'operation',
            // @ts-ignore
            render: (_, record: object & DataType) =>
                // render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id.toString())}>
                        <a>删除这条</a>
                    </Popconfirm>
                ) : null,
        },
    ];

    const handleAdd = () => {
        if (!selectedItem) {
            message.warn("请重选产品")
            return
        }

        // 检查是否已经加入
        if (dataSource.filter(item => item.id == selectedItem.id).length > 0) {
            message.warn("已经添加")
            return;
        }

        const newData: DataType = {
            discount_price: selectedItem.price/100,
            size: selectedItem.size,
            unit: selectedItem.unit,
            number: selectedItem.number,
            name: selectedItem.name,
            price: selectedItem.price,
            count: 0,
            discount: 100,
            id: selectedItem.id,
            current_count: selectedItem.count
        };
        setDataSource([...dataSource, newData]);
        setValue('')
        setCount(count + 1);
    };

    const handleSave = (row: DataType) => {
        const newData = [...dataSource];
        const index = newData.findIndex(item => row.id === item.id);
        const item = newData[index];
        console.log('handleSave...')
        console.log(`new: ${row.discount_price}, ${row.discount}, old: ${item.discount_price}, ${item.discount}`)
        if (row.discount != item.discount) {
            row.discount_price = row.price * row.discount / 10000
        } else if (row.discount_price != item.discount_price) {
            let discount = row.discount_price / row.price * 10000
            row.discount = Math.round(discount)
        }

        newData.splice(index, 1, {
            ...item,
            ...row,
        });

        setDataSource(newData);
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const columns = defaultColumns.map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: DataType) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    const [value, setValue] = useState<string>('');

    const {
        trigger: callCreateOrderAPI,
        isMutating: callingCreateOrderAPI
    } = useSWRMutation("/api/orders/create", createOrder)
    const [form] = Form.useForm();

    const onFinish = () => {
        console.log('onFinish...')
    }

    return (
        <div>
            <Modal
                width={'1200px'}
                open={open}
                centered={true}
                title={`销售`}
                onCancel={(e) => {
                    e.preventDefault()
                    closeFn(false)
                }}
                closable={true}
                confirmLoading={callingCreateOrderAPI}
                onOk={() => {
                    console.log(dataSource)
                    console.log(customerId)
                    let items = dataSource.map(item => ({
                        item_id: item.id,
                        count: typeof item.count == 'string' ? parseInt(item.count) : item.count,
                        discount: typeof item.discount == 'string' ? parseInt(item.discount) : item.discount,
                        discount_price: typeof item.discount_price == 'string' ? parseInt(item.discount_price)*100: item.discount_price*100
                    }))
                    // console.log(`items: ${items[0].discount_price}`)
                    callCreateOrderAPI({
                        customer_id: customerId,
                        items
                    }).then(data => {
                        if (data.code == 0) {
                            message.success("订单创建成功")
                            closeFn(true)
                        } else {
                            message.warning(`失败☹️  ${data.msg}`)
                        }
                    })
                }}
                okButtonProps={{disabled: dataSource.length == 0}}
            >
                <div className='flex flex-row gap-4'>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{span: 8}}
                        wrapperCol={{span: 16}}
                        onFinish={onFinish}
                    >
                        <div className=''>
                            <Form.Item
                                label="客户"
                                name="customerId"
                                rules={[{required: true, message: '请选择客户!'}]}
                            >
                                <Select
                                    style={{width: 300}}
                                    loading
                                    onChange={(value) => {
                                        console.log(value)
                                        let customerId = typeof value == 'string'? parseInt(value): value
                                        setCustomerId(customerId)
                                    }}
                                    options={customerOptions}
                                />
                            </Form.Item>
                        </div>

                        <div className=''>
                            <Form.Item
                                label="选择产品"
                                name="items"
                            >
                                <div className='flex flex-row gap-2'>
                                    <SearchInput
                                        placeholder={"输入条形码来搜索"}
                                        style={{width: '712px'}}
                                        itemSelectedFn={(item: Item | undefined) => {
                                            setSelectedItem(item)
                                        }}
                                        setValue={setValue}
                                        value={value}
                                    />
                                    <Button onClick={handleAdd} type="primary" style={{marginBottom: 16}}
                                            disabled={selectedItem == undefined}>
                                        添加
                                    </Button>
                                </div>
                            </Form.Item>
                        </div>
                    </Form>
                </div>

                <div className='p-5 m-2 bg-white rounded'>
                    <div
                        className='font-bold mb-4'>待销售的产品列表: {dataSource.map(item => item.discount * item.count * item.price / 10000).reduce((x, y) => x + y, 0)}¥,
                        产品数: {dataSource.length}
                    </div>
                    <Table
                        rowKey={`id`}
                        size={"small"}
                        components={components}
                        columns={columns as ColumnTypes}
                        dataSource={dataSource}
                        pagination={false}
                    />
                </div>
            </Modal>
        </div>
    );
}

export default CreateOrderModal
