export interface UserType {
    name?:string,
    phone?:string,
    password?:string,
    confirmPassword?:string,
    age?:number|null|undefined,
    id?:number,
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