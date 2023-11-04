import {Table, Button} from 'antd';
import LayoutWithMenu from "@/components/Layouts/LayoutWithMenu";
import {ColumnsType} from "antd/es/table";
import useCustomers from "@/hooks/useCustomers";
import {Customer} from "@/types/customer";
import useRouterUtils from "@/hooks/useRouterUtils";
import useParameters from "@/hooks/useParameters";
import {useState} from "react";
import {useSWRConfig} from "swr"
import {CatesManagement} from "@/components/items/cates/CatesManagement";


export default function Order() {
    const {mutate} = useSWRConfig()
    const [refresh, setRefresh] = useState<boolean>(false)
    const key = '/api/cates'
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
                <CatesManagement callback={ (cate1, cate2)=> {
                    console.log(`in callback ${cate1}, ${cate2}`)
                }} />
            </div>
        </LayoutWithMenu>
    );
};
