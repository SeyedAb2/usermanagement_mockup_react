import { useMemo, useState } from "react";
import {
  Box, Button, Card, CardActionArea, CardContent, CardMedia, Chip, Container,
  Divider, Grid, IconButton, Stack, Tab, Tabs, Typography, Rating
} from "@mui/material"; // Grid v2 – از size={{}} استفاده می‌کنیم
import {
  Agriculture, CategoryOutlined, SecurityOutlined, LocalShippingOutlined,
  MonetizationOnOutlined, KeyboardArrowLeft
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router";
import StatItem from "../../shared/components/StateItem";

/* ---------------- Mock & helpers ---------------- */
const CATEGORIES = [
  {
    key: "tools",
    title: "ادوات کشاورزی",
    icon: <Agriculture />,
    img: "https://images.unsplash.com/photo-1617350335633-8f0bc3cfcf78?w=1200&q=80&auto=format&fit=crop" // تراکتور
  },
  {
    key: "land",
    title: "زمین زراعت",
    icon: <CategoryOutlined />,
    img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80&auto=format&fit=crop"
  },
  {
    key: "crop",
    title: "محصول زراعی",
    icon: <CategoryOutlined />,
    img: "https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=1200&q=80&auto=format&fit=crop"
  },
  {
    key: "supplement",
    title: "مکمل/سم/کود",
    icon: <CategoryOutlined />,
    img: "https://images.unsplash.com/photo-1541976076758-347942db1970?w=1200&q=80&auto=format&fit=crop"
  },
];

const PRODUCTS = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  title: ["تراکتور رومانی 65", "کود پتاس 50%", "بذر گندم ممتاز", "زمین ۲ هکتار آبی"][i % 4],
  price: 4_000_000 + i * 550_000,
  img: `https://picsum.photos/seed/landing${i}/640/420`,
  rating: 3.5 + ((i % 3) * 0.5),
}));

function formatPrice(v: number) {
  return `${v.toLocaleString("fa-IR")} تومان`;
}

