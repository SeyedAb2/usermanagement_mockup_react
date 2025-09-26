import { Stack, Typography } from "@mui/material";
import { FarmGrandFieldType, FarmProductFieldType, ProductType, SupplementFieldType, ToolsFieldType } from "../types";
import { GRAND_LABEL, PRODUCT_KIND_LABEL, GRADE_LABEL } from "../utils/product-const";
import { toPersianDegit } from "../utils/toPersianDigits";

export default function SpecsList({ product }: { product: ProductType }) {
  const specs:SupplementFieldType|FarmProductFieldType|FarmGrandFieldType|ToolsFieldType|undefined = product.additional_data;

  if (!specs) return null;

  let items: [string, string | number | undefined][] = [];

  switch (product.type) {
    case "tools":
      items = [
        ["وزن", specs.weight ? `${specs.weight} کیلوگرم` : "-"],
        ["سال تولید", specs.year_of_production ?? "-"],
        ["نو/دست‌دوم", specs.is_new === undefined ? "-" : specs.is_new ? "نو" : "دست‌دوم"],
        ["ابعاد", specs.size ?? "-"],
        ["رنگ", specs.color ?? "-"],
        ["مدل", specs.model ?? "-"],
        ["سازنده", specs.producer ?? "-"],
        ["ظرفیت کاری", specs.capacity ?? "-"],
      ];
      break;

    case "grand":
      items = [
        ["متراژ", specs.meter ? `${specs.meter.toLocaleString("fa-IR")} مترمربع` : "-"],
        ["کاربری", specs.grand_type ? GRAND_LABEL[specs.grand_type] : "-"],
        ["سال ساخت", specs.year_of_production ?? "-"],
        ["قیمت هر متر", specs.price_of_meter ? `${specs.price_of_meter.toLocaleString("fa-IR")} تومان` : "-"],
      ];
      break;

    case "produce":
      items = [
        ["قیمت هر کیلو", specs.price_of_weight ? `${specs.price_of_weight.toLocaleString("fa-IR")} تومان` : "-"],
        ["نوع محصول", specs.type_product ? PRODUCT_KIND_LABEL[specs.type_product] : "-"],
        ["درجه کیفی", specs.grade ? GRADE_LABEL[specs.grade] : "-"],
        ["تعداد", specs.count ?? "-"],
      ];
      break;

    case "supple":
      items = [
        ["نوع", specs.type_of_supple ?? "-"],
        ["وزن", specs.weight ? `${specs.weight} کیلوگرم` : "-"],
        ["جنس/ترکیب", specs.material ?? "-"],
      ];
      break;

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