import { Stack, Typography } from "@mui/material";
import {
  FarmGrandFieldType,
  FarmProductFieldType,
  ProductType,
  SupplementFieldType,
  ToolsFieldType,
} from "../types";
import {
  GRAND_LABEL,
  PRODUCT_KIND_LABEL,
  GRADE_LABEL,
} from "../utils/product-const";
import { toPersianDegit } from "../utils/toPersianDigits";

export default function SpecsList({ product }: { product: ProductType }) {
  const specs:
    | SupplementFieldType
    | FarmProductFieldType
    | FarmGrandFieldType
    | ToolsFieldType
    | undefined = product.additional_data;

  if (!specs) return null;

  let items: [string, string | number | undefined][] = [];

  switch (product.type) {
    case "tools": {
      const toolSpecs = specs as ToolsFieldType;
      items = [
        ["وزن", toolSpecs.weight ? `${toolSpecs.weight} کیلوگرم` : "-"],
        ["سال تولید", toolSpecs.year_of_production ?? "-"],
        [
          "نو/دست‌دوم",
          toolSpecs.is_new === undefined
            ? "-"
            : toolSpecs.is_new
            ? "نو"
            : "دست‌دوم",
        ],
        ["ابعاد", toolSpecs.size ?? "-"],
        ["رنگ", toolSpecs.color ?? "-"],
        ["مدل", toolSpecs.model ?? "-"],
        ["سازنده", toolSpecs.producer ?? "-"],
        ["ظرفیت کاری", toolSpecs.capacity ?? "-"],
      ];
      break;
    }

    case "grand": {
      const landSpecs = specs as FarmGrandFieldType;
      items = [
        [
          "متراژ",
          landSpecs.meter
            ? `${landSpecs.meter.toLocaleString("fa-IR")} مترمربع`
            : "-",
        ],
        ["کاربری", landSpecs.grand_type ? GRAND_LABEL[landSpecs.grand_type] : "-"],
        ["سال ساخت", landSpecs.year_of_production ?? "-"],
        [
          "قیمت هر متر",
          landSpecs.price_of_meter
            ? `${landSpecs.price_of_meter.toLocaleString("fa-IR")} تومان`
            : "-",
        ],
      ];
      break;
    }

    case "produce": {
      const produceSpecs = specs as FarmProductFieldType;
      items = [
        [
          "قیمت هر کیلو",
          produceSpecs.price_of_weight
            ? `${produceSpecs.price_of_weight.toLocaleString("fa-IR")} تومان`
            : "-",
        ],
        [
          "نوع محصول",
          produceSpecs.type_product
            ? PRODUCT_KIND_LABEL[produceSpecs.type_product]
            : "-",
        ],
        [
          "درجه کیفی",
          produceSpecs.grade ? GRADE_LABEL[produceSpecs.grade] : "-",
        ],
        ["تعداد", produceSpecs.count ?? "-"],
      ];
      break;
    }

    case "supple": {
      const suppleSpecs = specs as SupplementFieldType;
      items = [
        ["نوع", suppleSpecs.type_of_supple ?? "-"],
        [
          "وزن",
          suppleSpecs.weight ? `${suppleSpecs.weight} کیلوگرم` : "-",
        ],
        ["جنس/ترکیب", suppleSpecs.material ?? "-"],
      ];
      break;
    }

    default:
      break;
  }

  return (
    <Stack spacing={1.25} sx={{ mt: 2 }}>
      <Typography variant="subtitle1" fontWeight={700}>
        مشخصات محصول
      </Typography>
      {items.map(([label, value], idx) => (
        <Stack
          key={idx}
          direction="row"
          justifyContent="space-between"
          sx={{
            py: 0.75,
            borderBottom: idx !== items.length - 1 ? "1px dashed" : "none",
            borderColor: "divider",
          }}
        >
          <Typography variant="body2" fontWeight={700}>
            {label}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {toPersianDegit(value || "-")}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}