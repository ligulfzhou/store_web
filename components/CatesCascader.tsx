// import React, {useEffect, useState} from "react";
// import {Cascader} from "antd";
// import useCates from "@/hooks/useCates";
//
// interface Option {
//     value: string;
//     label: string;
//     children?: Option[];
// }
//
// const OrderModal = () => {
//     const {cates, isLoading} = useCates()
//
//     const [options, setOptions] = useState<Option[]>([])
//     useEffect(() => {
//         if (isLoading) {
//             return
//         }
//
//         let ops: Option[] = []
//         for (let cate of cates) {
//             let op: Option = {
//                 children: [],
//                 label: cate.name,
//                 value: cate.name
//             }
//
//             cate.sub_cates.map(sub_cate => {
//                 op.children?.push({
//                     children: [],
//                     label: sub_cate,
//                     value: sub_cate
//                 })
//             })
//             ops.push(op)
//         }
//
//         if (ops.length > 0) {
//             setOptions(ops)
//         }
//
//     }, [cates, isLoading])
//
//     const onChange = (value: string[]) => {
//         console.log(value);
//     };
//
//
//     return (
//         <Cascader options={options}/>
//     )
// }
//
// export default OrderModal
