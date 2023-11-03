import React, {FC, ReactNode} from 'react';
import { UserOutlined} from '@ant-design/icons';
import {Avatar, Dropdown, Layout, Menu, MenuProps, message} from 'antd';
import {useRouter} from "next/router";
import {useIsMounted} from "@/hooks/useIsMounted";
import useAccountInfo from "@/hooks/useAccountInfo";
import useSWRMutation from "swr/mutation";
import {logout} from "@/requests/account";

const {Header, Content, Sider} = Layout;



interface Props {
    children: ReactNode
}


const LayoutWithoutMenu: FC<Props> = (
    {
        children
    }
) => {
    const {account, code, msg, isLoading} = useAccountInfo()
    const router = useRouter()

    const {
        trigger: callLogoutAPI,
        isMutating: callingLogoutAPI
    } = useSWRMutation('/api/logout', logout)

    const isMounted = useIsMounted()
    if (!isMounted) {
        return
    }

    if (code==401) {
        console.log('redirect to /login page')
        router.push('/login')
    }

    const dropDownMenus: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <a href="#"
                   onClick={(event) => {
                       event.preventDefault()
                       callLogoutAPI().then(res => {
                           if (res.code === 0) {
                               router.replace('/login')
                           } else {
                               message.error(res.msg)
                           }
                       })
                   }}>
                    退出
                </a>
            ),
        }
    ]

    return (
        <Layout className='h-screen'>
            <Header className='flex flex-row justify-between'>
                <div className="font-bold cursor-pointer">
                    <a href='/wap' target='_self' className='text-white'>
                        lien后台管理
                    </a>
                </div>
                <div>
                    <Dropdown menu={{items: dropDownMenus}} trigger={['hover', 'click']}>
                        <div className='flex flex-row items-center'>
                            <div className='text-white'>
                                {account?.name}({account?.department})
                            </div>

                            <Avatar icon={<UserOutlined/>}/>
                        </div>
                    </Dropdown>
                </div>
            </Header>
            <Layout>
                <Layout>
                    <Content className='overflow-auto'>
                        <div className=' rounded overflow-y-auto'>
                            {children}
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};


export default LayoutWithoutMenu
