import {Table, Button} from 'antd';
import LayoutWithMenu from "@/components/Layouts/LayoutWithMenu";
import {ColumnsType} from "antd/es/table";
import useCustomers from "@/hooks/useCustomers";
import {Customer} from "@/types/customer";
import useRouterUtils from "@/hooks/useRouterUtils";
import useParameters from "@/hooks/useParameters";
import {defaultPageSize} from "@/utils/const";
import React, {useState} from "react";
import {useSWRConfig} from "swr"
import EditCustomerModal from "@/components/customer/EditCustomerModal";
import OrderSearchForm from "@/components/order/OrderSearchForm";
import CustomerSearchForm from "@/components/customer/CustomerSearchForm";
import {formatDateTime} from "@/utils/utils";


export default function Order() {
    const {page, pageSize} = useParameters()
    const {customers, total, isLoading, isError, key} = useCustomers()
    const [isEditCustomerModalOpen, setIsEditCustomerModalOpen] = useState<boolean>(false)
    const {reloadPage} = useRouterUtils()
    const {mutate} = useSWRConfig()
    /*
        id: number,
    customer_no: string,
    ty_pe: number | string,
    name: string,
    head: string,
    address: string,
    email: string,
    birthday: string | null,
    qq: string,
    phone: string,
    notes: string,

    * */
    const columns: ColumnsType<Customer> = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: '客户名称',
            dataIndex: 'name',
        },
        {
            title: '负责人',
            dataIndex: 'head',
        },
        {
            title: '手机号',
            dataIndex: 'phone',
        },
        {
            title: '客户编号',
            dataIndex: "customer_no",
        },
        {
            title: '创建时间',
            key: 'create_time',
            render: (_, record)=> (
                <div>
                    {formatDateTime(new Date(record.create_time))}
                </div>
            )
        },
        {
            title: '备注',
            dataIndex: "notes",
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <a href='#' onClick={(event) => {
                    event.preventDefault()
                    setCustomer(record)
                    setIsEditCustomerModalOpen(true)
                }}>
                    查看
                </a>
            ),
        },
    ];

    const [refresh, setRefresh] = useState<boolean>(false)
    const [customer, setCustomer] = useState<Customer | undefined>()

    return (
        <LayoutWithMenu>
            <EditCustomerModal
                open={isEditCustomerModalOpen}
                closeFn={(success) => {
                    setIsEditCustomerModalOpen(false)
                    if (success) {
                        setRefresh(true)
                        mutate(key).finally(() => setRefresh(false))
                    }
                }}
                customer={customer}
            />

            {/*filters*/}
            <div className='bg-white p-5 m-2 rounded'>
                <CustomerSearchForm />
            </div>

            <div className='p-5 m-2 bg-white rounded'>
                <div className='mb-2 gap-4 flex flex-row justify-start'>
                    <Button
                        className='mb-4'
                        loading={refresh}
                        type="primary"
                        onClick={() => {
                            setRefresh(true)
                            mutate(key).finally(() => setRefresh(false))
                        }}
                    >
                        刷新
                    </Button>

                    {/*<AddCustomerButton/>*/}

                    <Button
                        className='mb-4'
                        loading={refresh}
                        type="primary"
                        onClick={() => {
                            setCustomer(undefined)
                            setIsEditCustomerModalOpen(true)
                        }}
                    >
                        添加
                    </Button>
                </div>

                <Table
                    rowKey={'id'}
                    bordered={true}
                    size={"small"}
                    loading={isLoading || refresh}
                    columns={columns}
                    pagination={{
                        total: total,
                        current: page,
                        defaultPageSize: defaultPageSize,
                        pageSize: pageSize,
                        onChange: (thisPage, thisPageSize) => {
                            reloadPage({
                                page: thisPage,
                                pageSize: thisPageSize
                            })
                        }
                    }}
                    dataSource={customers}
                />
            </div>
        </LayoutWithMenu>
    );
};
