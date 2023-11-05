import React, {FC, ReactNode} from 'react';
import {DollarCircleOutlined, LineChartOutlined, UserOutlined} from '@ant-design/icons';
import {Avatar, Dropdown, Layout, Menu, MenuProps, message} from 'antd';
import {useRouter} from "next/router";
import {useIsMounted} from "@/hooks/useIsMounted";
import useAccountInfo from "@/hooks/useAccountInfo";
import {usePathname} from "next/navigation";
import useSWRMutation from "swr/mutation";
import {logout} from "@/requests/account";

const {Header, Content, Sider} = Layout;

const menuItems: MenuProps["items"] = [
    // {
    //     key: "home",
    //     icon: React.createElement(LineChartOutlined),
    //     label: "统计",
    //     children: [
    //         {
    //             key: "/",
    //             label: "统计"
    //         },
    //         {
    //             key: "/stats/returnOrder/goods",
    //             label: "复购(款式)"
    //         },
    //         {
    //             key: "/stats/returnOrder/items",
    //             label: "复购(款式+颜色)"
    //         },
    //     ]
    // },
    {
        key: "items",
        icon: React.createElement(LineChartOutlined),
        label: "产品",
        children: [
            {
                key: "/items",
                label: "所有产品"
            },
            {
                key: "/items/cates",
                label: "产品类别"
            },
        ]
    },
    {
        key: 'orders',
        icon: React.createElement(DollarCircleOutlined),
        label: "销售",
        children: [
            {
                'key': '/order',
                'label': '所有客户'
            }
        ]
    },
    {
        key: 'customer',
        icon: React.createElement(UserOutlined),
        label: "客户",
        children: [
            {
                key: "/customer",
                label: "客户列表"
            }
        ]
    }
]

interface Props {
    children: ReactNode
}


const LayoutWithMenu: FC<Props> = (
    {
        children
    }
) => {
    const {account, code, isLoading} = useAccountInfo()
    const router = useRouter()
    const {push} = router;
    const pathname = usePathname()
    console.log(pathname)

    const {
        trigger: callLogoutAPI,
        isMutating: callingLogoutAPI
    } = useSWRMutation('/api/logout', logout)

    const isMounted = useIsMounted()
    if (!isMounted || !pathname) {
        return
    }

    if (code == 401) {
        console.log('redirect to /login page')
        router.push('/login')
    }

    const openedKeyFromPathname = (pathname: string) => {
        if (pathname.startsWith("/order")) {
            return "orders"
        } else if (pathname == '/' || pathname.startsWith("/stats")) {
            return 'home'
        } else if (pathname == '/customer') {
            return 'customer'
        } else if (pathname.startsWith('/items')) {
            return 'items'
        } else {
            return ''
        }
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
            <Header className='flex flex-row justify-between justify-items-center'>
                <div className="font-bold cursor-pointer">
                    <a href='/' target='_self' className='text-white'>
                        门店管理后台
                    </a>
                </div>
                <div className=''>
                    <Dropdown menu={{items: dropDownMenus}} trigger={['hover', 'click']}>
                        <div className='flex flex-row items-center justify-items-center'>
                            <div className='text-white'>
                                {account?.name}({account?.department})
                            </div>

                            <Avatar icon={<UserOutlined/>}/>
                        </div>
                    </Dropdown>
                </div>
            </Header>
            <Layout>
                <Sider
                    width={200}
                    style={{background: 'white'}}
                    collapsible={true}
                    trigger={null}
                >
                    <Menu
                        multiple={false}
                        onClick={(env) => {
                            push(env.key)
                        }}
                        mode="inline"
                        defaultSelectedKeys={[pathname]}
                        defaultOpenKeys={[openedKeyFromPathname(pathname)]}
                        style={{height: '100%', borderRight: 0}}
                        items={menuItems}
                    />
                </Sider>
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

export default LayoutWithMenu;
