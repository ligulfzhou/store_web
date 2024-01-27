import {useRouter} from "next/router";
import {
    parseQueryParam,
    parseQueryParamToBoolean,
    parseQueryParamToNumber,
    parseQueryParamToNumberArray
} from "@/utils/utils";
import {defaultPageSize} from "@/utils/const";

export default function useParameters() {
    const router = useRouter()
    let {
        id,
        page,
        pageSize,
        order_id,
        // order_no,
        sorter_field,
        sorter_order,

        mpage,
        mpageSize,

        // search orders
        order_no,
        order_date_start,
        order_date_end,
        delivery_date_start,
        delivery_date_end,
        is_return_order,
        is_urgent,
        is_special,

        // 返单搜索
        ro_search,

        // customers
        phone,
        head,
        name,
        ty_pe,
        create_time_st,
        create_time_ed,

        // 出库入
        inout,

        // items
        // name, customer也有name
        // create_time_st, customer也有
        // create_time_ed, customer也有
        number,
        barcode,
        cate1_id,
        cate2_id,

        // orders
        customer_id,
        account_id,

        imported

    } = router.query

    // customers
    phone = parseQueryParam(phone)
    name = parseQueryParam(name)
    head = parseQueryParam(head)
    let ty_peN = parseQueryParamToNumber(ty_pe)
    create_time_st = parseQueryParam(create_time_st)
    create_time_ed = parseQueryParam(create_time_ed)

    // items
    let cate1IdN = parseQueryParamToNumber(cate1_id)
    let cate2IdN = parseQueryParamToNumber(cate2_id)
    number = parseQueryParam(number)
    barcode = parseQueryParam(barcode)

    // 出入库
    let in_out: boolean|undefined = undefined;
    if(inout) {
        in_out = parseQueryParamToBoolean(inout)
    }
    let idN = parseQueryParamToNumber(id)
    let pageN = parseQueryParamToNumber(page)
    let pageSizeN = parseQueryParamToNumber(pageSize)

    let mpageN = parseQueryParamToNumber(mpage)
    let mpageSizeN = parseQueryParamToNumber(mpageSize)

    sorter_field = parseQueryParam(sorter_field)
    sorter_order = parseQueryParam(sorter_order)

    order_date_start = parseQueryParam(order_date_start)
    order_date_end = parseQueryParam(order_date_end)
    delivery_date_start = parseQueryParam(delivery_date_start)
    delivery_date_end = parseQueryParam(delivery_date_end)
    let is_return_orderB = parseQueryParamToBoolean(is_return_order)
    let is_urgentB = parseQueryParamToBoolean(is_urgent)
    let is_specialB = parseQueryParamToBoolean(is_special)

    let order_idN = parseQueryParamToNumber(order_id)
    order_no = parseQueryParam(order_no)
    if (pageN == 0) {
        pageN = 1
    }
    if (pageSizeN == 0) {
        pageSizeN = defaultPageSize
    }
    if (mpageN == 0) {
        mpageN = 1
    }
    if (mpageSizeN == 0) {
        mpageSizeN = defaultPageSize
    }

    ro_search = parseQueryParam(ro_search)
    if (!ro_search) {
        ro_search = 'goods'
    }

    let accountIdN= parseQueryParamToNumber(account_id)
    let customerIdN = parseQueryParamToNumber(customer_id)

    let importedN= parseQueryParamToNumber(imported)

    return {
        id: idN,
        page: pageN,
        pageSize: pageSizeN,

        mpage: mpageN,
        mpageSize: mpageSizeN,

        // customers
        phone,
        head,
        name,
        ty_pe: ty_peN,
        create_time_st,
        create_time_ed,

        // items
        cate1_id: cate1IdN,
        cate2_id: cate2IdN,
        number,
        barcode,


        // 出入库
        in_out,

        order_id: order_idN,
        order_no,
        sorter_field,
        sorter_order,

        customer_id: customerIdN,
        account_id: accountIdN,

        order_date_start,
        order_date_end,
        delivery_date_start,
        delivery_date_end,
        is_return_order: is_return_orderB,
        is_urgent: is_urgentB,
        is_special: is_specialB,

        imported: importedN,

        ro_search,
    }
}
