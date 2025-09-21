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
  Drawer,
  IconButton,
  InputAdornment,
  Pagination,
  Rating,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import {
  ContentCopyOutlined,
  Search,
  ShareOutlined,
  VisibilityOutlined,
  CategoryOutlined,
  PersonOutline,
  CalendarMonthOutlined,
  PlaceOutlined,
  SentimentDissatisfied,
} from "@mui/icons-material";
import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router";
import Seo from "../../shared/components/seo/Seo";

// ---------- Types & Mock Data ----------
type CategoryKey = "tools" | "land" | "crop" | "supplement";
const CATEGORY_LABEL: Record<CategoryKey, string> = {
  tools: "ادوات کشاورزی",
  land: "زمین زراعت",
  crop: "محصول زراعی",
  supplement: "مکمل/سم/کود",
};
const CATEGORY_COLOR: Record<CategoryKey, "primary" | "success" | "warning" | "info"> =
  { tools: "info", land: "warning", crop: "success", supplement: "primary" };

type Product = {
  id: string;
  title: string;
  image: string;
  user: { id: string; name: string; avatar: string };
  price: number;
  category: CategoryKey;
  date: string; // ISO
  location: string;
  rating: number; // 0..5
  views: number;
};

type UserMini = { id: string; name: string; avatar: string; type: "farmer" | "seller" | "service" };

const MOCK_PRODUCTS: Product[] = Array.from({ length: 28 }).map((_, i) => ({
  id: String(i + 1),
  title: ["تراکتور رومانی", "بذر گندم ممتاز", "زمین کشاورزی ۲ هکتار", "کود پتاس"][i % 4],
  image: `https://picsum.photos/seed/prod${i}/600/400`,
  user: {
    id: String(i + 100),
    name: ["علی محمدی", "سارا کاظمی", "رضا رستمی", "مریم قاسمی"][i % 4],
    avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
  },
  price: 5000000 + (i % 7) * 1200000,
  category: (["tools", "crop", "land", "supplement"] as CategoryKey[])[i % 4],
  date: new Date(Date.now() - i * 86400000).toISOString(),
  location: ["بابل - گتاب", "ساری - منطقه آزاد", "گرگان - النگدره"][i % 3],
  rating: 3.5 + ((i % 4) * 0.5),
  views: 50 + i * 7,
}));

const LATEST_PRODUCTS = MOCK_PRODUCTS.slice(0, 3);
const NEWEST_USERS: UserMini[] = Array.from({ length: 5 }).map((_, i) => ({
  id: String(i + 1000),
  name: ["حمید نصیری", "شادی تقوی", "امیر صدیقی", "فاطمه کرمی", "بهزاد اسدی"][i % 5],
  avatar: `https://i.pravatar.cc/150?img=${(i % 60) + 5}`,
  type: (["farmer", "seller", "service"] as const)[i % 3],
}));

