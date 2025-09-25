import { Card, Stack, Avatar, Typography, Chip, Divider, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import useVTNavigate from "../hooks/useVTNavigate";
import { USER_TYPE_LABEL } from "../utils/userTypeList";
import { useAuthStore } from "../../store/auth.store";
import { useLocation } from "react-router";
import { useMemo } from "react";
import { ListPageIconType } from "../types";
import { dashboardMenuItem } from "../utils/menuItem";

const DashboardSidebar = ()=>{
    const USER_TYPE = USER_TYPE_LABEL 
    const USER = useAuthStore(state=>state.getUser())
    const vtNavigate = useVTNavigate();
    const loc = useLocation();
    
    const menu:ListPageIconType[] = useMemo(
        () => dashboardMenuItem,[]
    );
    

    return (
        <Card sx={{ borderRadius: 3, boxShadow: 4, p: 1.5 }}>
            {USER && (
                <Stack alignItems="center" sx={{ mb: 1.5 }}>
                    <Avatar src={USER?.logo ?? undefined} sx={{ width: 72, height: 72 }} />
                    <Typography sx={{ mt: 1 }} fontWeight={800}>{USER?.name}</Typography>
                    <Chip size="small" color="success" label={USER.type ? USER_TYPE[USER.type] : ''} sx={{ mt: 0.5, px:0.75 }} />
                </Stack>
            )}
            <Divider sx={{ mb: 1 }} />
            <List component="nav" sx={{ direction: "rtl" }}>
            {menu.map((m) => {
                const selected = loc.pathname.startsWith(m.path);
                return (
                <ListItemButton
                    key={m.key}
                    selected={selected}
                    onClick={() => vtNavigate(m.path)}
                    sx={{
                    px: 1.25, borderRadius: 2,
                    "& .MuiListItemText-root":{ flex:'none' },
                    "& .MuiListItemIcon-root": { minWidth: 0, ml: 1, mr: 0 },
                    justifyContent: "flex-start",
                    }}
                >
                    <ListItemIcon>{m.icon}</ListItemIcon>
                    <ListItemText primary={m.name} />
                </ListItemButton>
                );
            })}
            </List>
        </Card>
    )
}

export default DashboardSidebar;