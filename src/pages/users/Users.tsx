// src/pages/users/UsersPage.tsx
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { JSX, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router";
import {
  Search,
  Visibility,
  Phone,
  Agriculture,
  Storefront,
  Handyman,
} from "@mui/icons-material";
import Seo from "../../shared/components/seo/Seo";

type UserType = "farmer" | "seller" | "service";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  type: UserType;
  views: number;
  avatar: string;
}

const TYPE_LABEL: Record<UserType, string> = {
  farmer: "کشاورز",
  seller: "فروشنده",
  service: "خدمات‌دهنده",
};

const TYPE_ICON: Record<UserType, JSX.Element> = {
  farmer: <Agriculture fontSize="small" />,
  seller: <Storefront fontSize="small" />,
  service: <Handyman fontSize="small" />,
};

// ——— نمونه داده برای نمایش اولیه
const MOCK_USERS: User[] = Array.from({ length: 37 }).map((_, i) => {
  const types: UserType[] = ["farmer", "seller", "service"];
  const t = types[i % 3];
  return {
    id: String(i + 1),
    firstName: ["علی", "مریم", "سارا", "حسین", "رضا", "نرگس"][i % 6],
    lastName: ["محمدی", "اصغری", "کاظمی", "کمالی", "رستمی"][i % 5],
    phone: `09${(100000000 + i * 12345).toString().slice(0, 9)}`,
    type: t,
    views: (i * 19) % 1200,
    avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
  };
});

export default function UsersPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<"" | UserType>("");
  const [page, setPage] = useState(1);
  const pageSize = 12; // 3 ردیف × 4 کارت

  const filtered = useMemo(() => {
    const term = q.trim();
    return MOCK_USERS.filter((u) => {
      const matchesName =
        !term ||
        `${u.firstName} ${u.lastName}`.includes(term) ||
        `${u.lastName} ${u.firstName}`.includes(term);
      const matchesType = !type || u.type === type;
      return matchesName && matchesType;
    });
  }, [q, type]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  // اگر داخل جستجو/فیلتر تغییر کرد، برگرد به صفحه ۱
  const handleSearch = (v: string) => {
    setQ(v);
    setPage(1);
  };
  const handleType = (v: "" | UserType) => {
    setType(v);
    setPage(1);
  };

  return (
    <>
      <Seo SITE_NAME="کاربران | وال‌فارم" />
      <Box sx={{ py: { xs: 3, md: 5 } }}>
        <Container maxWidth="lg">
          {/* نوار جستجو و فیلتر */}
          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{xs:12, md:8}}>
                  <TextField
                    fullWidth
                    label="جستجو بر اساس نام"
                    placeholder="مثلاً: علی محمدی"
                    value={q}
                    onChange={(e) => handleSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid size={{xs:12, md:4}}>
                  <FormControl fullWidth>
                    <InputLabel id="type-label">نوع کاربر</InputLabel>
                    <Select
                      labelId="type-label"
                      label="نوع کاربر"
                      value={type}
                      onChange={(e) =>
                        handleType(e.target.value as "" | UserType)
                      }
                    >
                      <MenuItem value="">همه</MenuItem>
                      <MenuItem value="farmer">کشاورز</MenuItem>
                      <MenuItem value="seller">فروشنده</MenuItem>
                      <MenuItem value="service">خدمات‌دهنده</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* شمارنده نتیجه */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              {filtered.length.toLocaleString("fa-IR")} نتیجه
            </Typography>
          </Stack>

          {/* گرید کارت‌ها */}
          <Grid container spacing={2}>
            {paged.map((u) => (
              <Grid key={u.id} size={{xs:12, sm:6, md:3}}>
                <Card
                  sx={(t) => ({
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    boxShadow: 3,
                    borderTop: `4px solid ${
                      (t.palette).wlc?.[500] ?? t.palette.primary.main
                    }`,
                  })}
                >
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        src={u.avatar}
                        alt={`${u.firstName} ${u.lastName}`}
                        sx={{ width: 56, height: 56 }}
                      />
                      <Box>
                        <Typography variant="subtitle1" fontWeight={700}>
                          {u.firstName} {u.lastName}
                        </Typography>
                        <Stack direction="row" spacing={0} justifyContent='center' alignItems="center">
                          <Chip
                            size="small"
                            color="success"
                            icon={TYPE_ICON[u.type]}
                            label={TYPE_LABEL[u.type]}
                            sx={{ "& .MuiChip-icon": { mr: 0.5 },"& .MuiChip-label":{pr:0} }}
                          />
                        </Stack>
                      </Box>
                    </Stack>

                    <Divider sx={{ my: 1.5 }} />

                    <Stack spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Phone fontSize="small" />
                        <Typography variant="body2">
                          <a href={`tel:${u.phone}`}>{u.phone}</a>
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <Visibility fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                          {u.views.toLocaleString("fa-IR")} بازدید
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>

                  <Box flexGrow={1} />
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      component={RouterLink}
                      to={`/users/${u.id}`}
                      sx={{ borderRadius: 2 }}
                    >
                      مشاهده پروفایل
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* حالت خالی */}
          {filtered.length === 0 && (
            <Card sx={{ mt: 3, borderRadius: 3 }}>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography>کاربری با این مشخصات پیدا نشد.</Typography>
              </CardContent>
            </Card>
          )}

          {/* صفحه‌بندی */}
          <Stack alignItems="center" sx={{ mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, p) => setPage(p)}
              color="primary"
              shape="rounded"
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
}
