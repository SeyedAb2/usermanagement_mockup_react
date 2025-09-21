import { useMemo, useState } from "react";
import {
  Card, CardContent, IconButton, InputAdornment, Stack, TextField, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Avatar,
  Grid, Select, MenuItem, FormControl, InputLabel, Box
} from "@mui/material";
import { Link as RouterLink } from "react-router";
import { Search, EditOutlined, DeleteOutline, AddCircleOutline, ChevronRight, ChevronLeft } from "@mui/icons-material";

type Row = { id: number; title: string; image: string; date: string };
const MOCK: Row[] = Array.from({ length: 47 }).map((_, i) => ({
  id: i + 1010,
  title: ["تراکتور رومانی 65", "بذر گندم ممتاز", "زمین ۲ هکتار آبی", "کود پتاس 50%"][i % 4],
  image: `https://picsum.photos/seed/table${i}/200/140`,
  date: new Date(Date.now() - i * 86400000).toISOString(),
}));
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fa-IR", { year: "numeric", month: "2-digit", day: "2-digit" });

export default function MyProducts() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filtered = useMemo(() => MOCK.filter((r) => !q.trim() || r.title.includes(q.trim())), [q]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paged = useMemo(
    () => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filtered, page, rowsPerPage]
  );

  const onDelete = (id: number) => {
    if (confirm("آیا از حذف این محصول مطمئن هستید؟")) console.log("delete", id);
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 4, width: "100%" }}>
      <CardContent sx={{ p: 2 }}>
        {/* هدر: سرچ + افزودن */}
        <Grid container spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
          <Grid size={{ xs: 12, md: 'auto' }}>
            <TextField
              fullWidth
              label="جستجوی محصول"
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(0); }}
              InputProps={{ startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>) }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: "auto" }}>
            <Button
              variant="contained"
              startIcon={<AddCircleOutline />}
              component={RouterLink}
              to="/products/create"
              sx={{ height: 56, borderRadius: 2, whiteSpace: "nowrap", width: { xs: "100%", md: "auto" } }}
            >
              افزودن محصول جدید
            </Button>
          </Grid>
        </Grid>

        {/* ظرف اسکرول داخلی */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
            overflow: "auto",                 // اسکرول افقی + عمودی فقط داخل باکس
            maxHeight: { xs: "70dvh", md: "unset" }, // ارتفاع کنترل‌شده در موبایل
            borderRadius: 2,
            border: (t) => `1px solid ${t.palette.divider}`,
          }}
        >
          <TableContainer sx={{ minWidth: 720 /* برای اسکرول افقی موبایل */ }}>
            <Table
              aria-label="my products"
              sx={{
                "& thead th": {
                  bgcolor: "background.default",
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                  position: "sticky", top: 0, zIndex: 1, // هدر ثابت هنگام اسکرول داخلی
                },
                "& tbody tr:not(:last-of-type) td": {
                  borderBottom: (t) => `1px solid ${t.palette.divider}`, // مرز بین ردیف‌ها
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center">شماره محصول</TableCell>
                  <TableCell>عکس محصول</TableCell>
                  <TableCell>نام محصول</TableCell>
                  <TableCell>تاریخ عرضه</TableCell>
                  <TableCell align="center">عملیات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paged.map((r) => (
                  <TableRow key={r.id} hover>
                    <TableCell align="center"><Typography fontWeight={700}>{r.id}</Typography></TableCell>
                    <TableCell>
                      <Avatar variant="rounded" src={r.image} alt={r.title} sx={{ width: 48, height: 48, borderRadius: 1.5 }} />
                    </TableCell>
                    <TableCell><Typography fontWeight={700}>{r.title}</Typography></TableCell>
                    <TableCell><Typography color="text.secondary">{fmtDate(r.date)}</Typography></TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <IconButton size="small" color="primary" component={RouterLink} to={`/products/${r.id}/edit`} aria-label="ویرایش">
                          <EditOutlined />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => onDelete(r.id)} aria-label="حذف">
                          <DeleteOutline />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {paged.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Stack alignItems="center" sx={{ py: 4 }}>
                        <Typography>محصولی یافت نشد.</Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* پیجینیشن سفارشی داخل همان باکس اسکرولی */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 1.5 }}
          >
            <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
              <InputLabel id="rpp-label">سطر در صفحه</InputLabel>
              <FormControl size="small">
                <Select
                  labelId="rpp-label"
                  value={rowsPerPage}
                  onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
                >
                  {[5, 10, 25].map((n) => <MenuItem key={n} value={n}>{n}</MenuItem>)}
                </Select>
              </FormControl>
            </Stack>
            <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
              <IconButton aria-label="قبل" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
                <ChevronRight />
              </IconButton>
              <Box sx={{ px: 1.5 }}>
                <Typography fontWeight={800}>صفحه {page + 1} از {totalPages}</Typography>
              </Box>
              <IconButton
                aria-label="بعد"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page + 1 >= totalPages}
              >
                <ChevronLeft />
              </IconButton>
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
