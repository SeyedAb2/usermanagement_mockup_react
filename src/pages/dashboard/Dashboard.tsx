// لایه داشبورد: سایدبار راست + Drawer موبایل + Outlet
import { useMemo, useState } from "react";
import {
  Avatar, Box, Card, Chip, Container, Divider, Drawer,
  IconButton, List, ListItemButton, ListItemIcon, ListItemText,
  Stack, Typography
} from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router";
import {
  AccountCircleOutlined, KeyOutlined, Menu as MenuIcon, ShoppingBasketOutlined
} from "@mui/icons-material";
import Seo from "../../shared/components/seo/Seo";

const USER = {
  name: "علی محمدی",
  avatar: "https://i.pravatar.cc/150?img=13",
  type: "farmer" as "farmer" | "seller" | "service",
};
const USER_TYPE_LABEL = { farmer: "کشاورز", seller: "فروشنده", service: "خدمات‌دهنده" } as const;

function useVTNavigate() {
  const navigate = useNavigate();
  return (to: string) => {
    const go = () => navigate(to);
    if (document.startViewTransition) document.startViewTransition(go);
    else go();
  };
}

export default function Dashboard() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const vtNavigate = useVTNavigate();
  const loc = useLocation();

  const menu = useMemo(
    () => [
      { key: "info", label: "حساب کاربری", icon: <AccountCircleOutlined />, to: "/dashboard/info" },
      { key: "my-products", label: "محصولات من", icon: <ShoppingBasketOutlined />, to: "/dashboard/my-products" },
      { key: "reset-pass", label: "تغییر رمز عبور", icon: <KeyOutlined />, to: "/dashboard/reset-pass" },
    ],
    []
  );
  const currentTitle = menu.find((m) => loc.pathname.startsWith(m.to))?.label ?? "حساب کاربری";

  const Sidebar = (
    <Card sx={{ borderRadius: 3, boxShadow: 4, p: 1.5 }}>
      <Stack alignItems="center" sx={{ mb: 1.5 }}>
        <Avatar src={USER.avatar} sx={{ width: 72, height: 72 }} />
        <Typography sx={{ mt: 1 }} fontWeight={800}>{USER.name}</Typography>
        <Chip size="small" color="success" label={USER_TYPE_LABEL[USER.type]} sx={{ mt: 0.5 }} />
      </Stack>
      <Divider sx={{ mb: 1 }} />
      <List component="nav" sx={{ direction: "rtl" }}>
        {menu.map((m) => {
          const selected = loc.pathname.startsWith(m.to);
          return (
            <ListItemButton
              key={m.key}
              selected={selected}
              onClick={() => vtNavigate(m.to)}
              sx={{
                px: 1.25, borderRadius: 2,
                "& .MuiListItemIcon-root": { minWidth: 0, ml: 1, mr: 0 },
                justifyContent: "flex-start",
              }}
            >
              <ListItemIcon>{m.icon}</ListItemIcon>
              <ListItemText primary={m.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );

  return (
    <>
      <Seo SITE_NAME="داشبورد کاربر" />
      <Box sx={{ py: { xs: 2, md: 4 } }}>
        <Container maxWidth="lg">
          {/* هدر موبایل: تمام‌عرض + عنوان پویا + دکمه منو */}
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
                {Sidebar}
              </Box>
            </Drawer>
          </Box>

          {/* بدنه: سایدبار راست + ستون اصلی */}
          <Stack direction="row" sx={{ gap: 2 }}>
            {/* Sidebar – دسکتاپ (sticky) */}
            <Box
              sx={{
                width: 280,
                display: { xs: "none", md: "block" },
                position: "sticky",
                top: 100,
                alignSelf: "flex-start",
                height: "fit-content",
              }}
            >
              {Sidebar}
            </Box>

            {/* Outlet – ستون اصلی */}
            <Box sx={{ flex: 1 }}>
              <Outlet />
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