/* ---------------- Landing Page ---------------- */
export default function LandingPage() {
  const [tab, setTab] = useState(0);
  const featured = useMemo(() => PRODUCTS.slice(0, 4), []); // فقط یک ردیف
  const newest = useMemo(() => [...PRODUCTS].reverse().slice(0, 4), []);

  /* ---------------- Sections ---------------- */

  const Hero = (
    <Box sx={{ py: { xs: 5, md: 8 } }}>
      <Grid container spacing={2} alignItems="center">
        {/* تصویر طبیعت */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              height: { xs: 260, md: 420 },
              borderRadius: 3,
              background:
                "url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1600&q=80&auto=format&fit=crop') center/cover",
              boxShadow: 4,
            }}
          />
        </Grid>

        {/* متن + دکمه‌ها */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={2} sx={{ textAlign: { xs: "center", md: "right" } }}>
            <Typography variant="h3" fontWeight={900}>
              بازار آنلاین تجهیزات و محصولات کشاورزی
            </Typography>
            <Typography color="text.secondary">
              خرید و فروش مستقیم ادوات، زمین، محصولات زراعی و نهاده‌ها — سریع، امن و سراسری.
            </Typography>

            {/* دو دکمه: ورود (primary) اول، ثبت‌نام (outlined) دوم */}
            <Stack direction="row" justifyContent={{ xs: "center", md: "flex-start" }} sx={{ gap: 1 }}>
              <Button
                variant="contained"
                size="large"
                component={RouterLink}
                to="/login"
                sx={{ borderRadius: 2, minWidth: 140 }}
              >
                ورود
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={RouterLink}
                to="/signup"
                sx={{ borderRadius: 2, minWidth: 140 }}
              >
                ثبت‌نام
              </Button>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );

  const WhyUs = (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Typography variant="h5" fontWeight={900} sx={{ mb: 2 }}>
        چرا و‌ال‌فارم؟
      </Typography>
      <Grid container spacing={2}>
        {[
          { icon: <MonetizationOnOutlined />, title: "واسطه کمتر", text: "معامله مستقیم و شفاف." },
          { icon: <SecurityOutlined />, title: "امنیت و اعتماد", text: "راستی‌آزمایی فروشندگان و آگهی‌ها." },
          { icon: <LocalShippingOutlined />, title: "دسترسی سراسری", text: "هماهنگی و ارسال در سراسر کشور." },
          { icon: <Agriculture />, title: "تنوع بالا", text: "از ادوات تا نهاده‌ها و زمین." },
        ].map((it, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                height: "100%",
                textAlign: "center",
                transition: "transform .18s, box-shadow .18s",
                "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
              }}
            >
              <IconButton
                color="primary"
                sx={{
                  mx: "auto",
                  mb: 1,
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  border: (t) => `2px solid ${t.palette.primary.main}`,
                  transition: "transform .18s",
                  "&:hover": { transform: "scale(1.15)" },
                }}
              >
                {it.icon}
              </IconButton>
              <Typography fontWeight={900} sx={{ mb: 0.5 }}>{it.title}</Typography>
              <Typography variant="body2" color="text.secondary">{it.text}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const CategoriesRow = (
    <Box sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight={900} sx={{ mb: 1 }}>
        دسته‌بندی‌ها
      </Typography>

      {/* اسکرول افقی با snap و مخفی کردن اسکرول‌بار */}
      <Box
        sx={{
          display: "grid",
          gridAutoFlow: "column",
          gridAutoColumns: { xs: "80%", sm: "45%", md: "25%" },
          gap: 2,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          pb: 1,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {CATEGORIES.map((c) => (
          <Card key={c.key} sx={{ borderRadius: 3, scrollSnapAlign: "start" }}>
            <CardActionArea component={RouterLink} to={`/products?cat=${c.key}`}>
              <CardMedia sx={{ height: 170 }} image={c.img} />
              <CardContent sx={{ textAlign: "center" }}>
                <Stack alignItems="center" spacing={0.5}>
                  <IconButton color="primary" sx={{ "&:hover": { transform: "scale(1.12)" }, transition: ".18s" }}>
                    {c.icon}
                  </IconButton>
                  <Typography fontWeight={900}>{c.title}</Typography>
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );

  const Featured = (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="h5" fontWeight={900}>محصولات منتخب</Typography>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} textColor="primary" indicatorColor="primary">
          <Tab label="جدیدترین" />
          <Tab label="پیشنهادی" />
        </Tabs>
      </Stack>

      <Grid container spacing={2}>
        {(tab === 0 ? newest : featured).map((p) => (
          <Grid key={p.id} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                borderRadius: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform .18s, box-shadow .18s",
                "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
              }}
            >
              <CardMedia image={p.img} sx={{ height: 170 }} />
              <CardContent sx={{ flex: 1 }}>
                <Typography fontWeight={900} noWrap>{p.title}</Typography>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 0.75 }}>
                  <Chip size="small" color="success" label={formatPrice(p.price)} />
                  <Stack direction="row" alignItems="center" sx={{ gap: 0.5 }}>
                    <Rating readOnly size="small" precision={0.5} value={p.rating} />
                    <Typography variant="caption" color="text.secondary">{p.rating.toFixed(1)}</Typography>
                  </Stack>
                </Stack>
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <Button fullWidth variant="contained" component={RouterLink} to={`/products/${p.id}`} sx={{ borderRadius: 2 }}>
                  مشاهده
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const Roles = (
    <Box sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight={900} sx={{ mb: 2 }}>برای چه کسانی؟</Typography>
      <Grid container spacing={2}>
        {[
          { t: "کشاورز", d: "فروش مستقیم محصول و نهاده." , link: "/signup?role=farmer" },
          { t: "فروشنده", d: "ثبت آگهی ادوات و قطعات." , link: "/signup?role=seller" },
          { t: "خدمات‌دهنده", d: "ارائه خدمات مکانیزاسیون و مشاوره." , link: "/signup?role=service" },
        ].map((r, i) => (
          <Grid key={i} size={{ xs: 12, md: 4 }}>
            <Card sx={{ p: 2.5, borderRadius: 3, height: "100%", textAlign: "center" }}>
              <Typography fontWeight={900}>{r.t}</Typography>
              <Typography color="text.secondary" sx={{ my: 1 }}>{r.d}</Typography>
              <Button variant="outlined" component={RouterLink} to={r.link} endIcon={<KeyboardArrowLeft />}>
                شروع کنید
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const Stats = (
    <Box sx={{ py: 6 }}>
      <Card sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
        <Grid container spacing={2} alignItems="center">
          {[
            { label: "محصول فعال", value: 1240 },
            { label: "کاربر ثبت‌شده", value: 860 },
            { label: "شهر تحت پوشش", value: 95 },
          ].map((s, i) => (
            <Grid key={i} size={{ xs: 12, md: 4 }}>
              <StatItem label={s.label} value={s.value} />
            </Grid>
          ))}

          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* لوگو/شریک‌ها – اسکرول افقی مخفی‌اسکرول */}
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                display: "grid",
                gridAutoFlow: "column",
                gridAutoColumns: "minmax(120px, 1fr)",
                gap: 2,
                overflowX: "auto",
                pb: 1,
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              {["🚜", "🌾", "🧪", "🏭", "🛒"].map((emo, i) => (
                <Card key={i} sx={{ p: 2, borderRadius: 2, textAlign: "center" }}>
                  <Typography fontSize={28}>{emo}</Typography>
                </Card>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );

  return (
    <Box sx={{ py: 2 }}>
      <Container maxWidth="lg">
        {Hero}
        {WhyUs}
        {CategoriesRow}
        {Featured}
        {Roles}
        {Stats}
      </Container>
    </Box>
  );
}
