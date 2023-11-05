import {Table, Space, Button} from 'antd';
import LayoutWithMenu from "@/components/Layouts/LayoutWithMenu";
import {ColumnsType} from "antd/es/table";
import useCustomers from "@/hooks/useCustomers";
import {Customer} from "@/types/customer";
import useRouterUtils from "@/hooks/useRouterUtils";
import useParameters from "@/hooks/useParameters";
import {defaultPageSize} from "@/utils/const";
import {useState} from "react";
import {useSWRConfig} from "swr"
import EditCustomerModal from "@/components/customer/EditCustomerModal";
import AddCustomerButton from "@/components/customer/AddCustomerButton";


export default function Order() {
    const {page, pageSize} = useParameters()
    const {customers, total, isLoading, isError, key} = useCustomers()
    const [isEditCustomerModalOpen, setIsEditCustomerModalOpen] = useState<boolean>(false)
    const {reloadPage} = useRouterUtils()
    const {mutate} = useSWRConfig()
    const columns: ColumnsType<Customer> = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: '客户编号',
            dataIndex: "customer_no",
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
