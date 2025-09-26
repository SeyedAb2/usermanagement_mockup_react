// ProductForm.tsx
import * as yup from "yup";
import {
  Avatar, Box, Button, Card, IconButton, InputAdornment, Stack,
  TextField, Tooltip, Typography, Grid, MenuItem, CircularProgress
} from "@mui/material";
import {
  CameraAltOutlined, SaveOutlined, ImageOutlined, CategoryOutlined, PlaceOutlined
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import type { ProductType } from "../../../../shared/types";
import { LabelPosition } from "../../../../shared/utils/textFieldLabelStyleConfig";
import {
  PRODUCT_TYPES, GRAND_TYPES, FARM_PRODUCT_TYPES, FARM_GRADES,
  TYPE_LABEL,
  GRAND_LABEL,
  PRODUCT_KIND_LABEL,
  GRADE_LABEL
} from "../../../../shared/utils/product-const";
import { ProductValidationSchema } from "../../../../shared/validations/productSchema";
import useProduct from "../../../../shared/hooks/useProduct";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getProductApi } from "../../../../services/api/product";
import { useEffect } from "react";
import Error from "../../../../shared/components/Error";
import ProductFormSkeleton from "../../../../shared/components/skeletons/MakeProductsSkeleton";


type FormValues = yup.InferType<typeof ProductValidationSchema>;
const EMPTY: ProductType = {
  id: null,
  title: "",
  price: "",
  address: "",
  image: null,
  type: null,
  additional_data: {},
  info: '',
  created_at: '',
  grade: undefined,
};

