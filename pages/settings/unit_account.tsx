import {Button, Input, message, Spin, Tag} from 'antd';
import LayoutWithMenu from "@/components/Layouts/LayoutWithMenu";
import React, {useEffect, useRef, useState} from "react";
import type {InputRef} from 'antd';
import useGlobalSettings from "@/hooks/useGlobalSettings";
import {PlusOutlined} from "@ant-design/icons";
import {useIsMounted} from "@/hooks/useIsMounted";
import {isArrSame} from "@/utils/arr";
import {useSWRConfig} from "swr";
import useSWRMutation from "swr/mutation";
import {updateGlobalSettings} from "@/requests/settings";

type UnitOrAccount = 'account' | 'unit' | ''

export default function () {
    const {globalSettings, isLoading, key} = useGlobalSettings()
    const [refresh, setRefresh] = useState<boolean>(false)
    const [unitOrAccount, setUnitOrAccount] = useState<UnitOrAccount>('')

    const [tags, setTags] = useState<string[]>([])
    const [inputVisible, setInputVisible] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<InputRef>(null);

    const [tags2, setTags2] = useState<string[]>([])
    const [inputVisible2, setInputVisible2] = useState<boolean>(false);
    const [inputValue2, setInputValue2] = useState('');
    const inputRef2 = useRef<InputRef>(null);

    const {mutate} = useSWRConfig()
    const {
        trigger: callAPI,
        isMutating: callingAPI
    } = useSWRMutation("/api/settings/global/update", updateGlobalSettings)

    useEffect(() => {
        if (isLoading) {
            return
        }
        setTags(globalSettings?.units || [])
        setTags2(globalSettings?.accounts || [])
    }, [globalSettings, isLoading]);

    useEffect(() => {
        if (inputVisible) {
            inputRef.current?.focus();
        }
        if (inputVisible2) {
            inputRef2.current?.focus();
        }
    }, []);

    if (!useIsMounted()) {
        return
    }

    const updateSettings = (unitAccout: UnitOrAccount) => {
        setUnitOrAccount(unitAccout)
        callAPI({
            units: tags,
            accounts: tags2
        }).then(res => {
            if (res.code == 0) {
                message.success(`修改成功`)
                setUnitOrAccount('')
                setRefresh(true)
                mutate(key).finally(() => setRefresh(false))
            } else {
                setUnitOrAccount('')
                message.error(res.msg)
            }
        })
    }
    const handleClose = (removedTag: string) => {
        const newTags = tags.filter(tag => tag !== removedTag);
        console.log(newTags);
        setTags(newTags);
    };

    const showInput = () => {
        setInputVisible(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputConfirm = () => {
        if (inputValue && tags.indexOf(inputValue) === -1) {
            setTags([...tags, inputValue]);
        }
        setInputVisible(false);
        setInputValue('');
    };

    const handleClose2 = (removedTag: string) => {
        const newTags = tags2.filter(tag => tag !== removedTag);
        console.log(newTags);
        setTags2(newTags);
    };

    const showInput2 = () => {
        setInputVisible2(true);
    };

    const handleInputChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue2(e.target.value);
    };

    const handleInputConfirm2 = () => {
        if (inputValue2 && tags2.indexOf(inputValue2) === -1) {
            setTags2([...tags2, inputValue2]);
        }
        setInputVisible2(false);
        setInputValue2('');
    };

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
                <div className='mb-2 gap-4 flex flex-row justify-start'>
                    单位管理:
                </div>

                <div className='w-128 flex flex-row items-center'>
                    <div>
                        {isLoading || refresh ? (
                            <Spin size={'small'}/>
                        ) : (
                            <div className='flex flex-row items-center'>
                                {tags.map(tag => (
                                    // <span key={tag} style={{display: 'inline-block'}}>
                                    <Tag
                                        closable
                                        onClose={e => {
                                            e.preventDefault();
                                            handleClose(tag);
                                        }}
                                    >
                                        {tag}
                                    </Tag>
                                    // </span>
                                ))}
                            </div>
                        )}
                    </div>
                    {inputVisible && (
                        <Input
                            ref={inputRef}
                            type="text"
                            size="small"
                            style={{width: 78}}
                            value={inputValue}
                            onChange={handleInputChange}
                            onBlur={handleInputConfirm}
                            onPressEnter={handleInputConfirm}
                        />
                    )}
                    {!inputVisible && (
                        <Tag onClick={showInput} className="site-tag-plus">
                            <PlusOutlined/> 添加单位
                        </Tag>
                    )}
                </div>

                <Button
                    className='mt-10'
                    type={'primary'}
                    onClick={() => {
                        updateSettings("unit")
                    }}
                    size={'middle'}
                    disabled={isArrSame(globalSettings?.units || [], tags)}
                    loading={callingAPI && unitOrAccount == 'unit'}
                >
                    确认修改
                </Button>
            </div>


            <div className='p-5 m-2 bg-white rounded'>
                <div className='mb-2 gap-4 flex flex-row justify-start'>
                    收款账号管理:
                </div>

                <div className='w-128 flex flex-row items-center'>
                    <div>
                        {isLoading || refresh ? (
                            <Spin size={'small'}/>
                        ) : (
                            <div className='flex flex-row items-center'>
                                {tags2.map(tag => (
                                    // <span key={tag} style={{display: 'inline-block'}}>
                                    <Tag
                                        closable
                                        onClose={e => {
                                            e.preventDefault();
                                            handleClose2(tag);
                                        }}
                                    >
                                        {tag}
                                    </Tag>
                                    // </span>
                                ))}
                            </div>
                        )}
                    </div>
                    {inputVisible2 && (
                        <Input
                            ref={inputRef2}
                            type="text"
                            size="small"
                            style={{width: 78}}
                            value={inputValue2}
                            onChange={handleInputChange2}
                            onBlur={handleInputConfirm2}
                            onPressEnter={handleInputConfirm2}
                        />
                    )}
                    {!inputVisible2 && (
                        <Tag onClick={showInput2} className="site-tag-plus">
                            <PlusOutlined/> 添加收款账号
                        </Tag>
                    )}
                </div>

                <Button
                    className='mt-10'
                    type={'primary'}
                    onClick={() => {
                        updateSettings("account")
                    }}
                    size={'middle'}
                    disabled={isArrSame(globalSettings?.accounts || [], tags2)}
                    loading={callingAPI && unitOrAccount == 'account'}
                >
                    确认修改
                </Button>
            </div>

        </LayoutWithMenu>
    )
}
