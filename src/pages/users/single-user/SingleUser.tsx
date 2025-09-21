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
  Drawer,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Rating,
  Select,
  Slider,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Checkbox,
  Grid, // v2 – استفاده با size={{}}
} from "@mui/material";
import {
  CalendarMonthOutlined,
  ContentCopyOutlined,
  HomeOutlined,
  LocalPhoneOutlined,
  Search,
  ShareOutlined,
  Telegram,
  Instagram,
  Twitter,
  PlaceOutlined,
  VisibilityOutlined,
  CategoryOutlined,
  ShoppingBasketOutlined,
} from "@mui/icons-material";
import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router";
import Seo from "../../../shared/components/seo/Seo";

/* ---------- Types ---------- */
type UserType = "farmer" | "seller" | "service";
const USER_TYPE_LABEL: Record<UserType, string> = {
  farmer: "کشاورز",
  seller: "فروشنده",
  service: "خدمات‌دهنده",
};

type CategoryKey = "tools" | "land" | "crop" | "supplement";
const CATEGORY_LABEL: Record<CategoryKey, string> = {
  tools: "ادوات کشاورزی",
  land: "زمین زراعت",
  crop: "محصول زراعی",
  supplement: "مکمل/سم/کود",
};
const CATEGORY_COLOR: Record<CategoryKey, "primary" | "success" | "warning" | "info"> = {
  tools: "info",
  land: "warning",
  crop: "success",
  supplement: "primary",
};

type Product = {
  id: string;
  title: string;
  image: string;
  price: number;
  category: CategoryKey;
  date: string; // ISO
  location: string;
  rating: number;
};

/* ---------- Mock data ---------- */
const USER = {
  id: "u-123",
  name: "علی محمدی",
  type: "farmer" as UserType,
  avatar: "https://i.pravatar.cc/150?img=13",
  phone: "09901234567",
  age: 34,
  address: "مازندران، بابل - گتاب",
  bio:
    "کشاورز با ۱۰ سال تجربه در کشت گندم و برنج. علاقه‌مند به فناوری‌های نوین و به‌اشتراک‌گذاری تجربیات.",
  social: {
    telegram: "@alimohammadi",
    instagram: "@ali.mohammadi",
    x: "@ali_dev",
  },
};

const MOCK_PRODUCTS: Product[] = Array.from({ length: 27 }).map((_, i) => ({
  id: String(i + 1),
  title: ["تراکتور رومانی", "بذر گندم ممتاز", "زمین کشاورزی ۲ هکتار", "کود پتاس"][i % 4],
  image: `https://picsum.photos/seed/userprod${i}/600/400`,
  price: 5_000_000 + (i % 7) * 1_200_000,
  category: (["tools", "crop", "land", "supplement"] as CategoryKey[])[i % 4],
  date: new Date(Date.now() - i * 86400000).toISOString(),
  location: ["بابل - گتاب", "ساری - منطقه آزاد", "گرگان - النگدره"][i % 3],
  rating: 3 + ((i % 5) * 0.5),
}));

/* ---------- Helpers ---------- */
function formatPrice(v: number) {
  return `${v.toLocaleString("fa-IR")} تومان`;
}
const socialUrl = {
  telegram: (h: string) => `https://t.me/${h.replace("@", "")}`,
  instagram: (h: string) => `https://instagram.com/${h.replace("@", "")}`,
  x: (h: string) => `https://x.com/${h.replace("@", "")}`,
};

/* ---------- Product Card (بدون نویسنده) ---------- */
function ProductCard({ p }: { p: Product }) {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        boxShadow: 3,
        overflow: "hidden",
        borderTop: (t) => `4px solid ${t.palette.primary.main}`,
        transition: "transform .18s ease, box-shadow .18s ease",
        "&:hover": { transform: "translateY(-4px) scale(1.01)", boxShadow: 6 },
      }}
    >
      <Box component="img" src={p.image} alt={p.title} sx={{ width: "100%", height: 180, objectFit: "cover" }} />

      <CardHeader
        title={
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ gap: 1 }}>
            <Typography variant="subtitle1" fontWeight={700} noWrap>{p.title}</Typography>
            <Chip size="small" color={CATEGORY_COLOR[p.category]} label={CATEGORY_LABEL[p.category]} />
          </Stack>
        }
        sx={{ pb: 0.5 }}
      />

      <CardContent sx={{ pt: 1 }}>
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
            <PlaceOutlined fontSize="small" />
            <Typography variant="body2" color="text.secondary">{p.location}</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
            <CalendarMonthOutlined fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {new Date(p.date).toLocaleDateString("fa-IR")}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
            <Rating readOnly size="small" precision={0.5} value={p.rating} />
            <Typography variant="caption" color="text.secondary">{p.rating} / 5</Typography>
          </Stack>

          <Typography variant="h6" sx={{ color: "success.main" }}>{formatPrice(p.price)}</Typography>
        </Stack>
      </CardContent>

      <Box flexGrow={1} />
      <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
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
      </CardActions>
    </Card>
  );
}

