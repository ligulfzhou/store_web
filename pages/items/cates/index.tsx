import {Button, Space, Table} from 'antd';
import LayoutWithMenu from "@/components/Layouts/LayoutWithMenu";
import {useState} from "react";
import {useSWRConfig} from "swr"
import useCates from "@/hooks/useCates";
import {ColumnsType} from "antd/es/table";
import {Cate} from "@/types";
import EditModal from "@/components/items/cates/EditModal";


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
            dataIndex: "sub_cates",
            render: (_, record) => (
                <div>
                    {record.sub_cates.length}
                    {record.sub_cates.length > 0 ? (
                        <div>
                            ({record.sub_cates.join(",")})
                        </div>
                    ) : null}
                </div>
            )
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
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
    const [editObj, setEditObj] = useState<Cate | undefined>(undefined)
    const [parentId, setParentId] = useState<number>(0)
    return (
        <LayoutWithMenu>
            <EditModal
                open={isEditModalOpen}
                closeFn={(success) => {
                    setIsEditModalOpen(false)
                    if (success) {
                        setRefresh(true)
                        mutate(key).finally(() => setRefresh(false))
                    }
                }}
                obj={editObj}
                parent_id={parentId}
            />

            <div className='p-5 m-2 bg-white rounded flex flex-row gap-4'>
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

                <Button
                    loading={refresh}
                    type="primary"
                    onClick={() => {
                        setEditObj(undefined)
                        setParentId(0)
                        setIsEditModalOpen(true)
                    }}
                >
                    新增大类
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
