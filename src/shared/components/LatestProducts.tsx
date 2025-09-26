import { CategoryOutlined } from "@mui/icons-material";
import { Card, CardHeader, CardContent, Stack, Typography, Chip } from "@mui/material";
import { CATEGORY_COLOR, TYPE_LABEL } from "../utils/product-const";
import { ProductType } from "../types";
import { CategoryKey } from "../types/product.type";

export default function LatestProductsCard({products}:{products:ProductType[]}){
    return (
        <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 3 }}>
            <CardHeader sx={{'& .MuiCardHeader-avatar':{marginRight:0},pb: 0 }} avatar={<CategoryOutlined />} title="آخرین محصولات"/>
            <CardContent>
                <Stack spacing={1.2}>
                {products.map((p) => (
                    <Stack key={p.id} spacing={0.25}>
                    <Typography variant="body2" fontWeight={600} noWrap>
                        {p.title}
                    </Typography>
                    <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
                        <Chip
                        size="small"
                        color={CATEGORY_COLOR[p.type as CategoryKey]}
                        label={TYPE_LABEL[p.type as CategoryKey]}
                        sx={{ "& .MuiChip-label": { fontSize: "0.72rem" } }}
                        />
                        <Typography variant="caption" color="text.secondary">
                        {new Date(p.created_at as Date).toLocaleDateString("fa-IR")}
                        </Typography>
                    </Stack>
                    </Stack>
                ))}
                </Stack>
            </CardContent>
        </Card>
    )
}