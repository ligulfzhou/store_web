import '@/styles/globals.css'
import 'antd/dist/antd.css'
import type {AppProps} from 'next/app'
import {ConfigProvider} from 'antd';
import zhCN from 'antd/lib/locale/zh_CN'


export default function App({Component, pageProps}: AppProps) {
    return (
        <ConfigProvider locale={zhCN}>
            <Component {...pageProps} />
        </ConfigProvider>
    )
}
