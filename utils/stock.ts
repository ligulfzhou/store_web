
type Via = "form"|"order"|"excel"

export function viaToString(via: string) {
    switch (via) {
        case "excel": return "导入";
        case "form": return "手动";
        case "order": return "订单";
        default: return "手动"
    }
}
