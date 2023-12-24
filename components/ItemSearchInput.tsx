import React, {FC, useState} from 'react';
import {Select} from 'antd';
import type {SelectProps} from 'antd';
import {host} from '@/utils/const'
import {Item, ListReponse, Option} from "@/types";
import useSWRMutation from "swr/mutation";
import {updateCustomer} from "@/requests";
import {searchItems} from "@/requests/item";

let timeout: ReturnType<typeof setTimeout> | null;
let currentValue: string;

const fetch_api = (value: string, callback: Function) => {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    currentValue = value;

    const api = () => {
        fetch(`${host}/api/item/search?barcode=${value}`, {
            credentials: "include"
        }).then(data => data.json()).then((data: ListReponse<Item>) => {
            console.log(data)

            let ops = data.data.list.map(item => {
                let op: Option = {
                    label: `编号: ${item.number}, 颜色: ${item.color}, 品名: ${item.name}`,
                    value: JSON.stringify(item),
                }

                return op
            })
            console.log(ops)
            callback(ops)
        })
    };

    timeout = setTimeout(api, 300);
};

interface Props {
    placeholder: string;
    style: React.CSSProperties;
    itemSelectedFn: (item: Item | undefined) => void
    value: string,
    setValue: Function
}

const SearchInput: FC<Props> = (
    {
        placeholder,
        itemSelectedFn,
        style,
        value,
        setValue
    }
) => {
    const [data, setData] = useState<SelectProps['options']>([]);
    // const [value, setValue] = useState<string>('');

    // const {
    //     trigger: callAPI,
    //     isMutating: callingAPI
    // } = useSWRMutation("/api/item/search", searchItems);
    const handleSearch = (newValue: string) => {
        if (newValue) {
            fetch_api(newValue, setData);
        } else {
            setData([]);
        }
    };

    const handleChange = (newValue: string) => {
        setValue(newValue);
        if (newValue) {
            let item: Item = JSON.parse(newValue)
            itemSelectedFn(item)
        } else {
            itemSelectedFn(undefined)
        }
    };

    return (
        <Select
            showSearch
            value={value}
            placeholder={placeholder}
            style={style}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={handleSearch}
            onChange={handleChange}
            notFoundContent={null}
            options={data}
        />
    );
};

export default SearchInput
