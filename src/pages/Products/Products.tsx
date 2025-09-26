import {
  Box,
  Button,
  Card,
  Container,
  Drawer,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import {
  Search,
} from "@mui/icons-material";
import { useMemo, useState } from "react";
import Seo from "../../shared/components/seo/Seo";
import { ProductType, UserType } from "../../shared/types";
import { CategoryKey } from "../../shared/types/product.type";
import ProductSearchFilterCard from "../../shared/components/ProductSearchFilterCard";
import PaginationCard from "../../shared/components/PaginationCard";
import NewUsersListCard from "../../shared/components/NewUsersList";
import LatestProductsCard from "../../shared/components/LatestProducts";
import ProductCard from "../../shared/components/ProductCard";
import NotProductFound from "../../shared/components/NotProductsFound";
import { useQueries } from "@tanstack/react-query";
import { getAllProductApi } from "../../services/api/product";
import { getAllusersApi } from "../../services/api/auth";
import Error from "../../shared/components/Error";


export default function Products() {
  const [q, setQ] = useState("");
  const [selectedCats, setSelectedCats] = useState<CategoryKey[]>([]);
  const [sort, setSort] = useState<"new" | "old">("new");
  const [priceRange, setPriceRange] = useState<number[]>([100_000, 150_000_000]);

  const [qInput, setQInput] = useState(q);
  const [catsInput, setCatsInput] = useState<CategoryKey[]>(selectedCats);
  const [sortInput, setSortInput] = useState<"new" | "old">(sort);
  const [priceInput, setPriceInput] = useState<number[]>(priceRange);

  const results = useQueries({
    queries:[
      {
        queryKey:['allProducts'],
        queryFn: getAllProductApi
      },
      {
        queryKey:['allUsers'],
        queryFn: getAllusersApi
      }
    ]
  })

  const [ responseAllProducts, responseAllUsers ] = results
  const isLoading = responseAllProducts.isLoading || responseAllUsers.isLoading;
  const isError = responseAllProducts.isError || responseAllUsers.isError;

  const products:ProductType[] | [] = responseAllProducts.data ?? [];
  const latestProducts:ProductType[] | [] = products.slice(0, 3);
  const newUsers:UserType[] | [] = responseAllUsers.data ? responseAllUsers.data.slice(0 , 4) : [];

  const applyFilters = () => {
    setQ(qInput);
    setSelectedCats(catsInput);
    setSort(sortInput);
    setPriceRange(priceInput);
    setPage(1);
  };

  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const filtered = useMemo(() => {
    const term = q.trim();
    const arr = products.filter((p:ProductType) => {
      const byName = !term || (p.title ?? '').includes(term) || (p!.user?.name ?? '').includes(term);
      const byCat = selectedCats.length === 0 || selectedCats.includes(p.type as CategoryKey);
      const byPrice = +(p.price as string) >= priceRange[0] && +(p.price as string) <= priceRange[1];
      return byName && byCat && byPrice;
    });
    arr.sort((a, b) =>
      sort === "new" ? +new Date(b.created_at as Date) - +new Date(a.created_at as Date) : +new Date(a.created_at as Date) - +new Date(b.created_at as Date)
    );
    return arr;
  }, [q, selectedCats, sort, priceRange , products]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleCatInput = (key: CategoryKey) =>
    setCatsInput((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));


  if(isLoading)
    return <p>در حال بارگیری...</p>

  if(isError)
    return <Error />


  return (
    <>
      <Seo SITE_NAME="محصولات | وال‌فارم" />
      <Box sx={{ py: { xs: 3, md: 5 } }}>
        <Container maxWidth="lg">
          <Box sx={{ display: { xs: "none", md: "block" }, mb: 2 }}>
            <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
              <ProductSearchFilterCard 
                sortInput={sortInput}
                setSortInput={setSortInput}
                qInput={qInput}
                setQInput={setQInput}
                catsInput={catsInput}
                toggleCatInput={toggleCatInput}
                priceInput={priceInput}
                setPriceInput={setPriceInput}
                applyFilters={applyFilters}
              />
            </Card>
          </Box>

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

          <Drawer anchor="bottom" open={filterOpen} onClose={() => setFilterOpen(false)}>
            <Box sx={{ p: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="subtitle1">فیلترها</Typography>
                <Button onClick={() => setFilterOpen(false)}>بستن</Button>
              </Stack>
              <ProductSearchFilterCard 
                sortInput={sortInput}
                setSortInput={setSortInput}
                qInput={qInput}
                setQInput={setQInput}
                catsInput={catsInput}
                toggleCatInput={toggleCatInput}
                priceInput={priceInput}
                setPriceInput={setPriceInput}
                applyFilters={applyFilters}
              />
            </Box>
          </Drawer>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8, lg: 9 }}>
              {filtered.length === 0 && (
                <NotProductFound />
              )}

              <Grid container spacing={2}>
                  {paged.map((p) => (
                    <ProductCard key={p.id} paged={p} config={{isShowUser:true}}/> 
                  ))}
              </Grid>

              <PaginationCard totalPages={totalPages} page={page} setPage={setPage}/>
            </Grid>

            <Grid
              size={{ xs: 12, md: 4, lg: 3 }}
              sx={{
                display: { xs: "none", md: "block" },
                position: "sticky",
                top: (theme) => theme.spacing(10),
                alignSelf: "flex-start",
              }}
            >
              <LatestProductsCard products={latestProducts} />

              <NewUsersListCard users={newUsers}/>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}