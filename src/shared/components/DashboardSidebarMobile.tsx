import { Box, Card, Stack, Typography, IconButton, Drawer } from "@mui/material";
import DashboardSidebar from "./DashboardSidebar";
import { useState } from "react";
import { useLocation } from "react-router";
import { dashboardMenuItem } from "../utils/menuItem";
import { Menu as MenuIcon } from "@mui/icons-material";

export default function DashboardSidebarMobile(){
    const [openDrawer, setOpenDrawer] = useState(false);
    const loc = useLocation();
    const currentTitle = dashboardMenuItem.find((m) => loc.pathname.startsWith(m.path))?.name ?? "حساب کاربری";
    return (
        <Box sx={{ display: { xs: "block", md: "none" }, mb: 1.5 }}>
            <Card sx={{ p: 1.25, borderRadius: 3, width: "100%" }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography fontWeight={900}>{currentTitle}</Typography>
                <IconButton onClick={() => setOpenDrawer(true)} aria-label="منو">
                    <MenuIcon />
                </IconButton>
                </Stack>
            </Card>
            <Drawer anchor="right" open={openDrawer} onClose={() => setOpenDrawer(false)}>
                <Box sx={{ width: 280, p: 1.5 }} onClick={() => setOpenDrawer(false)}>
                <DashboardSidebar />
                </Box>
            </Drawer>
        </Box>
    )
}