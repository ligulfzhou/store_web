import {Button, Input, Tag, Tooltip} from 'antd';
import LayoutWithMenu from "@/components/Layouts/LayoutWithMenu";
import React, {useEffect, useRef, useState} from "react";
import {useSWRConfig} from "swr"
import type {InputRef} from 'antd';
import useGlobalSettings from "@/hooks/useGlobalSettings";
import {PlusOutlined} from "@ant-design/icons";


export default function () {
    const {globalSettings, isLoading, key} = useGlobalSettings()
    const {mutate} = useSWRConfig()
    const [refresh, setRefresh] = useState<boolean>(false)
    const [inputVisible, setInputVisible] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const editInputRef = useRef<InputRef>(null);
    const [inputValue, setInputValue] = useState('');
    const [editInputIndex, setEditInputIndex] = useState(-1);
    const [editInputValue, setEditInputValue] = useState('');
    const [tags, setTags] = useState<string[]>([])

    useEffect(() => {
        if (isLoading) {
            return
        }
        setTags(globalSettings?.units || [])
    }, [globalSettings, isLoading]);
    useEffect(() => {
        if (inputVisible) {
            inputRef.current?.focus();
        }
    }, [inputVisible]);
    useEffect(() => {
        editInputRef.current?.focus();
    }, [inputValue]);

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
    const handleEditInputConfirm = () => {
        const newTags = [...tags];
        newTags[editInputIndex] = editInputValue;
        setTags(newTags);
        setEditInputIndex(-1);
        setInputValue('');
    };
    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditInputValue(e.target.value);
    };
    const handleClose = (removedTag: string) => {
        const newTags = tags.filter(tag => tag !== removedTag);
        console.log(newTags);
        setTags(newTags);
    };
    const showInput = () => {
        setInputVisible(true);
    };


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
                </div>

                <div className='w-128 h-96 border-2 border-gray-50'>
                    {globalSettings?.units.map((tag, index) => {
                        if (editInputIndex === index) {
                            return (
                                <Input
                                    ref={editInputRef}
                                    key={tag}
                                    size="small"
                                    className="tag-input"
                                    value={editInputValue}
                                    onChange={handleEditInputChange}
                                    onBlur={handleEditInputConfirm}
                                    onPressEnter={handleEditInputConfirm}
                                />
                            );
                        }
                        const isLongTag = tag.length > 20;

                        const tagElem = (
                            <Tag
                                className="edit-tag"
                                key={tag}
                                closable={index !== 0}
                                onClose={() => handleClose(tag)}
                            >
                                <span
                                    onDoubleClick={e => {
                                        if (index !== 0) {
                                            setEditInputIndex(index);
                                            setEditInputValue(tag);
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                  {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                </span>
                            </Tag>
                        );
                        return isLongTag ? (
                            <Tooltip title={tag} key={tag}>
                                {tagElem}
                            </Tooltip>
                        ) : (
                            tagElem
                        );
                    })}

                    {inputVisible && (
                        <Input
                            ref={inputRef}
                            type="text"
                            size="small"
                            className="tag-input"
                            value={inputValue}
                            onChange={handleInputChange}
                            onBlur={handleInputConfirm}
                            onPressEnter={handleInputConfirm}
                        />
                    )}
                    {!inputVisible && (
                        <Tag className="site-tag-plus" onClick={showInput}>
                            <PlusOutlined /> New Tag
                        </Tag>
                    )}

                </div>
            </div>
        </LayoutWithMenu>
    )
}
