export interface UserType {
    name?:string,
    phone?:string,
    password?:string,
    age?:number|null,
    type?:'farmer'|'seller'|'service',
    logo?:string|null,
    address?:string,
    description?:string,
    social?:{
        telegram?:string,
        instagram?:string,
        twitter?:string,
    }
}