import useSWRMutation from "swr/mutation";
import {login} from "@/requests/account";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {Button, Form, Input, message} from "antd";
import {useRouter} from "next/router";
import {useWindowSize} from "@/hooks/useWindowSize";


export default function Index() {
    const {
        trigger: callLoginAPI,
        isMutating: callingLoginAPI
    } = useSWRMutation("/api/login", login)

    const router = useRouter()
    // console.log(headers())

    const {width: windowWidth} = useWindowSize()

    const onFinish = (values: {account: string, password: string}) => {
        console.log('Success:', values);

        callLoginAPI({
            account: values.account,
            password: values.password
        }).then(res=> {
            if (res.code==0) {
                if(!!windowWidth && windowWidth < 992){
                    router.replace('/wap')
                } else {
                    router.replace('/')
                }
            } else {
                message.error(res.msg)
            }
        })
    };

    return (
        <div
            className="bg-[url('/login_bg.jpeg')] flex flex-row justify-start items-center h-screen w-full"
        >
            {/*login form*/}
            <div className='relative rounded-lg backdrop-brightness-125 bg-white/30 ml-12 z-10'>
                <div className='p-8'>
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="账户"
                            name="account"
                            rules={[{required: true, message: '请输入账号!'}]}
                        >
                            <Input size="middle" placeholder="账号" prefix={<UserOutlined /> } />
                        </Form.Item>

                        <Form.Item
                            label="密码"
                            name="password"
                            rules={[{required: true, message: '请输入密码!'}]}
                        >
                            <Input.Password prefix={<LockOutlined />}/>
                        </Form.Item>

                        <Form.Item >
                            <Button
                                loading={callingLoginAPI}
                                className='w-full rounded'
                                type="primary" htmlType="submit"
                            >
                                登陆
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};
