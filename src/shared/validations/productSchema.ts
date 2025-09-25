// product.schema.ts
import * as yup from "yup";
import { toEnDigits } from "../utils/toEnglishDegit";
import type {
  ProductType,
  ToolsFieldType,
  FarmGrandFieldType,
  FarmProductFieldType,
  SupplementFieldType,
} from "../types";
import {
  FARM_GRADES,
  FARM_PRODUCT_TYPES,
  GRAND_TYPES,
  PRODUCT_TYPES,
} from "../utils/product-const";

type AdditionalData = NonNullable<ProductType["additional_data"]>;
type ProductKind = NonNullable<ProductType["type"]>;

const positiveNum = () =>
  yup
    .number()
    .transform((val, orig) => {
      if (typeof orig === "string") {
        const s = toEnDigits(orig).replace(/[^\d.-]/g, "");
        return s === "" ? undefined : Number(s);
      }
      return val;
    })
    .typeError("عدد معتبر وارد کنید")
    .min(0, "نمی‌تواند منفی باشد");

const positiveInt = () => positiveNum().integer("باید عدد صحیح باشد");

const toolsSchema: yup.ObjectSchema<ToolsFieldType> = yup
  .object({
    weight: positiveNum().optional(),
    year_of_production: positiveInt().optional(),
    is_new: yup.boolean().optional(),
    size: yup.string().trim().optional(),
    color: yup.string().trim().optional(),
    model: yup.string().trim().optional(),
    producer: yup.string().trim().optional(),
    capacity: yup.string().trim().optional(),
  })
  .noUnknown();

const grandSchema: yup.ObjectSchema<FarmGrandFieldType> = yup
  .object({
    meter: positiveNum().optional(),
    grand_type: yup
      .mixed<(typeof GRAND_TYPES)[number]>()
      .oneOf(GRAND_TYPES)
      .optional(),
    year_of_production: positiveInt().optional(),
    price_of_meter: positiveNum().optional(),
  })
  .noUnknown();

const produceSchema: yup.ObjectSchema<FarmProductFieldType> = yup
  .object({
    price_of_weight: positiveNum().optional(),
    type_product: yup
      .mixed<(typeof FARM_PRODUCT_TYPES)[number]>()
      .oneOf(FARM_PRODUCT_TYPES)
      .optional(),
    grade: yup
      .mixed<(typeof FARM_GRADES)[number]>()
      .oneOf(FARM_GRADES)
      .optional(),
    count: positiveInt().optional(),
  })
  .noUnknown();

const suppleSchema: yup.ObjectSchema<SupplementFieldType> = yup
  .object({
    type_of_supple: yup.string().trim().optional(),
    weight: positiveNum().optional(),
    material: yup.string().trim().optional(),
  })
  .noUnknown();

const additionalDataByType: Record<ProductKind, yup.ObjectSchema<SupplementFieldType|ToolsFieldType|FarmGrandFieldType|FarmProductFieldType>> = {
  tools: toolsSchema,
  grand: grandSchema,
  produce: produceSchema,
  supple: suppleSchema,
};

export const ProductValidationSchema = yup
  .object({
    id: yup.number().optional().nullable(),
    title: yup.string().trim().required("عنوان محصول را وارد کنید"),
    price: yup
      .string()
      .transform((v) => (typeof v === "string" ? toEnDigits(v) : v))
      .required("قیمت الزامی است"),

    // اختیاری‌ها
    grade: positiveNum().optional(),
    info: yup.string().nullable().optional(),
    image: yup.string().nullable().optional(),
    address: yup.string().trim().max(200, "آدرس خیلی طولانی است").optional(),
    user: yup.mixed().optional(),
    created_at: yup.mixed<Date | string>().optional(),

    type:yup
    .mixed<(typeof PRODUCT_TYPES)[number]>()
    .oneOf(PRODUCT_TYPES)
    .optional()
    .required("نوع محصول را انتخاب کنید"),

    additional_data: yup
      .mixed<AdditionalData>() 
      .notRequired()
      .when("type", (t, schema) => {
        const type = t as unknown | ProductKind | undefined;
        if (!type) return schema.strip();
        return additionalDataByType[type as ProductKind];
      })
      .test(
        "type-required-if-additional",
        "ابتدا نوع محصول را انتخاب کنید",
        function (value) {
          const { type } = this.parent as ProductType;
          return !value || !!type;
        }
      ),
  })
  .noUnknown();