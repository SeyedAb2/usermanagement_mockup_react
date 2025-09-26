import { ProductType } from "../types";
import { CategoryKey } from "../types/product.type";

export const PRODUCT_TYPES = ["tools", "grand", "produce", "supple"] as const;
export const GRAND_TYPES = ["farm", "industery", "company"] as const;
export const FARM_PRODUCT_TYPES = ["water", "garden", "veg", "flower"] as const;
export const FARM_GRADES = ["low", "middle", "high"] as const;


export const TYPE_LABEL: Record<NonNullable<ProductType["type"]>, string> = {
  tools: "ادوات کشاورزی",
  grand: "زمین/باغ",
  produce: "محصولات کشاورزی",
  supple: "مکمل/کود/سم",
};

export const CATEGORY_COLOR: Record<CategoryKey, "primary" | "success" | "warning" | "info"> =
  { tools: "info", grand: "warning", produce: "success", supple: "primary" };

export const GRAND_LABEL: Record<(typeof GRAND_TYPES)[number], string> = {
  farm: "کشاورزی",
  industery: "صنعتی",
  company: "شرکتی",
};
export const PRODUCT_KIND_LABEL: Record<(typeof FARM_PRODUCT_TYPES)[number], string> = {
  water: "آبی",
  garden: "باغی",
  veg: "صیفی/سبزی",
  flower: "گل/گیاه",
};
export const GRADE_LABEL: Record<(typeof FARM_GRADES)[number], string> = {
  low: "ضعیف",
  middle: "متوسط",
  high: "عالی",
};
