import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Divider,
  IconButton,
  Rating,
  Stack,
  Typography,
  Tooltip,
  Grid,
} from "@mui/material";
import {
  ContentCopyOutlined,
  ShareOutlined,
  VisibilityOutlined,
  CalendarMonthOutlined,
  PlaceOutlined,
  CategoryOutlined,
} from "@mui/icons-material";
import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router";
import Seo from "../../../shared/components/seo/Seo";

/* --------- انواع، رنگ‌ها و داده‌ی تست --------- */
type CategoryKey = "tools" | "land" | "crop" | "supplement";
const CATEGORY_LABEL: Record<CategoryKey, string> = {
  tools: "ادوات کشاورزی",
  land: "زمین زراعت",
  crop: "محصول زراعی",
  supplement: "مکمل/سم/کود",
};
const CATEGORY_COLOR: Record<CategoryKey, "primary" | "success" | "warning" | "info"> =
  { tools: "info", land: "warning", crop: "success", supplement: "primary" };

type ProductBase = {
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

type SpecsTools = {
  weightKg?: number;
  year?: number;
  isUsed?: boolean;
  size?: string;
  color?: string;
  model?: string;
  madeIn?: string;
  capacity?: string;
};
type SpecsLand = {
  areaM2?: number;
  usage?: string;
  builtYear?: number;
  pricePerM2?: number;
};
type SpecsCrop = {
  pricePerKg?: number;
  material?: string;
  grade?: string;
  count?: number;
};
type SpecsSupplement = {
  type?: string;
  weightKg?: number;
  material?: string;
};

type Product =
  | (ProductBase & { category: "tools"; specs: SpecsTools })
  | (ProductBase & { category: "land"; specs: SpecsLand })
  | (ProductBase & { category: "crop"; specs: SpecsCrop })
  | (ProductBase & { category: "supplement"; specs: SpecsSupplement });

const MOCK_PRODUCTS: ProductBase[] = Array.from({ length: 12 }).map((_, i) => ({
  id: String(i + 1),
  title: ["تراکتور رومانی", "بذر گندم ممتاز", "زمین کشاورزی ۲ هکتار", "کود پتاس"][i % 4],
  image: `https://picsum.photos/seed/pd${i}/900/600`,
  user: {
    id: String(i + 100),
    name: ["علی محمدی", "سارا کاظمی", "رضا رستمی", "مریم قاسمی"][i % 4],
    avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
  },
  price: 5_000_000 + (i % 7) * 1_200_000,
  category: (["tools", "crop", "land", "supplement"] as CategoryKey[])[i % 4],
  date: new Date(Date.now() - i * 86400000).toISOString(),
  location: ["بابل - گتاب", "ساری - منطقه آزاد", "گرگان - النگدره"][i % 3],
  rating: 3.5 + ((i % 4) * 0.5),
  views: 50 + i * 7,
  description:
    "توضیحات تکمیلی محصول. این محصول با کیفیت بالا و قیمت مناسب عرضه شده و برای استفاده در شرایط مختلف کشاورزی مناسب است.",
}));

// نمونه محصول (به‌جای useParams + React Query)
const PRODUCT_SAMPLE: Product = {
  ...(MOCK_PRODUCTS[0] as ProductBase),
  title: "تراکتور رومانی 754",
  category: "tools",
  specs: {
    weightKg: 2450,
    year: 1401,
    isUsed: false,
    size: "2.5×1.6×2.7 متر",
    color: "سبز",
    model: "754",
    madeIn: "ایران",
    capacity: "تا 8 هکتار/روز",
  },
};

/* -------------------- کارت کوچک محصولات اخیر -------------------- */
function SmallProductCard({ p }: { p: ProductBase }) {
  return (
    <Card
      sx={(t) => ({
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        boxShadow: 3,
        overflow: "hidden",
        borderTop: `4px solid ${(t.palette).wlc?.[500] ?? t.palette.primary.main}`,
        transition: "transform .18s ease, box-shadow .18s ease",
        "&:hover": { transform: "translateY(-3px) scale(1.01)", boxShadow: 6 },
      })}
    >
      <Box component="img" src={p.image} alt={p.title}
           sx={{ width: "100%", height: 150, objectFit: "cover", display: "block" }} />
      <CardHeader
        title={
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ gap: 1 }}>
            <Typography variant="subtitle2" fontWeight={700} noWrap>{p.title}</Typography>
            <Chip size="small" color={CATEGORY_COLOR[p.category]} label={CATEGORY_LABEL[p.category]} />
          </Stack>
        }
        subheader={
          <Stack direction="row" alignItems="center" sx={{ gap: 1, mt: 0.5 }}>
            <Avatar src={p.user.avatar} sx={{ width: 22, height: 22 }} />
            <Typography variant="caption">{p.user.name}</Typography>
          </Stack>
        }
        sx={{ pb: 0.5 }}
      />
      <CardContent sx={{ pt: 1 }}>
        <Stack spacing={0.75}>
          <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
            <PlaceOutlined fontSize="small" />
            <Typography variant="caption" color="text.secondary">{p.location}</Typography>
          </Stack>
          <Typography variant="subtitle2" sx={{ color: "success.main" }}>
            {p.price.toLocaleString("fa-IR")} تومان
          </Typography>
        </Stack>
      </CardContent>
      <Box flexGrow={1} />
      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
        <Button
          size="small"
          variant="contained"
          component={RouterLink}
          to={`/products/${p.id}`}
          sx={{ borderRadius: 2 }}
          startIcon={<VisibilityOutlined />}
        >
          مشاهده
        </Button>
        <Stack direction="row" sx={{ gap: 0.5 }}>
          <Tooltip title="اشتراک‌گذاری">
            <IconButton
              size="small"
              onClick={() => navigator.share?.({ title: p.title, url: window.location.origin + `/products/${p.id}` })}
            >
              <ShareOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title="کپی لینک">
            <IconButton
              size="small"
              onClick={() => navigator.clipboard.writeText(window.location.origin + `/products/${p.id}`)}
            >
              <ContentCopyOutlined />
            </IconButton>
          </Tooltip>
        </Stack>
      </CardActions>
    </Card>
  );
}

