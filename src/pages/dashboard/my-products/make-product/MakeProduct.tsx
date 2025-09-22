import { useMemo, useState } from "react";
import {
  Box, Button, Card, CardContent, Checkbox, Divider, FormControlLabel,
  Grid, InputAdornment, MenuItem, Select, Stack,
  TextField, Tooltip, Typography
} from "@mui/material"; // Grid v2 – size={{}}
import {
  SaveOutlined, ArrowBack, UploadFileOutlined, CategoryOutlined, ImageOutlined
} from "@mui/icons-material";
import { useNavigate } from "react-router";

type CategoryKey = "tools" | "land" | "crop" | "supplement";
const CATEGORY_LABEL: Record<CategoryKey, string> = {
  tools: "ادوات کشاورزی",
  land: "زمین زراعت",
  crop: "محصول زراعی",
  supplement: "مکمل/سم/کود",
};
const STATUS_LABEL = { draft: "پیش‌نویس", published: "منتشر شده", archived: "آرشیو" } as const;

type ProductBase = {
  id: string;
  title: string;
  slug?: string;
  category: CategoryKey;
  price: number;
  description?: string;
  images: string[];
  user: { id: string; name: string; avatar?: string };
  location: { province?: string; city?: string; area?: string; address?: string; lat?: number; lng?: number };
  date: string;
  updatedAt?: string;
  ratingAvg?: number;
  ratingCount?: number;
  views?: number;
  tags?: string[];
  status?: "draft" | "published" | "archived";
  specs?: Record<string, string | boolean | number>;
};

type Props = {
  initial?: Partial<ProductBase>;
  onSubmit?: (data: ProductBase) => void;
};

