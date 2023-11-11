export interface Customer {
     id: number,
     ty_pe: number,
     name: string,
     head: string,
     address: string,
     email: string,
     birthday: string|null,
     phone: string,
     notes: string,
     create_time: string
}

export interface CustomerSearchParams {
     name: string|undefined,
     ty_pe: number,
     head: string|undefined,
     phone: string|undefined,
     create_time_st: string| undefined,
     create_time_ed: string|undefined,

     page: number,
     pageSize: number,
}
