import { PersonOutline, VisibilityOutlined } from "@mui/icons-material";
import { Card, CardHeader, CardContent, Stack, Avatar, Box, Typography, Tooltip, IconButton } from "@mui/material";
import { Link as RouterLink } from "react-router";

import { UserType } from "../types";

export default function NewUsersListCard({users}:{users:UserType[]}){
    return (
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardHeader
                avatar={<PersonOutline />}
                title="جدیدترین کاربران"
                sx={{'& .MuiCardHeader-avatar':{marginRight:0},pb: 0 }}
            />
            <CardContent>
                <Stack spacing={1.1}>
                {users.map((u) => (
                    <Stack key={u.id} direction="row" alignItems="center" sx={{ gap: 1.2 }}>
                    <Avatar src={u.logo??undefined} />
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="body2" noWrap>
                        {u.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                        {u.type === "farmer"
                            ? "کشاورز"
                            : u.type === "seller"
                            ? "فروشنده"
                            : "خدمات‌دهنده"}
                        </Typography>
                    </Box>
                    <Tooltip title="مشاهده پروفایل">
                        <IconButton size="small" component={RouterLink} to={`/users/${u.id}`}>
                        <VisibilityOutlined />
                        </IconButton>
                    </Tooltip>
                    </Stack>
                ))}
                </Stack>
            </CardContent>
        </Card>
    )
}