function toTags(value: string): string[] {
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

export default function ProductEditor({ initial, onSubmit }: Props) {
  const navigate = useNavigate();

  const [id] = useState(initial?.id ?? crypto.randomUUID());
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [category, setCategory] = useState<CategoryKey>(initial?.category ?? "tools");
  const [price, setPrice] = useState<number | "">(initial?.price ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState<ProductBase["status"]>(initial?.status ?? "draft");
  const [tagsInput, setTagsInput] = useState((initial?.tags ?? []).join(", "));
  // ❗️بدون تصویر پیش‌فرض؛ اگر نبود، Placeholder نشان می‌دهیم
  const [images, setImages] = useState<string[]>(initial?.images ?? []);

  const [province, setProvince] = useState(initial?.location?.province ?? "");
  const [city, setCity] = useState(initial?.location?.city ?? "");
  const [area, setArea] = useState(initial?.location?.area ?? "");
  const [address, setAddress] = useState(initial?.location?.address ?? "");

  const [specs, setSpecs] = useState<Record<string, string | boolean | number>>(initial?.specs ?? {});

  const payload: ProductBase = useMemo(
    () => ({
      id,
      title,
      slug: slug || undefined,
      category,
      price: typeof price === "number" ? price : 0,
      description: description || undefined,
      images,
      user: initial?.user ?? { id: "me-1", name: "کاربر" },
      location: { province, city, area, address },
      date: initial?.date ?? new Date().toISOString(),
      updatedAt: initial?.updatedAt,
      tags: toTags(tagsInput),
      status,
      specs,
    }),
    [id, title, slug, category, price, description, images, province, city, area, address, tagsInput, status, specs, initial?.user, initial?.date, initial?.updatedAt]
  );

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImages((prev) => [url, ...prev.slice(1)]);
  };

  const submit = () => {
    if (title.trim().length < 3) return alert("عنوان باید حداقل ۳ کاراکتر باشد.");
    if (!price || Number(price) <= 0) return alert("قیمت معتبر وارد کنید.");
    onSubmit?.(payload);
    console.log("SUBMIT PRODUCT:", payload);
  };

  const SpecsFields = () => {
    switch (category) {
      case "tools":
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="وزن (کیلوگرم)" type="number"
                value={specs.weightKg ?? ""} onChange={(e) => setSpecs({ ...specs, weightKg: +e.target.value || "" })}/>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="سال تولید" type="number"
                value={specs.year ?? ""} onChange={(e) => setSpecs({ ...specs, year: +e.target.value || "" })}/>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControlLabel control={
                <Checkbox checked={!!specs.isUsed} onChange={(e) => setSpecs({ ...specs, isUsed: e.target.checked })}/>
              } label="دست‌دوم است؟" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="ابعاد" placeholder="مثال: 2.7×1.6×2.5 متر"
                value={specs.size ?? ""} onChange={(e) => setSpecs({ ...specs, size: e.target.value })}/>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="رنگ" value={specs.color ?? ""}
                onChange={(e) => setSpecs({ ...specs, color: e.target.value })}/>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="مدل" value={specs.model ?? ""}
                onChange={(e) => setSpecs({ ...specs, model: e.target.value })}/>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="ساخت" value={specs.madeIn ?? ""}
                onChange={(e) => setSpecs({ ...specs, madeIn: e.target.value })}/>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="ظرفیت کاری" placeholder="مثال: تا 8 هکتار/روز"
                value={specs.capacity ?? ""} onChange={(e) => setSpecs({ ...specs, capacity: e.target.value })}/>
            </Grid>
          </Grid>
        );
      case "land":
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="متراژ (مترمربع)" type="number"
                value={specs.areaM2 ?? ""} onChange={(e) => setSpecs({ ...specs, areaM2: +e.target.value || "" })}/>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="نوع کاربری"
                value={specs.usage ?? ""} onChange={(e) => setSpecs({ ...specs, usage: e.target.value })}/>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="سال ساخت (در صورت وجود بنا)" type="number"
                value={specs.builtYear ?? ""} onChange={(e) => setSpecs({ ...specs, builtYear: +e.target.value || "" })}/>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="قیمت هر مترمربع (تومان)" type="number"
                value={specs.pricePerM2 ?? ""} onChange={(e) => setSpecs({ ...specs, pricePerM2: +e.target.value || "" })}/>
            </Grid>
          </Grid>
        );
      case "crop":
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="قیمت هر کیلو (تومان)" type="number"
                value={specs.pricePerKg ?? ""} onChange={(e) => setSpecs({ ...specs, pricePerKg: +e.target.value || "" })}/>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="جنس/نوع"
                value={specs.material ?? ""} onChange={(e) => setSpecs({ ...specs, material: e.target.value })}/>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="درجه کیفی"
                value={specs.grade ?? ""} onChange={(e) => setSpecs({ ...specs, grade: e.target.value })}/>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="تعداد/بسته‌ها" type="number"
                value={specs.count ?? ""} onChange={(e) => setSpecs({ ...specs, count: +e.target.value || "" })}/>
            </Grid>
          </Grid>
        );
      case "supplement":
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="نوع" placeholder="مثال: کود پتاس"
                value={specs.type ?? ""} onChange={(e) => setSpecs({ ...specs, type: e.target.value })}/>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="وزن بسته (کیلوگرم)" type="number"
                value={specs.weightKg ?? ""} onChange={(e) => setSpecs({ ...specs, weightKg: +e.target.value || "" })}/>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="جنس/ترکیب" placeholder="مثال: K₂SO₄ 50%"
                value={specs.material ?? ""} onChange={(e) => setSpecs({ ...specs, material: e.target.value })}/>
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ py: { xs: 2, md: 3 } }}>
      <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Stack direction="row" alignItems="center" sx={{ gap: 1, mb: 2 }}>
            <CategoryOutlined />
            <Typography variant="h6" fontWeight={900}>
              {initial ? "ویرایش محصول" : "ایجاد محصول جدید"}
            </Typography>
          </Stack>

          <Grid container spacing={2}>
            {/* --- تصویر شاخص + آپلود --- */}
            <Grid size={{ xs: 12, md: 3 }}>
              <Stack spacing={1.25} alignItems="center">
                <Box
                  sx={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    borderRadius: 2,
                    overflow: "hidden",
                    border: (t) => `1px solid ${t.palette.divider}`,
                    position: "relative",
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "background.default",
                    // اگر تصویر داریم، بک‌گراند را بگذار؛ وگرنه آیکون بزرگ
                    ...(images[0]
                      ? {
                          backgroundImage: `url('${images[0]}')`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : {}),
                  }}
                >
                  {!images[0] && <ImageOutlined sx={{ fontSize: 96, opacity: 0.3 }} />}
                </Box>

                <Tooltip title="آپلود تصویر شاخص">
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<UploadFileOutlined />}
                    component="label"
                    sx={{ borderRadius: 2 }}
                  >
                    آپلود تصویر
                    <input hidden accept="image/*" type="file" onChange={handleImagePick} />
                  </Button>
                </Tooltip>
              </Stack>
            </Grid>

            {/* --- فیلدهای اصلی --- */}
            <Grid size={{ xs: 12, md: 9 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <TextField
                    fullWidth
                    label="عنوان محصول"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    inputProps={{ maxLength: 120 }}
                    helperText={`${title.length}/120`}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="اسلاگ (اختیاری)"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="مثال: tractor-754"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Select fullWidth value={category} onChange={(e) => setCategory(e.target.value as CategoryKey)} displayEmpty>
                    {(Object.keys(CATEGORY_LABEL) as CategoryKey[]).map((k) => (
                      <MenuItem key={k} value={k}>{CATEGORY_LABEL[k]}</MenuItem>
                    ))}
                  </Select>
                  <Typography variant="caption" color="text.secondary">دسته‌بندی</Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="قیمت کل (تومان)"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value) || "")}
                    InputProps={{ startAdornment: <InputAdornment position="start">تومان</InputAdornment> }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Select fullWidth value={status ?? "draft"} onChange={(e) => setStatus(e.target.value)}>
                    <MenuItem value="draft">{STATUS_LABEL.draft}</MenuItem>
                    <MenuItem value="published">{STATUS_LABEL.published}</MenuItem>
                    <MenuItem value="archived">{STATUS_LABEL.archived}</MenuItem>
                  </Select>
                  <Typography variant="caption" color="text.secondary">وضعیت انتشار</Typography>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth multiline minRows={4} label="توضیحات تکمیلی"
                    value={description} onChange={(e) => setDescription(e.target.value)}
                    placeholder="مشخصات، شرایط معامله، توضیحات مهم…"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>موقعیت/آدرس</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField fullWidth label="استان" value={province} onChange={(e) => setProvince(e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField fullWidth label="شهر" value={city} onChange={(e) => setCity(e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField fullWidth label="منطقه" value={area} onChange={(e) => setArea(e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField fullWidth label="آدرس دقیق" value={address} onChange={(e) => setAddress(e.target.value)} />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>برچسب‌ها (اختیاری)</Typography>
          <TextField fullWidth placeholder="با , جدا کنید — مثل: تراکتور, رومانی, 754"
            value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1 }}>
            مشخصات {CATEGORY_LABEL[category]}
          </Typography>
          <SpecsFields />

          <Stack direction="row" justifyContent="space-between" sx={{ mt: 3, gap: 1 }}>
            <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ borderRadius: 2 }}>
              بازگشت
            </Button>
            <Button variant="contained" startIcon={<SaveOutlined />} onClick={submit} sx={{ borderRadius: 2 }}>
              {initial ? "ذخیره تغییرات" : "ثبت محصول"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