// ---------- Page ----------
export default function Products() {
  // ---- applied states (روی لیست اعمال می‌شوند)
  const [q, setQ] = useState("");
  const [selectedCats, setSelectedCats] = useState<CategoryKey[]>([]);
  const [sort, setSort] = useState<"new" | "old">("new");
  const [priceRange, setPriceRange] = useState<number[]>([1_000_000, 15_000_000]);

  // ---- pending states (در کنترل‌ها تا وقتی "اعمال" نخوره)
  const [qInput, setQInput] = useState(q);
  const [catsInput, setCatsInput] = useState<CategoryKey[]>(selectedCats);
  const [sortInput, setSortInput] = useState<"new" | "old">(sort);
  const [priceInput, setPriceInput] = useState<number[]>(priceRange);

  const applyFilters = () => {
    setQ(qInput);
    setSelectedCats(catsInput);
    setSort(sortInput);
    setPriceRange(priceInput);
    setPage(1);
  };

  // ui
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const filtered = useMemo(() => {
    const term = q.trim();
    const arr = MOCK_PRODUCTS.filter((p) => {
      const byName = !term || p.title.includes(term) || p.user.name.includes(term);
      const byCat = selectedCats.length === 0 || selectedCats.includes(p.category);
      const byPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return byName && byCat && byPrice;
    });
    arr.sort((a, b) =>
      sort === "new" ? +new Date(b.date) - +new Date(a.date) : +new Date(a.date) - +new Date(b.date)
    );
    return arr;
  }, [q, selectedCats, sort, priceRange]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleCatInput = (key: CategoryKey) =>
    setCatsInput((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  // ------- UI Blocks -------
  const FiltersBlock = (
    <Stack spacing={2} sx={{ width: { xs: "100%", md: "auto" } }}>
      {/* مرتب‌سازی بالای سرچ */}
      <Box sx={{ minWidth: 180 }}>
        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          مرتب‌سازی
        </Typography>
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
        label="جستجوی محصول یا فروشنده"
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
                  onChange={() => toggleCatInput(k)}
                  // رنگ تیک = primary
                  sx={{
                    color: "primary.main",
                    "&.Mui-checked": { color: "primary.main" },
                  }}
                />
              }
              label={CATEGORY_LABEL[k]}
            />
          ))}
        </FormGroup>
      </Stack>

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

      {/* دکمه اعمال */}
      <Stack direction="row" justifyContent="flex-end">
        <Button variant="contained" onClick={applyFilters}>
          اعمال فیلترها
        </Button>
      </Stack>
    </Stack>
  );

  return (
    <>
      <Seo SITE_NAME="محصولات | وال‌فارم" />
      <Box sx={{ py: { xs: 3, md: 5 } }}>
        <Container maxWidth="lg">
          {/* فیلترها دسکتاپ */}
          <Box sx={{ display: { xs: "none", md: "block" }, mb: 2 }}>
            <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>{FiltersBlock}</Card>
          </Box>

          {/* موبایل: سرچ + دکمه فیلتر */}
          <Stack direction="row" spacing={1} sx={{ display: { xs: "flex", md: "none" }, mb: 2 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="جست‌وجو…"
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
            <Button variant="outlined" onClick={() => setFilterOpen(true)}>
              فیلترها
            </Button>
          </Stack>

          {/* Drawer فیلترها در موبایل */}
          <Drawer anchor="bottom" open={filterOpen} onClose={() => setFilterOpen(false)}>
            <Box sx={{ p: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="subtitle1">فیلترها</Typography>
                <Button onClick={() => setFilterOpen(false)}>بستن</Button>
              </Stack>
              {FiltersBlock}
            </Box>
          </Drawer>

          <Grid container spacing={2}>
            {/* ستون اصلی محصولات */}
            <Grid size={{ xs: 12, md: 8, lg: 9 }}>
              {/* نتایج صفر */}
              {filtered.length === 0 && (
                <Card sx={{ py: 6, borderRadius: 3, boxShadow: 2, textAlign: "center", mb: 2 }}>
                  <SentimentDissatisfied sx={{ fontSize: 72, opacity: 0.4 }} />
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    نتیجه‌ای یافت نشد
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    لطفاً فیلترها را تغییر دهید یا عبارت جستجو را ساده‌تر کنید.
                  </Typography>
                </Card>
              )}

              <Grid container spacing={2}>
                {paged.map((p) => (
                  <Grid key={p.id} size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
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
                        "&:hover": {
                          transform: "translateY(-4px) scale(1.01)",
                          boxShadow: 6,
                        },
                      })}
                    >
                      <Box
                        component="img"
                        src={p.image}
                        alt={p.title}
                        sx={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
                      />

                      <CardHeader
                        title={
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{ gap: 1 }}
                          >
                            <Typography variant="subtitle1" fontWeight={700} noWrap>
                              {p.title}
                            </Typography>
                            <Chip
                              size="small"
                              color={CATEGORY_COLOR[p.category]}
                              label={CATEGORY_LABEL[p.category]}
                            />
                          </Stack>
                        }
                        subheader={
                          <Stack direction="row" alignItems="center" sx={{ gap: 1, mt: 0.5 }}>
                            <Avatar src={p.user.avatar} sx={{ width: 24, height: 24 }} />
                            <Typography variant="body2">{p.user.name}</Typography>
                          </Stack>
                        }
                        sx={{ pb: 0.5 }}
                      />

                      <CardContent sx={{ pt: 1 }}>
                        <Stack spacing={1}>
                          <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
                            <PlaceOutlined fontSize="small" />
                            <Typography variant="body2" color="text.secondary">
                              {p.location}
                            </Typography>
                          </Stack>

                          <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
                            <CalendarMonthOutlined fontSize="small" />
                            <Typography variant="body2" color="text.secondary">
                              {new Date(p.date).toLocaleDateString("fa-IR")}
                            </Typography>
                          </Stack>

                          <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
                            <Rating readOnly size="small" precision={0.5} value={p.rating} />
                            <Typography variant="caption" color="text.secondary">
                              {p.rating} / 5
                            </Typography>
                          </Stack>

                          <Typography variant="h6" sx={{ color: "success.main" }}>
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
                              onClick={() =>
                                navigator.share?.({
                                  title: p.title,
                                  url: window.location.origin + `/products/${p.id}`,
                                })
                              }
                            >
                              <ShareOutlined />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="کپی لینک">
                            <IconButton
                              size="small"
                              onClick={() =>
                                navigator.clipboard.writeText(
                                  window.location.origin + `/products/${p.id}`
                                )
                              }
                            >
                              <ContentCopyOutlined />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </CardActions>
                    </Card>
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
            </Grid>

            {/* Sidebar (hidden on mobile) */}
            <Grid
              size={{ xs: 12, md: 4, lg: 3 }}
              sx={{
                display: { xs: "none", md: "block" },
                position: "sticky",
                top: (theme) => theme.spacing(10),
                alignSelf: "flex-start",
              }}
            >
              {/* Latest products - بدون عکس */}
              <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 3 }}>
                <CardHeader avatar={<CategoryOutlined />} title="آخرین محصولات" sx={{ pb: 0 }} />
                <CardContent>
                  <Stack spacing={1.2}>
                    {LATEST_PRODUCTS.map((p) => (
                      <Stack key={p.id} spacing={0.25}>
                        <Typography variant="body2" fontWeight={600} noWrap>
                          {p.title}
                        </Typography>
                        <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
                          <Chip
                            size="small"
                            color={CATEGORY_COLOR[p.category]}
                            label={CATEGORY_LABEL[p.category]}
                            sx={{ "& .MuiChip-label": { fontSize: "0.72rem" } }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {new Date(p.date).toLocaleDateString("fa-IR")}
                          </Typography>
                        </Stack>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              {/* Newest users */}
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardHeader
                  avatar={<PersonOutline />}
                  title="جدیدترین کاربران"
                  sx={{ pb: 0 }}
                />
                <CardContent>
                  <Stack spacing={1.1}>
                    {NEWEST_USERS.map((u) => (
                      <Stack key={u.id} direction="row" alignItems="center" sx={{ gap: 1.2 }}>
                        <Avatar src={u.avatar} />
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography variant="body2" noWrap>
                            {u.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {u.type === "farmer"
                              ? "کشاورز"
                              : u.type === "seller"
                              ? "فروشنده"
                              : "خدمات‌دهنده"}
                          </Typography>
                        </Box>
                        <Tooltip title="مشاهده پروفایل">
                          <IconButton size="small" component={RouterLink} to={`/users/${u.id}`}>
                            <VisibilityOutlined />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
