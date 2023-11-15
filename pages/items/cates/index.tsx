import {Button, Space, Table} from 'antd';
import LayoutWithMenu from "@/components/Layouts/LayoutWithMenu";
import {useState} from "react";
import {useSWRConfig} from "swr"
import useCates from "@/hooks/useCates";
import {ColumnsType} from "antd/es/table";
import {Cate} from "@/types";


export default function () {
    const {mutate} = useSWRConfig()
    const [refresh, setRefresh] = useState<boolean>(false)
    const {cates, key, isLoading, isError} = useCates()
    console.log(cates)

    const columns: ColumnsType<Cate> = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: "类名",
            dataIndex: "name",
        },
        {
            title: "子类数",
            dataIndex: "sub_cates"
        },
        {
            title: '操作',
            key: 'action',
            render: () => (
                <Space size="middle">
                </Space>
            ),
        },
    ];

    return (
        <LayoutWithMenu>
            <div className='p-5 m-2 bg-white rounded'>
                <Button
                    loading={refresh}
                    type="primary"
                    onClick={() => {
                        setRefresh(true)
                        mutate(key).finally(() => setRefresh(false))
                    }}
                >
                    刷新
                </Button>
            </div>

            <div className='p-5 m-2 bg-white rounded'>

                <Table
                    rowKey={`id`}
                    size={"small"}
                    loading={isLoading || refresh}
                    columns={columns}
                    dataSource={cates}
                />
                {/*<CatesManagement callback={ (cate1, cate2)=> {*/}
                {/*    console.log(`in callback ${cate1}, ${cate2}`)*/}
                {/*}} />*/}
            </div>
        </LayoutWithMenu>
    );
};
