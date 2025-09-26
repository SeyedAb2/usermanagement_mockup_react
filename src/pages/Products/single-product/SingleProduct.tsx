import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Stack,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  IconButton,
  Button,
  Rating,
  Grid,
} from "@mui/material";
import {
  ShareOutlined,
  ContentCopyOutlined,
  CalendarMonthOutlined,
  PlaceOutlined,
  VisibilityOutlined,
  ImageOutlined,
} from "@mui/icons-material";
import { Link as RouterLink, useParams } from "react-router";
import { useQueries } from "@tanstack/react-query";
import { getProductApi, getAllProductApi } from "../../../services/api/product";
import { ProductType } from "../../../shared/types";
import {
  TYPE_LABEL,
  CATEGORY_COLOR
} from "../../../shared/utils/product-const";
import Error from "../../../shared/components/Error";
import ProductCard from "../../../shared/components/ProductCard";
import SpecsList from "../../../shared/components/SpecsList";
import { toPersianDegit } from "../../../shared/utils/toPersianDigits";
import ProductDetailPageSkeleton from "../../../shared/components/skeletons/ProductDetailPageSkeleton";



export default function ProductDetailPage() {
  const { productId } = useParams();

  const [productQuery, allProductsQuery] = useQueries({
    queries: [
      {
        queryKey: ["product", productId],
        queryFn: () => getProductApi(productId as string),
      },
      {
        queryKey: ["products"],
        queryFn: getAllProductApi,
      },
    ],
  });

  const isLoading = productQuery.isLoading || allProductsQuery.isLoading;
  const isError = productQuery.isError || allProductsQuery.isError;

  if (isLoading) return <ProductDetailPageSkeleton />;
  if (isError) return <Error />;

  const product = productQuery.data as ProductType;
  const allProducts = allProductsQuery.data ?? [];

  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <Box sx={{ py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <Card
          sx={(t) => ({
            mb: 3,
            borderRadius: 3,
            boxShadow: 4,
            overflow: "hidden",
            borderTop: `5px solid ${
              (t.palette).wlc?.[500] ?? t.palette.primary.main
            }`,
          })}
        >
          <Grid container>
            <Grid size={{xs:12,md:6}}>
              {product.image ? (
                <Box
                  component="img"
                  src={product.image}
                  alt={product.title}
                  sx={{
                    width: "100%",
                    height: { xs: 260, md: "100%" },
                    objectFit: "cover",
                  }}
                />
              ) : (
                <ImageOutlined
                  sx={{
                    fontSize: 180,
                    width: "100%",
                    height: 260,
                    display: "block",
                    textAlign: "center",
                    mx: "auto",
                    opacity: 0.3,
                  }}
                />
              )}
            </Grid>

            {/* اطلاعات */}
            <Grid size={{xs:12,md:6}}>
              <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h5" fontWeight={800} noWrap>
                    {product.title}
                  </Typography>
                  <Chip
                    size="small" sx={{px:1}}
                    color={CATEGORY_COLOR[product.type as keyof typeof CATEGORY_COLOR]}
                    label={TYPE_LABEL[product.type as keyof typeof TYPE_LABEL]}
                  />
                </Stack>

                {/* نویسنده و متا */}
                <Stack direction="row" spacing={1.5} mt={2} flexWrap="wrap">
                  <Avatar src={product.user?.logo ?? undefined} sx={{ width: 28, height: 28 }} />
                  <Typography variant="body2" sx={{px:0.5,pt:0.2}}>{product.user?.name}</Typography>

                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <CalendarMonthOutlined fontSize="small" />
                    <Typography variant="body2" sx={{px:0.5,pt:0.4}} color="text.secondary">
                      {new Date(product.created_at as Date).toLocaleDateString("fa-IR")}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <PlaceOutlined fontSize="small" />
                    <Typography sx={{px:0.5,pt:0.1}} variant="body2" color="text.secondary">
                      {product.address}
                    </Typography>
                  </Stack>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h5" sx={{ color: "success.main" }}>
                    {Number(product.price).toLocaleString("fa-IR")} تومان
                  </Typography>
                  <Stack direction="row">
                    <Tooltip title="اشتراک‌گذاری">
                      <IconButton
                        onClick={() =>
                          navigator.share?.({
                            title: product.title,
                            url: window.location.href,
                          })
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
                <Typography variant="body2" color="text.secondary" mt={2}>
                  {product.info}
                </Typography>

                {/* امتیاز */}
                <Stack direction="row" alignItems="center" spacing={1.5} mt={2}>
                  <Rating readOnly size="small" value={product.grade ?? 0} precision={0.5} />
                  <Typography variant="caption" color="text.secondary">
                    {toPersianDegit(product.grade ?? 0)} / ۵
                  </Typography>
                </Stack>

                {/* مشخصات اضافی */}
                <SpecsList product={product} />

                {/* دکمه پروفایل فروشنده */}
                <Button
                  sx={{ mt: 2, borderRadius: 2 }}
                  variant="outlined"
                  component={RouterLink}
                  to={`/users/${product.user?.id}`}
                >
                  <VisibilityOutlined sx={{fontSize:20, ml:1}}/>
                  مشاهده پروفایل فروشنده
                </Button>
              </CardContent>
            </Grid>
          </Grid>
        </Card>

        {/* محصولات مرتبط */}
        <Typography variant="h6" fontWeight={700} mb={2}>
          محصولات مرتبط
        </Typography>
        <Grid container spacing={2}>
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} paged={p} config={{ isShowUser: true }} />
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
