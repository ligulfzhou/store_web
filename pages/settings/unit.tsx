import {Table, Button, Image} from 'antd';
import LayoutWithMenu from "@/components/Layouts/LayoutWithMenu";
import {ColumnsType} from "antd/es/table";
import useRouterUtils from "@/hooks/useRouterUtils";
import useParameters from "@/hooks/useParameters";
import React, {useState} from "react";
import {useSWRConfig} from "swr"
import {formatDateTime} from "@/utils/utils";
import useItems from "@/hooks/useItems";
import {Item} from "@/types/item";
import {fallbackImage} from "@/utils/b64";


export default function() {
    const {page, pageSize} = useParameters()
    const {items, total, isLoading, key} = useItems();
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
    const {reloadPage} = useRouterUtils()
    const {mutate} = useSWRConfig()

    const [refresh, setRefresh] = useState<boolean>(false)
    const [editItem, setEditItem] = useState<Item | undefined>()

    return (
        <LayoutWithMenu>
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

                    <Button
                        className='mb-4'
                        type="primary"
                        onClick={() => {
                            setEditItem(undefined)
                            setIsEditModalOpen(true)
                        }}
                    >
                        添加
                    </Button>
                </div>

                <div className='w-128 h-96 border-2 border-gray-50'>

                </div>

            </div>
        </LayoutWithMenu>
    );
};
