import React, {FC, useContext, useEffect, useRef, useState} from "react";
import {Modal, Button, Table, Popconfirm, FormInstance, Form, InputRef, Input, message} from "antd";
import SearchInput from "@/components/ItemSearchInput";
import {Item} from "@/types";
import useSWRMutation from "swr/mutation";
import {itemStockOut, searchItems} from "@/requests/item";

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
    id: number;
    name: string;
    count: number|string;
    current_count: number,
    price: number;
    barcode: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;


interface Props {
    open: boolean,
    closeFn: (success: boolean) => void,
}

const StockOutModal: FC<Props> = (
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
    const handleDelete = (key: string) => {
        const newData = dataSource.filter(item => item.id.toString() !== key);
        setDataSource(newData);
    };


    // @ts-ignore
    const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
        {
            title: '产品',
            dataIndex: 'name',
        },
        {
            title: '条码',
            dataIndex: 'barcode',
        },
        {
            title: '单位',
            dataIndex: 'name',
        },
        {
            title: '价格',
            dataIndex: 'price',
            // @ts-ignore
            render: (_, record: DataType) => (
                <div>
                    {record.price / 100}
                </div>
            )
        },
        {
            title: '当前库存',
            dataIndex: 'current_count',
        },
        {
            title: '出库数',
            dataIndex: 'count',
            editable: true
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
            name: selectedItem.name,
            price: selectedItem.price,
            count: 0,
            id: selectedItem.id,
            barcode: selectedItem.barcode,
            current_count: selectedItem.count,
        };
        setDataSource([...dataSource, newData]);
        setValue('')
        setCount(count + 1);
    };

    const handleSave = (row: DataType) => {
        const newData = [...dataSource];
        const index = newData.findIndex(item => row.id === item.id);
        const item = newData[index];
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
        trigger: callStockOutAPI,
        isMutating: callingStockOutAPI
    }= useSWRMutation("/api/item/stock/out", itemStockOut)

    return (
        <div>
            <Modal
                width={'1200px'}
                open={open}
                centered={true}
                title={`出库`}
                onCancel={(e) => {
                    e.preventDefault()
                    closeFn(false)
                }}
                closable={true}
                onOk={()=> {
                    console.log(dataSource)
                    let items = dataSource.map(item=> ({
                        item_id: item.id,
                        count: typeof item.count == 'number'? item.count: parseInt(item.count)
                    }))

                    callStockOutAPI({
                        items: items
                    }).then(data=> {
                        if(data.code==0) {
                            message.success("出库成功")
                            closeFn(true)
                        } else {
                            message.warning("失败☹️")
                        }
                    })

                }}
                okButtonProps={{disabled: dataSource.length==0}}
            >
                <div className='flex flex-row gap-4'>
                    <SearchInput
                        placeholder={"输入条形码来搜索"}
                        style={{width: '512px'}}
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
                <div className='p-5 m-2 bg-white rounded'>
                    <div className='font-bold mb-4'> 导出的产品列表</div>
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

export default StockOutModal
