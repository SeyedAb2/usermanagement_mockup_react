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

export type CategoryKey = "tools" | "grand" | "produce" | "supple";
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

export type ProductBase = {
  id: string;
  title: string;
  image: string;
  user: { id: string; name: string; avatar: string };
  price: number;
  category: CategoryKey;
  date: string;     // ISO
  location: string; // شهر/منطقه
  rating: number;
  views: number;
  description: string;
};

export type SpecsTools = {
  weightKg?: number;
  year?: number;
  isUsed?: boolean;
  size?: string;
  color?: string;
  model?: string;
  madeIn?: string;
  capacity?: string;
};
export type SpecsLand = {
  areaM2?: number;
  usage?: string;
  builtYear?: number;
  pricePerM2?: number;
};
export type SpecsCrop = {
  pricePerKg?: number;
  material?: string;
  grade?: string;
  count?: number;
};
export type SpecsSupplement = {
  type?: string;
  weightKg?: number;
  material?: string;
};

export type Product =
  | (ProductBase & { category: "tools"; specs: SpecsTools })
  | (ProductBase & { category: "land"; specs: SpecsLand })
  | (ProductBase & { category: "crop"; specs: SpecsCrop })
  | (ProductBase & { category: "supplement"; specs: SpecsSupplement });