export default function ProductForm({ ACTION }: {ACTION:'ADD'|'EDIT'}) {
  const params = useParams()
  const { productId } = params
  const {isPending, mutate} = useProduct(ACTION)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ProductValidationSchema),
  });

  const {
     data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey:['productId'],
    queryFn:()=> getProductApi(productId),
    enabled: ACTION==='EDIT' && !!productId,
    staleTime:36000,
    select: (p: ProductType): FormValues => ({
      id: p.id,
      title: p.title ?? "",
      price: p.price ?? "",
      address: p.address ?? "",
      image: p.image ?? null,
      type: p.type ?? 'tools',
      additional_data: p.additional_data ?? undefined,
      info: p.info ?? null,
      created_at: p.created_at,
      grade: p.grade,
    }),
  })

  useEffect(() => {
    if (ACTION==='EDIT' && product) reset(product);
    if(ACTION==='ADD') reset(EMPTY as FormValues)
  }, [product, reset]);

  const selectedType = watch("type");
  const image = watch("image");

  const onImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setValue("image", base64, { shouldDirty: true });
    };
    reader.readAsDataURL(f);
  };


  const submit = (values: FormValues) => {
    mutate(values as ProductType)
  };

   if (ACTION=='EDIT' && isLoading) {
    return <ProductFormSkeleton />
  }
  if (error) {
    return <Error />;
  }

  const AdditionalFields = () => {
    switch (selectedType) {
      case "tools":
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                sx={LabelPosition({right:25,rightActive:30})}
                inputProps={{ dir: "rtl" }}
                fullWidth label="وزن (کیلوگرم)" type="number"
                {...register("additional_data.weight")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                sx={LabelPosition({right:25,rightActive:30})}
                inputProps={{ dir: "rtl" }}
                fullWidth label="سال تولید" type="number"
                {...register("additional_data.year_of_production")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Controller
                control={control}
                name="additional_data.is_new"
                render={({ field }) => (
                  <TextField
                    sx={LabelPosition({right:25,rightActive:30})}
                    inputProps={{ dir: "ltr" }}
                    select fullWidth label="نو/دست‌دوم"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value === "true")}
                  >
                    <MenuItem value="">نامشخص</MenuItem>
                    <MenuItem value="true">نو</MenuItem>
                    <MenuItem value="false">دست‌دوم</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="ابعاد" sx={LabelPosition({right:25,rightActive:30})}
                inputProps={{ dir: "rtl" }}
                {...register("additional_data.size")}
                placeholder="مثال: 2.7×1.6×2.5 متر"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="رنگ" sx={LabelPosition({right:25,rightActive:30})}
                inputProps={{ dir: "rtl" }}
                {...register("additional_data.color")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="مدل"
                sx={LabelPosition({right:25,rightActive:30})}
                inputProps={{ dir: "rtl" }}
                {...register("additional_data.model")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="سازنده" sx={LabelPosition({right:25,rightActive:30})}
                inputProps={{ dir: "rtl" }}
                {...register("additional_data.producer")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="ظرفیت کاری"
                sx={LabelPosition({right:25,rightActive:30})}
                inputProps={{ dir: "rtl" }}
                {...register("additional_data.capacity")}
                placeholder="مثال: تا 8 هکتار/روز"
              />
            </Grid>
          </Grid>
        );

      case "grand":
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField sx={LabelPosition({right:25,rightActive:30})}
                inputProps={{ dir: "rtl" }}
                fullWidth label="متراژ (متر مربع)" type="number"
                {...register("additional_data.meter")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Controller
                control={control}
                name="additional_data.grand_type"
                render={({ field }) => (
                  <TextField
                    sx={LabelPosition({right:25,rightActive:30})}
                    inputProps={{ dir: "rtl" }}
                    select fullWidth label="نوع کاربری"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || undefined)}
                  >
                    <MenuItem value="">—</MenuItem>
                    {GRAND_TYPES.map((g) => (
                      <MenuItem key={g} value={g}>{GRAND_LABEL[g]}</MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField sx={LabelPosition({right:25,rightActive:30})}
                inputProps={{ dir: "rtl" }}
                fullWidth label="سال ساخت/تولید" type="number"
                {...register("additional_data.year_of_production")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField sx={LabelPosition({right:25,rightActive:30})}
                inputProps={{ dir: "rtl" }}
                fullWidth label="قیمت هر متر" type="number"
                {...register("additional_data.price_of_meter")}
                InputProps={{ startAdornment: <InputAdornment position="start">تومان</InputAdornment> }}
              />
            </Grid>
          </Grid>
        );

      case "produce":
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField sx={LabelPosition({right:25,rightActive:30})}
                inputProps={{ dir: "rtl" }}
                fullWidth label="قیمت هر کیلو" type="number"
                {...register("additional_data.price_of_weight")}
                InputProps={{ startAdornment: <InputAdornment position="start">تومان</InputAdornment> }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Controller
                control={control}
                name="additional_data.type_product"
                render={({ field }) => (
                  <TextField sx={LabelPosition({right:25,rightActive:30})}
                inputProps={{ dir: "rtl" }}
                    select fullWidth label="نوع محصول"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || undefined)}
                  >
                    <MenuItem value="">—</MenuItem>
                    {FARM_PRODUCT_TYPES.map((t) => (
                      <MenuItem key={t} value={t}>{PRODUCT_KIND_LABEL[t]}</MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Controller
                control={control}
                name="additional_data.grade"
                render={({ field }) => (
                  <TextField sx={LabelPosition({right:25,rightActive:30})}
                    inputProps={{ dir: "rtl" }}
                    select fullWidth label="درجه کیفی"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || undefined)}
                  >
                    <MenuItem value="">—</MenuItem>
                    {FARM_GRADES.map((g) => (
                      <MenuItem key={g} value={g}>{GRADE_LABEL[g]}</MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField sx={LabelPosition({right:25,rightActive:30})}
                inputProps={{ dir: "rtl" }}
                fullWidth label="تعداد/بسته" type="number"
                {...register("additional_data.count")}
              />
            </Grid>
          </Grid>
        );

      case "supple":
        return (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField sx={LabelPosition({right:25,rightActive:30})}
                inputProps={{ dir: "rtl" }}
                fullWidth label="نوع مکمل/کود/سم"
                {...register("additional_data.type_of_supple")}
                placeholder="مثال: کود پتاس"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField sx={LabelPosition({right:25,rightActive:30})}
                inputProps={{ dir: "rtl" }}
                fullWidth label="وزن بسته (کیلوگرم)" type="number"
                {...register("additional_data.weight")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField sx={LabelPosition({right:25,rightActive:30})}
                inputProps={{ dir: "rtl" }}
                fullWidth label="جنس/ترکیب"
                {...register("additional_data.material")}
                placeholder="مثال: K₂SO₄ 50%"
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Card sx={{ p: 2, borderRadius: 3, boxShadow: 4 }}>
        <Stack direction="row" alignItems="center" sx={{ gap: 1, mb: 2 }}>
          <CategoryOutlined />
          <Typography variant="h6" fontWeight={900}>
            {ACTION==='EDIT' ? "ویرایش محصول" : "ایجاد محصول جدید"}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" sx={{ gap: 2, mb: 2 }}>
          <Box sx={{ position: "relative", width: 120, height: 120 }}>
            <Box sx={{
              width: 120, height: 120, borderRadius: 2, overflow: "hidden",
              border: (t) => `1px solid ${t.palette.divider}`, display: "grid", placeItems: "center",
              bgcolor: "background.default",
            }}>
              {image ? (
                <Avatar src={image ?? undefined} variant="rounded" sx={{ width: 120, height: 120 }} />
              ) : (
                <ImageOutlined sx={{ fontSize: 64, opacity: 0.35 }} />
              )}
            </Box>
            <Tooltip title="تغییر تصویر" disableInteractive>
              <IconButton
                component="label"
                size="small"
                aria-label="انتخاب تصویر"
                sx={{
                  position: "absolute", bottom: -8, left: -8,
                  bgcolor: "background.paper", boxShadow: 2, zIndex: 2,
                  "&:hover": { bgcolor: "background.paper" },
                }}
              >
                <CameraAltOutlined />
                <input type="file" accept="image/*" hidden onChange={onImagePick} />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="body2" color="text.secondary">
            روی آیکون دوربین کلیک کنید تا تصویر محصول را انتخاب کنید.
          </Typography>
        </Stack>

        <Grid container spacing={2} sx={{mt:5}}>
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth label="عنوان محصول"
              error={!!errors.title}
              {...register("title")}
              placeholder="مثال: تراکتور 754 رومانی"
              sx={LabelPosition({ right: 10, rightActive: 28 })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Controller
              control={control}
              name="type"
              disabled={ACTION==='EDIT'} 
              render={({ field }) => (
                <TextField
                  select fullWidth label="نوع محصول (ساختاری)"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange((e.target.value || undefined) as FormValues["type"])}
                  error={!!errors.type}
                  disabled={ACTION==='EDIT'} 
                  sx={LabelPosition({ right: 10, rightActive: 28 })}
                  InputLabelProps={{ shrink: true }}
                >
                  <MenuItem value="">— انتخاب کنید —</MenuItem>
                  {PRODUCT_TYPES.map((t) => (
                    <MenuItem key={t} value={t}>{TYPE_LABEL[t]}</MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth label="قیمت کل (تومان)" type="number"
              error={!!errors.price}
              {...register("price")}
              sx={LabelPosition({ right: 10, rightActive: 28 })}
              InputLabelProps={{ shrink: true }}
              InputProps={{ startAdornment: <InputAdornment position="start">تومان</InputAdornment> }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth label="آدرس"
              error={!!errors.address}
              {...register("address")}
              placeholder="مثال: بابل - خیابان ..."
              sx={LabelPosition({ right: 10, rightActive: 28 })}
              InputLabelProps={{ shrink: true }}
              InputProps={{ startAdornment: (<InputAdornment position="start"><PlaceOutlined /></InputAdornment>) }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth label="توضیحات"
              multiline minRows={3}
              {...register("info")}
              placeholder="مشخصات، شرایط معامله، توضیحات مهم…"
              sx={LabelPosition({ right: 10, rightActive: 28 })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        {selectedType && (
          <>
            <Typography variant="subtitle1" fontWeight={800} sx={{ mt: 3, mb: 2 }}>
              مشخصات {TYPE_LABEL[selectedType]}
            </Typography>
            <AdditionalFields />
          </>
        )}

        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button variant="contained" type="submit" sx={{ borderRadius: 2 }}>
            {(isPending) ? (
              <CircularProgress sx={{ color: "primary.contrastText" }} size="26px" thickness={5} />
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <SaveOutlined />
                <Typography sx={{ mr: 1 }}>{ACTION=='EDIT' ? 'ثبت تغییرات' : 'ثبت محصول'}</Typography>
              </Box>
            )}
          </Button>
        </Stack>
      </Card>
    </form>
  );
}