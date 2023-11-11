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

        // items

        brand,
        cates1,
        cates2,
        goods_no,
        // name, customer也有name

    } = router.query

    // customers
    phone = parseQueryParam(phone)
    name = parseQueryParam(name)
    head = parseQueryParam(head)
    let ty_peN = parseQueryParamToNumber(ty_pe)
    create_time_st = parseQueryParam(create_time_st)
    create_time_ed = parseQueryParam(create_time_ed)

    // items
    brand = parseQueryParam(brand)
    cates1 = parseQueryParam(cates1)
    cates2 = parseQueryParam(cates2)
    goods_no = parseQueryParam(goods_no)

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
        brand,
        cates1,
        cates2,
        goods_no,

        order_id: order_idN,
        order_no,
        sorter_field,
        sorter_order,

        order_date_start,
        order_date_end,
        delivery_date_start,
        delivery_date_end,
        is_return_order: is_return_orderB,
        is_urgent: is_urgentB,
        is_special: is_specialB,

        ro_search,
    }
}
