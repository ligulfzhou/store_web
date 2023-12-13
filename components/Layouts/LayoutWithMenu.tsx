import React, {FC, ReactNode} from 'react';
import {
    BarsOutlined,
    DollarCircleOutlined,
    LineChartOutlined,
    SettingOutlined,
    StockOutlined,
    UserOutlined
} from '@ant-design/icons';
import {Avatar, Dropdown, Layout, Menu, MenuProps, message, Spin} from 'antd';
import {useRouter} from "next/router";
import {useIsMounted} from "@/hooks/useIsMounted";
import useAccountInfo from "@/hooks/useAccountInfo";
import {usePathname} from "next/navigation";
import useSWRMutation from "swr/mutation";
import {logout} from "@/requests/account";

const {Header, Content, Sider} = Layout;

const menuItems: MenuProps["items"] = [
    {
        key: "home",
        icon: React.createElement(LineChartOutlined),
        label: "统计",
        children: [
            {
                key: "/",
                label: "统计"
            },
        ]
    },
    {
        key: "items",
        icon: React.createElement(BarsOutlined),
        label: "产品",
        children: [
            {
                key: "/items",
                label: "产品"
            },
            {
                key: "/items/embryo",
                label: "库存胚"
            },
            {
                key: "/items/cates",
                label: "产品类别"
            },
        ]
    },
    {
        key: "stock",
        icon: React.createElement(StockOutlined),
        label: "库存",
        children: [
            {
                key: "/stock",
                label: "库存"
            },
            {
                key: "/stock/item",
                label: "产品-出入库"
            },
            {
                key: "/stock/embryo",
                label: "库存胚-出入库"
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
                'label': '订单列表'
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
    },
    {
        key: 'settings',
        icon: React.createElement(SettingOutlined),
        label: "配置",
        children: [
            {
                key: "/settings/ctype",
                label: "客户类型"
            },
            {
                key: "/settings/color",
                label: "颜色=>编码"
            },
            {
                key: "/settings/unit_account",
                label: "单位 和 收款账号"
            },
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
        } else if (pathname.startsWith('/customer')) {
            return 'customer'
        } else if (pathname.startsWith('/items')) {
            return 'items'
        } else if (pathname.startsWith("/setting")) {
            return "settings"
        } else if (pathname.startsWith("/stock")) {
            return 'stock'
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
                <div className='flex flex-row items-center justify-items-center'>
                    {isLoading ? (
                        <div>
                            <Spin/>
                            <Avatar icon={<UserOutlined/>}/>
                        </div>
                    ) : (
                        <div>
                            <Dropdown menu={{items: dropDownMenus}} trigger={['hover', 'click']}>
                                <div className='flex flex-row items-center justify-items-center'>
                                    <div className='text-white'>
                                        {account?.name}
                                    </div>
                                    <Avatar icon={<UserOutlined/>}/>
                                </div>
                            </Dropdown>
                        </div>
                    )}
                </div>
            </Header>
            <Layout>
                <Sider
                    width={200}
                    style={{background: 'white'}}
                    // todo: collapsible=> true
                    collapsible={false}
                    trigger={false}
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
