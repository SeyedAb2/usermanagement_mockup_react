import { useEffect, useMemo, useState } from "react";
import {
  Card, CardContent, IconButton, InputAdornment, Stack, TextField, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Avatar,
  Select, MenuItem, FormControl, InputLabel, Box,
  Grid
} from "@mui/material";
import { Link as RouterLink } from "react-router";
import { Search, EditOutlined, DeleteOutline, AddCircleOutline, ChevronRight, ChevronLeft, ImageOutlined } from "@mui/icons-material";
import { LabelPosition } from "../../../shared/utils/textFieldLabelStyleConfig";
import { useQuery } from "@tanstack/react-query";
import { getAllProductApi } from "../../../services/api/product";
import Error from "../../../shared/components/Error";
import { ProductType } from "../../../shared/types";
import { fmtDate } from "../../../shared/types/fmtDate";
import AlertDialogSlide from "../../../shared/components/AlertDialog";
import useDelete from "../../../shared/hooks/useDelete";
import MyProductsSkeleton from "../../../shared/components/skeletons/MyProductsSkeleton";

export default function MyProducts() {
  const {
    data: products = [],     
    isLoading,
    isError,
    isSuccess,
  } = useQuery<ProductType[]>({
    queryKey: ["allProduct"],
    queryFn: getAllProductApi,
  });

  const {isPending, mutate} = useDelete()

  const [q, setQ] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const qNorm = q.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!isSuccess) return [];
    return products.filter((r) => {
      const title = (r.title ?? "").toLowerCase();
      return !qNorm || title.includes(qNorm);
    });
  }, [isSuccess, products, qNorm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));

  useEffect(() => {
    setPage((p) => Math.min(Math.max(0, totalPages - 1), p));
  }, [totalPages]);

  const paged = useMemo(
    () => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filtered, page, rowsPerPage]
  );

  const askDelete = (id: number | undefined | null) => {
    if (!id) return;
    setSelectedId(id);
    setOpenDialog(true);
  };

  const onDelete = () => {
    if (!selectedId) return;
    mutate(selectedId, {
      onSuccess: () => {
        setOpenDialog(false);
        setSelectedId(null);
      },
    });
  };

  if (isLoading) return <MyProductsSkeleton />;
  if (isError) return <Error />;

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 4, width: "100%" }}>
      <CardContent sx={{ p: 2 }}>
        <Grid container spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
          <Grid size={{ xs: 12, md: "auto" }}>
            <TextField
              fullWidth
              sx={LabelPosition({ right: 15, rightActive: 30 })}
              InputLabelProps={{ shrink: true }}
              inputProps={{ dir: "rtl" }}
              label="جستجوی محصول"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(0);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: "auto" }}>
            <Button
              variant="contained"
              component={RouterLink}
              to="/dashboard/my-products/create"
              sx={{ height: 56, borderRadius: 2, whiteSpace: "nowrap", width: { xs: "100%", md: "auto" } }}
            >
              <AddCircleOutline sx={{ fontSize: 20, mx: 0.5 }} />
              افزودن محصول جدید
            </Button>
          </Grid>
        </Grid>

        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
            overflow: "auto",
            maxHeight: { xs: "70dvh", md: "unset" },
            borderRadius: 2,
            border: (t) => `1px solid ${t.palette.divider}`,
          }}
        >
          <TableContainer sx={{ minWidth: 720 }}>
            <Table
              aria-label="my products"
              sx={{
                "& thead th": {
                  bgcolor: "background.default",
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                },
                "& tbody tr:not(:last-of-type) td": {
                  borderBottom: (t) => `1px solid ${t.palette.divider}`,
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
                    <TableCell align="center">
                      <Typography fontWeight={700}>{r.id}</Typography>
                    </TableCell>
                    <TableCell>
                      {r.image ? (
                          <Avatar
                            variant="rounded"
                            src={r.image ?? undefined}
                            alt={r.title ?? ""}
                            sx={{ width: 48, height: 48, borderRadius: 1.5 }}
                          />
                        ) : (
                          <ImageOutlined sx={{ fontSize: 48, opacity: 0.35 }} />
                        )}
                      
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={700}>{r.title ?? "—"}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color="text.secondary">
                        {r.created_at ? fmtDate(r.created_at) : "—"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <IconButton
                          size="small"
                          color="primary"
                          component={RouterLink}
                          to={`/dashboard/my-products/${r.id}/edit`}
                          aria-label="ویرایش"
                        >
                          <EditOutlined />
                        </IconButton>
                        
                        <IconButton onClick={()=>{askDelete(r.id)}}
                          size="small"
                          color="error"
                          aria-label="حذف"
                        >
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

          {/* پیجینیشن سفارشی */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1.5 }}>
            <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
              <InputLabel id="rpp-label">سطر در صفحه</InputLabel>
              <FormControl size="small">
                <Select
                  labelId="rpp-label"
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setPage(0);
                  }}
                >
                  {[5, 10, 25].map((n) => (
                    <MenuItem key={n} value={n}>
                      {n}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
              <IconButton
                aria-label="قبل"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                <ChevronRight />
              </IconButton>
              <Box sx={{ px: 1.5 }}>
                <Typography fontWeight={800}>
                  صفحه {page + 1} از {totalPages}
                </Typography>
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
          <AlertDialogSlide open={openDialog} isPending={isPending} agreeDelete={()=>{onDelete()}} handleClose={()=>{setOpenDialog(false)}}/>
        </Box>
      </CardContent>
    </Card>
  );
}