/* -------------------- مشخصات بر اساس دسته (بدون آیکون) -------------------- */
function SpecsList({ product }: { product: Product }) {
  const items = useMemo(() => {
    switch (product.category) {
      case "tools": {
        const s = product.specs as SpecsTools;
        return [
          ["وزن", s.weightKg ? `${s.weightKg} کیلوگرم` : "-"],
          ["سال تولید", s.year ?? "-"],
          ["نو/دست‌دوم", s.isUsed === undefined ? "-" : s.isUsed ? "دست‌دوم" : "نو"],
          ["ابعاد", s.size ?? "-"],
          ["رنگ", s.color ?? "-"],
          ["مدل", s.model ?? "-"],
          ["ساخت", s.madeIn ?? "-"],
          ["ظرفیت کاری", s.capacity ?? "-"],
        ];
      }
      case "land": {
        const s = product.specs as SpecsLand;
        return [
          ["متراژ", s.areaM2 ? `${s.areaM2.toLocaleString("fa-IR")} مترمربع` : "-"],
          ["کاربری", s.usage ?? "-"],
          ["سال ساخت", s.builtYear ?? "-"],
          ["قیمت هر متر", s.pricePerM2 ? `${s.pricePerM2.toLocaleString("fa-IR")} تومان` : "-"],
        ];
      }
      case "crop": {
        const s = product.specs as SpecsCrop;
        return [
          ["قیمت هر کیلو", s.pricePerKg ? `${s.pricePerKg.toLocaleString("fa-IR")} تومان` : "-"],
          ["جنس/نوع", s.material ?? "-"],
          ["درجه کیفی", s.grade ?? "-"],
          ["تعداد", s.count ?? "-"],
        ];
      }
      case "supplement": {
        const s = product.specs as SpecsSupplement;
        return [
          ["نوع", s.type ?? "-"],
          ["وزن", s.weightKg ? `${s.weightKg} کیلوگرم` : "-"],
          ["جنس/ترکیب", s.material ?? "-"],
        ];
      }
      default:
        return [];
    }
  }, [product]);

  return (
    <Stack spacing={1.25} sx={{ pt: 0.5 }}>
      {items.map(([label, value], idx) => (
        <Stack
          key={idx}
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          sx={{
            gap: 1.5,
            py: 0.75,
            borderBottom: idx !== items.length - 1 ? "1px dashed" : "none",
            borderColor: "divider",
          }}
        >
          <Typography variant="body2" fontWeight={700}>
            {label}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {String(value)}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

/* -------------------- صفحه تک محصول -------------------- */
export default function ProductDetailPage() {
  const product = PRODUCT_SAMPLE; // در عمل از API
  const [userRating, setUserRating] = useState<number | null>(product.rating);
  const recent = MOCK_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <>
      <Seo SITE_NAME={`محصول | ${product.title}`} />
      <Box sx={{ py: { xs: 3, md: 5 } }}>
        <Container maxWidth="lg">
          {/* کارت اطلاعات تک محصول */}
          <Card
            sx={(t) => ({
              mb: 3,
              borderRadius: 3,
              boxShadow: 4,
              overflow: "hidden",
              borderTop: `5px solid ${(t.palette).wlc?.[500] ?? t.palette.primary.main}`,
            })}
          >
            <Grid container spacing={0}>
              {/* تصویر: موبایل cover، دسکتاپ contain */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                    component="img"
                    src={product.image}
                    alt={product.title}
                    sx={{
                    width: "100%",
                    height: { xs: 260, md: "100%" }, // موبایل 260px، دسکتاپ تمام ارتفاع کارت
                    objectFit: "cover",               // مثل قبل: برش بخوره تا فضا پر شه
                    objectPosition: "center",
                    display: "block",
                    }}
                />
              </Grid>

              {/* متادیتا + مشخصات */}
              <Grid size={{ xs: 12, md: 6 }}>
                <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                  {/* عنوان + دسته */}
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ gap: 1 }}>
                    <Typography variant="h5" fontWeight={800} noWrap>
                      {product.title}
                    </Typography>
                    <Chip size="small" color={CATEGORY_COLOR[product.category]} label={CATEGORY_LABEL[product.category]} />
                  </Stack>

                  {/* نویسنده / تاریخ / آدرس */}
                  <Stack direction="row" alignItems="center" sx={{ gap: 1.2, mt: 1.25, flexWrap: "wrap" }}>
                    <Avatar src={product.user.avatar} sx={{ width: 28, height: 28 }} />
                    <Typography variant="body2">{product.user.name}</Typography>

                    <Stack direction="row" alignItems="center" sx={{ gap: 0.75 }}>
                      <CalendarMonthOutlined fontSize="small" />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(product.date).toLocaleDateString("fa-IR")}
                      </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" sx={{ gap: 0.75 }}>
                      <PlaceOutlined fontSize="small" />
                      <Typography variant="body2" color="text.secondary">
                        {product.location}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  {/* قیمت و اکشن‌ها */}
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ gap: 1 }}>
                    <Typography variant="h5" sx={{ color: "success.main" }}>
                      {product.price.toLocaleString("fa-IR")} تومان
                    </Typography>
                    <Stack direction="row" sx={{ gap: 0.5 }}>
                      <Tooltip title="اشتراک‌گذاری">
                        <IconButton
                          onClick={() =>
                            navigator.share?.({ title: product.title, url: window.location.href })
                          }
                        >
                          <ShareOutlined />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="کپی لینک">
                        <IconButton onClick={() => navigator.clipboard.writeText(window.location.href)}>
                          <ContentCopyOutlined />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>

                  {/* توضیحات */}
                  <Typography variant="body2" sx={{ mt: 1.5, color: "text.secondary", lineHeight: 2 }}>
                    {product.description}
                  </Typography>

                  {/* امتیازدهی */}
                  <Stack direction="row" alignItems="center" sx={{ gap: 1.25, mt: 2 }}>
                    <Rating value={userRating} precision={0.5} onChange={(_, v) => setUserRating(v)} />
                    <Typography variant="body2" color="text.secondary">
                      {userRating ?? 0} / 5
                    </Typography>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  {/* مشخصات */}
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                    مشخصات محصول
                  </Typography>
                  <SpecsList product={product} />

                  {/* دکمه مشاهده پروفایل فروشنده */}
                  <CardActions sx={{ px: 0, pt: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<VisibilityOutlined sx={{ml:1}} />}
                      component={RouterLink}
                      to={`/users/${product.user.id}`}
                      sx={{ borderRadius: 2 }}
                    >
                      مشاهده پروفایل فروشنده
                    </Button>
                  </CardActions>
                </CardContent>
              </Grid>
            </Grid>
          </Card>

          {/* محصولات اخیر */}
          <Stack direction="row" alignItems="center" sx={{ mb: 1.5, gap: 1 }}>
            <CategoryOutlined />
            <Typography variant="h6" fontWeight={800}>محصولات اخیر</Typography>
          </Stack>

          <Grid container spacing={2}>
            {recent.map((p) => (
              <Grid key={p.id} size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
                <SmallProductCard p={p} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
}
