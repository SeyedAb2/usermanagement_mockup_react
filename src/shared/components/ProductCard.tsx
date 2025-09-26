import { PlaceOutlined, CalendarMonthOutlined, VisibilityOutlined, ShareOutlined, ContentCopyOutlined, ImageOutlined } from "@mui/icons-material";
import { Grid, Card, Box, CardHeader, Stack, Typography, Chip, Avatar, CardContent, Rating, CardActions, Button, Tooltip, IconButton } from "@mui/material";
import { Link as RouterLink } from "react-router";

import { CategoryKey, ProductType } from "../types/product.type";
import { CATEGORY_COLOR, TYPE_LABEL } from "../utils/product-const";
import { toPersianDegit } from "../utils/toPersianDigits";

export default function ProductCard({paged,config}:{paged:ProductType,config:{isShowUser:boolean}}){
    return(
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
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
                {paged.image ? (
                    <img
                        src={paged.image ?? undefined}
                        alt={paged.title}
                        style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
                    />
                    ) : (
                    <ImageOutlined sx={{ fontSize: 264,textAlign:'center',mx:'auto', opacity: 0.35 }} />
                    )}
                

                <CardHeader
                title={
                    <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ gap: 1 }}
                    >
                    <Typography variant="subtitle1" fontWeight={700} noWrap>
                        {paged.title}
                    </Typography>
                    <Chip
                        size="small"
                        color={CATEGORY_COLOR[paged.type as CategoryKey]}
                        label={TYPE_LABEL[paged.type as CategoryKey]}
                    />
                    </Stack>
                }
                subheader={
                    config.isShowUser && (
                    <Stack direction="row" alignItems="center" sx={{ gap: 1, mt: 0.5 }}>
                        <Avatar src={paged!.user?.logo ?? undefined} sx={{ width: 24, height: 24 }} />
                        <Typography variant="body2">{paged!.user?.name}</Typography>
                    </Stack>)
                }
                sx={{ pb: 0.5 }}
                />

                <CardContent sx={{ pt: 1 }}>
                <Stack spacing={1}>
                    <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
                    <PlaceOutlined fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                        {paged.address}
                    </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
                    <CalendarMonthOutlined fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                        {new Date(paged.created_at as Date).toLocaleDateString("fa-IR")}
                    </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
                    <Rating readOnly size="small" precision={0.5} value={paged.grade} />
                    <Typography variant="caption" color="text.secondary">
                        {toPersianDegit(paged.grade)} / ۵
                    </Typography>
                    </Stack>

                    <Typography variant="h6" sx={{ color: "success.main" }}>
                        {Number(paged.price).toLocaleString("fa-IR")} تومان
                    </Typography>
                </Stack>
                </CardContent>

                <Box flexGrow={1} />

                <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                <Button
                    size="small"
                    variant="contained"
                    component={RouterLink}
                    to={`/products/${paged.id}`}
                    sx={{ borderRadius: 2 }}
                    
                >
                    <VisibilityOutlined sx={{fontSize:20,ml:0.5}}/>
                    <Typography>مشاهده</Typography>
                </Button>
                <Stack direction="row" sx={{ gap: 0.5 }}>
                    <Tooltip title="اشتراک‌گذاری">
                    <IconButton
                        size="small"
                        onClick={() =>
                        navigator.share?.({
                            title: paged.title,
                            url: window.location.origin + `/products/${paged.id}`,
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
                            window.location.origin + `/products/${paged.id}`
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
    )
}