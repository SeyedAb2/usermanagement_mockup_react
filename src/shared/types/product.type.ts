import { UserType } from "./user.type";

export interface ToolsFieldType {
    weight?:number,
    year_of_production?:number,
    is_new?:boolean,
    size?:string,
    color?:string,
    model?:string,
    producer?:string,
    capacity?:string,
}
export interface FarmGrandFieldType {
    meter?:number,
    grand_type?:'farm'|'industery'|'company',
    year_of_production?:number,
    price_of_meter?:number,
}
export interface FarmProductFieldType {
    price_of_weight?:number,
    type_product?:'water'|'garden'|'veg'|'flower',
    grade?:'low'|'middle'|'high',
    count?:number,
}
export interface SupplementFieldType {
    type_of_supple?:string,
    weight?:number,
    material?:string,
}
export interface ProductType {
    title?:string,
    price?:string,
    grade?:number,
    info?:string|null|undefined,
    id?:number|null,
    type?:'tools'|'grand'|'produce'|'supple'|null|undefined,
    additional_data?:SupplementFieldType|FarmProductFieldType|FarmGrandFieldType|ToolsFieldType,
    image?:string|null,
    address?:string,
    user?:UserType|null|undefined,
    created_at?:Date|string,
}