/* ======================= PAGE ======================= */
export default function UserDetailPage() {
  // ---------- staged filters ----------
  const [q, setQ] = useState("");
  const [cats, setCats] = useState<CategoryKey[]>([]);
  const [sort, setSort] = useState<"new" | "old">("new");
  const [price, setPrice] = useState<number[]>([1_000_000, 15_000_000]);

  const [qInput, setQInput] = useState(q);
  const [catsInput, setCatsInput] = useState<CategoryKey[]>(cats);
  const [sortInput, setSortInput] = useState<"new" | "old">(sort);
  const [priceInput, setPriceInput] = useState<number[]>(price);

  const applyFilters = () => {
    setQ(qInput);
    setCats(catsInput);
    setSort(sortInput);
    setPrice(priceInput);
    setPage(1);
  };

  // ---------- products + pagination ----------
  const pageSize = 12;
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const term = q.trim();
    const arr = MOCK_PRODUCTS.filter((p) => {
      const byName = !term || p.title.includes(term);
      const byCat = cats.length === 0 || cats.includes(p.category);
      const byPrice = p.price >= price[0] && p.price <= price[1];
      return byName && byCat && byPrice;
    });
    arr.sort((a, b) =>
      sort === "new" ? +new Date(b.date) - +new Date(a.date) : +new Date(a.date) - +new Date(b.date)
    );
    return arr;
  }, [q, cats, price, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  /* ---------- Filters block (شبیه صفحه محصولات) ---------- */
  const Filters = (
    <Stack spacing={2}>
      {/* ردیف بالا: مرتب‌سازی + جستجو */}
      <Stack direction={{ xs: "column" }} sx={{ gap: 1.5 }}>
        <Box sx={{ minWidth: { xs: "100%", md: 200 } }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>مرتب‌سازی</Typography>
          <Select
            fullWidth
            value={sortInput}
            onChange={(e) => setSortInput(e.target.value as "new" | "old")}
          >
            <MenuItem value="new">جدیدترین</MenuItem>
            <MenuItem value="old">قدیمی‌ترین</MenuItem>
          </Select>
        </Box>

        <TextField
          fullWidth
          label="جستجوی محصول"
          value={qInput}
          onChange={(e) => setQInput(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      {/* دسته‌بندی چند انتخابی */}
      <Stack>
        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          دسته‌بندی (چند انتخاب)
        </Typography>
        <FormGroup row sx={{ gap: 1 }}>
          {(Object.keys(CATEGORY_LABEL) as CategoryKey[]).map((k) => (
            <FormControlLabel
              key={k}
              control={
                <Checkbox
                  checked={catsInput.includes(k)}
                  onChange={() =>
                    setCatsInput((prev) =>
                      prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]
                    )
                  }
                  sx={{ color: "primary.main", "&.Mui-checked": { color: "primary.main" } }}
                />
              }
              label={CATEGORY_LABEL[k]}
            />
          ))}
        </FormGroup>
      </Stack>

      {/* قیمت */}
      <Box>
        <Typography variant="subtitle2">قیمت (تومان)</Typography>
        <Slider
          value={priceInput}
          min={0}
          max={30_000_000}
          step={250_000}
          onChange={(_, v) => setPriceInput(v as number[])}
          valueLabelDisplay="auto"
        />
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="caption">{priceInput[0].toLocaleString("fa-IR")}</Typography>
          <Typography variant="caption">{priceInput[1].toLocaleString("fa-IR")}</Typography>
        </Stack>
      </Box>

      {/* اعمال */}
      <Stack direction="row" justifyContent="flex-end">
        <Button variant="contained" onClick={applyFilters}>
          اعمال فیلترها
        </Button>
      </Stack>
    </Stack>
  );

  return (
    <>
      <Seo SITE_NAME={`کاربر | ${USER.name}`} />

      <Box sx={{ py: { xs: 3, md: 5 } }}>
        <Container maxWidth="lg">
          {/* ===== بخش ۱: پروفایل کاربر ===== */}
          <Card
            sx={{
              mb: 3,
              borderRadius: 3,
              boxShadow: 4,
              overflow: "hidden",
              position: "relative",
              borderTop: (theme) => `5px solid ${theme.palette.primary.main}`,
            }}
          >
            {/* آیکون‌های اشتراک/کپی - بالا چپ */}
            <Stack
              direction="row"
              sx={{ position: "absolute", top: 8, left: 8, zIndex: 2, gap: 0.5 }}
            >
              <Tooltip title="اشتراک‌گذاری">
                <IconButton
                  size="small"
                  onClick={() =>
                    navigator.share?.({ title: USER.name, url: window.location.href })
                  }
                >
                  <ShareOutlined />
                </IconButton>
              </Tooltip>
              <Tooltip title="کپی لینک">
                <IconButton size="small" onClick={() => navigator.clipboard.writeText(window.location.href)}>
                  <ContentCopyOutlined />
                </IconButton>
              </Tooltip>
            </Stack>

            <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, md: "auto" }}>
                  <Avatar
                    src={USER.avatar}
                    sx={{
                      width: 112,
                      height: 112,
                      border: (t) => `3px solid ${t.palette.divider}`,
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 'auto' }}>
                  <Stack spacing={0.5}>
                    <Stack direction="row" alignItems="center" sx={{ gap: 1, flexWrap: "wrap" }}>
                      <Typography variant="h5" fontWeight={800}>{USER.name}</Typography>
                      <Chip color="success" label={USER_TYPE_LABEL[USER.type]} size="small" />
                    </Stack>

                    <Stack direction="row" alignItems="center" sx={{ gap: 1.25, flexWrap: "wrap" }}>
                      <LocalPhoneOutlined fontSize="small" />
                      <Typography variant="body2">{USER.phone}</Typography>

                      <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 0.5 }} />

                      <HomeOutlined fontSize="small" />
                      <Typography variant="body2" color="text.secondary">
                        سن: {USER.age}
                      </Typography>

                      <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 0.5 }} />

                      <PlaceOutlined fontSize="small" />
                      <Typography variant="body2" color="text.secondary">
                        {USER.address}
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>

              {/* Bio */}
              <Typography variant="body2" sx={{ mt: 1.5, color: "text.secondary", lineHeight: 2 }}>
                {USER.bio}
              </Typography>

              {/* Socials: فقط آیکون‌ + لینک، رنگ برند */}
              <Stack direction="row" alignItems="center" sx={{ gap: 1.25, mt: 2, flexWrap: "wrap" }}>
                <Tooltip title="تلگرام">
                  <IconButton
                    component="a"
                    href={socialUrl.telegram(USER.social.telegram)}
                    target="_blank"
                    rel="noreferrer"
                    sx={{ color: "#229ED9" }}
                  >
                    <Telegram />
                  </IconButton>
                </Tooltip>

                <Tooltip title="اینستاگرام">
                  <IconButton
                    component="a"
                    href={socialUrl.instagram(USER.social.instagram)}
                    target="_blank"
                    rel="noreferrer"
                    sx={{ color: "#E1306C" }}
                  >
                    <Instagram />
                  </IconButton>
                </Tooltip>

                <Tooltip title="X (Twitter)">
                  <IconButton
                    component="a"
                    href={socialUrl.x(USER.social.x)}
                    target="_blank"
                    rel="noreferrer"
                    sx={{ color: "#111" }}
                  >
                    <Twitter />
                  </IconButton>
                </Tooltip>
              </Stack>
            </CardContent>
          </Card>

          {/* ===== عنوان + فیلترهای محصولات کاربر ===== */}
          <Stack direction="row" alignItems="center" sx={{ mb: 1.25, gap: 1 }}>
            <ShoppingBasketOutlined />
            <Typography variant="h6" fontWeight={800}>محصولات کاربر</Typography>
          </Stack>

          {/* Desktop filters */}
          <Box sx={{ display: { xs: "none", md: "block" }, mb: 2 }}>
            <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>{Filters}</Card>
          </Box>
          

          {/* Mobile: search + open drawer */}
          <Stack direction="row" spacing={1} sx={{ display: { xs: "flex", md: "none" }, mb: 2 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="جست‌وجوی محصول…"
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <MobileFilters filters={Filters} onApply={applyFilters} />
          </Stack>

          {/* ===== لیست محصولات ===== */}
          {filtered.length === 0 ? (
            <Card sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
              <CategoryOutlined sx={{ fontSize: 72, opacity: 0.25 }} />
              <Typography variant="h6" sx={{ mt: 1 }}>محصولی ثبت نشده است</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                هنوز هیچ محصولی برای این کاربر ثبت نشده. می‌توانید اولین محصول را ثبت کنید.
              </Typography>
              <Button
                variant="contained"
                component={RouterLink}
                to="/products/create"
                startIcon={<ShoppingBasketOutlined />}
              >
                افزودن محصول
              </Button>
            </Card>
          ) : (
            <>
              <Grid container spacing={2}>
                {paged.map((p) => (
                  <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <ProductCard p={p} />
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              <Stack alignItems="center" sx={{ mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, p) => setPage(p)}
                  color="primary"
                  shape="rounded"
                />
              </Stack>
            </>
          )}
        </Container>
      </Box>
    </>
  );
}

/* ---------- Drawer for mobile filters ---------- */
function MobileFilters({
  filters,
  onApply,
}: {
  filters: React.ReactNode;
  onApply: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        فیلترها
      </Button>
      <Drawer anchor="bottom" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="subtitle1">فیلترها</Typography>
            <Button onClick={() => setOpen(false)}>بستن</Button>
          </Stack>
          {filters}
          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => {
                onApply();
                setOpen(false);
              }}
            >
              اعمال فیلترها
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
}
