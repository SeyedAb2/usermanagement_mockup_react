import {
  Box,
  Button,
  Card,
  Container,
  Drawer,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useParams } from "react-router";
import { useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";

import { getUserApi } from "../../../services/api/auth";
import { getUserProductsApi } from "../../../services/api/product";

import UserHeaderDetailCard from "../../../shared/components/UserHeaderDetailCard";
import ProductSearchFilterCard from "../../../shared/components/ProductSearchFilterCard";
import PaginationCard from "../../../shared/components/PaginationCard";
import ProductCard from "../../../shared/components/ProductCard";
import NotProductFound from "../../../shared/components/NotProductsFound";
import Error from "../../../shared/components/Error";

import { CategoryKey } from "../../../shared/types/product.type";
import { UserType } from "../../../shared/types";

export default function UserDetailPage() {
  const { userId } = useParams();
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [filterOpen, setFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    q: "",
    cats: [] as CategoryKey[],
    sort: "new" as "new" | "old",
    priceRange: [100_000, 150_000_000],
  });

  const [draftFilters, setDraftFilters] = useState(filters);

  const [userQuery, productsQuery] = useQueries({
    queries: [
      {
        queryKey: ["user", userId],
        queryFn: () => getUserApi(userId as string),
      },
      {
        queryKey: ["userProducts", userId],
        queryFn: () => getUserProductsApi(userId as string),
      },
    ],
  });

  const user = userQuery.data;
  const products = productsQuery.data ?? [];

  const filtered = useMemo(() => {
    const term = filters.q.trim();

    const arr = products.filter((p) => {
      const byName = !term || (p.title ?? "").includes(term);
      const byCat =
        filters.cats.length === 0 || filters.cats.includes(p.type as CategoryKey);
      const byPrice =
        +(p.price ?? 0) >= filters.priceRange[0] &&
        +(p.price ?? 0) <= filters.priceRange[1];

      return byName && byCat && byPrice;
    });

    arr.sort((a, b) =>
      filters.sort === "new"
        ? +new Date(b.created_at as Date) - +new Date(a.created_at as Date)
        : +new Date(a.created_at as Date) - +new Date(b.created_at as Date)
    );

    return arr;
  }, [filters, products]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  if (userQuery.isLoading || productsQuery.isLoading) return <p>در حال بارگیری…</p>;
  if (userQuery.isError || productsQuery.isError) return <Error />;

  return (
    <Box sx={{ py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <UserHeaderDetailCard user={user as UserType} />

        <Box sx={{ display: { xs: "none", md: "block" }, mb: 2 }}>
          <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
            <ProductSearchFilterCard
              sortInput={draftFilters.sort}
              setSortInput={(v) => setDraftFilters((p) => ({ ...p, sort: v }))}
              qInput={draftFilters.q}
              setQInput={(v) => setDraftFilters((p) => ({ ...p, q: v }))}
              catsInput={draftFilters.cats}
              toggleCatInput={(k) =>
                setDraftFilters((p) => ({
                  ...p,
                  cats: p.cats.includes(k)
                    ? p.cats.filter((x) => x !== k)
                    : [...p.cats, k],
                }))
              }
              priceInput={draftFilters.priceRange}
              setPriceInput={(v) => setDraftFilters((p) => ({ ...p, priceRange: v }))}
              applyFilters={() => {
                setFilters(draftFilters);
                setPage(1);
              }}
            />
          </Card>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          sx={{ display: { xs: "flex", md: "none" }, mb: 2 }}
        >
          <TextField
            size="small"
            fullWidth
            placeholder="جست‌وجو…"
            value={draftFilters.q}
            onChange={(e) =>
              setDraftFilters((p) => ({ ...p, q: e.target.value }))
            }
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

        <Drawer
          anchor="bottom"
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
        >
          <Box sx={{ p: 2 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Typography variant="subtitle1">فیلترها</Typography>
              <Button onClick={() => setFilterOpen(false)}>بستن</Button>
            </Stack>
            <ProductSearchFilterCard
              sortInput={draftFilters.sort}
              setSortInput={(v) => setDraftFilters((p) => ({ ...p, sort: v }))}
              qInput={draftFilters.q}
              setQInput={(v) => setDraftFilters((p) => ({ ...p, q: v }))}
              catsInput={draftFilters.cats}
              toggleCatInput={(k) =>
                setDraftFilters((p) => ({
                  ...p,
                  cats: p.cats.includes(k)
                    ? p.cats.filter((x) => x !== k)
                    : [...p.cats, k],
                }))
              }
              priceInput={draftFilters.priceRange}
              setPriceInput={(v) => setDraftFilters((p) => ({ ...p, priceRange: v }))}
              applyFilters={() => {
                setFilters(draftFilters);
                setPage(1);
                setFilterOpen(false);
              }}
            />
          </Box>
        </Drawer>

        {filtered.length === 0 ? (
          <NotProductFound />
        ) : (
          <>
            <Grid container spacing={2}>
              {paged.map((p) => (
                <ProductCard
                  key={p.id}
                  paged={p}
                  config={{ isShowUser: false }}
                />
              ))}
            </Grid>
            <PaginationCard
              totalPages={totalPages}
              page={page}
              setPage={setPage}
            />
          </>
        )}
      </Container>
    </Box>
  );
}