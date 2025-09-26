import { Grid } from "@mui/material";
import ProductCardShell from "./ProductCardShell";

export default function ProductCardItemSkeleton() {
  return (
    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
      <ProductCardShell />
    </Grid>
  );
}
