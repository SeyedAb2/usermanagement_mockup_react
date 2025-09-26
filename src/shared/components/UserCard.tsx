import { Phone, Visibility } from "@mui/icons-material";
import { Card, CardContent, Stack, Avatar, Box, Typography, Chip, Divider, CardActions, Button } from "@mui/material";
import { UserType } from "../types";
import { Link as RouterLink } from "react-router";
import { TYPE_ICON } from "../utils/menuItem";
import { USER_TYPE_LABEL } from "../utils/userTypeList";
import { toPersianDegit } from "../utils/toPersianDigits";
import { scrollToTop } from "../utils/scrollToTop";

export default function UserCard({user}:{user:UserType}){
    return (
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
            <CardContent >
                <Stack sx={{display:'flex',gap:1}} direction="row" spacing={3} alignItems="center">
                    <Avatar
                        src={user.logo??undefined}
                        alt={user.name}
                        sx={{ width: 56, height: 56 }}
                    />
                    <Box>
                        <Typography variant="subtitle1" fontWeight={700}>
                        {user.name}
                        </Typography>
                        <Stack direction="row" spacing={0} justifyContent='start' alignItems="center">
                            <Chip
                                size="small"
                                color="success"
                                icon={TYPE_ICON[user.type ?? 'farmer']}
                                label={USER_TYPE_LABEL[user.type ?? 'farmer']}
                                sx={{px:1, "& .MuiChip-icon": { mr: 0.5 },"& .MuiChip-label":{pr:0} }}
                            />
                        </Stack>
                    </Box>
                </Stack>

                <Divider sx={{ my: 1.5 }} />

                <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Phone fontSize="small" />
                    <Typography variant="body2">
                    <a href={`tel:${user.phone}`}>{`۰${toPersianDegit(user.phone)}`}</a>
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                    <Visibility fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                    ۰ بازدید
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
                onClick={()=>{scrollToTop()}}
                to={`/users/${user.id}`}
                sx={{ borderRadius: 2 }}
                >
                مشاهده پروفایل
                </Button>
            </CardActions>
        </Card>
    )
}