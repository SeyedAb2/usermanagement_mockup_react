import { Box, Grid, Paper, Typography, ButtonBase } from "@mui/material";
import { useNavigate } from "react-router";
import {
  Groups2,
  Menu,
  Category,
  ViewModule,
  PersonAddAlt,
  AccountCircle,
} from "@mui/icons-material";
import { useState, ReactNode } from "react";
interface DashboardItem {
  id: number;
  label: string;
  icon: ReactNode;
  path: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<number | null>(null);

  const items: DashboardItem[] = [
    { id: 1, label: "نقش", icon: <Groups2 />, path: "/role" },
    { id: 2, label: "منو", icon: <Menu />, path: "/menu" },
    {
      id: 3,
      label: "دسته‌بندی منو",
      icon: <Category />,
      path: "/menu-category",
    },
    {
      id: 4,
      label: "گروه‌بندی منو",
      icon: <ViewModule />,
      path: "/menu-group",
    },
    {
      id: 5,
      label: "افزودن پرسنل",
      icon: <PersonAddAlt />,
      path: "/add-personel",
    },
    {
      id: 6,
      label: "دسترسی کاربر",
      icon: <AccountCircle />,
      path: "/access-personel",
    },
  ];

  return (
    <Box
      sx={{
        bgcolor: "#f3f3f3",
        minHeight: "100vh",
        py: { xs: 4, sm: 6 },
        px: 2,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          borderRadius: "16px",
          p: { xs: 3, sm: 4 },
          width: "100%",
          maxWidth: "520px", // ✅ عرض باکس مادر کمتر شد
          bgcolor: "#fff",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 4,
            fontWeight: "bold",
            textAlign: "right",
            color: "#333",
            userSelect: "none",
          }}
        >
          بخش‌های ماک‌آپ مدیریت کاربران
        </Typography>

        <Grid container spacing={2}  justifyContent="center">
          {items.map((item) => (
            <Grid
              key={item.id}
              sx={{
                width:{xs:100,sm:170},
                xs: 12,
                sm: 6, // ✅ دو ستون
              }}
            >
              <ButtonBase
                onClick={() => navigate(item.path)}
                focusRipple
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                
                sx={{
                  
                  width: "100%",
                  aspectRatio: "1 / 1", // ✅ مربع دقیق
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid #e0e0e0", // ✅ بوردر کمرنگ اضافه شد
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  bgcolor: hovered === item.id ? "#e8f5e9" : "#f9f9f9",
                  transition: "all 0.25s ease",
                  transform:
                    hovered === item.id ? "scale(1.05)" : "scale(1)",
                  boxShadow:
                    hovered === item.id
                      ? "0 4px 10px rgba(0,0,0,0.15)"
                      : "0 2px 5px rgba(0,0,0,0.05)",
                  p: 3,
                }}
              >
                <Box
                  sx={{
                    color: hovered === item.id ? "#085E42" : "#777",
                    mb: 1,
                    transition: "color 0.3s ease",
                    "& svg": {
                      fontSize: { xs: 56, sm: 64 }, // ✅ آیکون بزرگ و هماهنگ
                    },
                  }}
                >
                  {item.icon}
                </Box>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: { xs: "1rem", sm: "1.05rem" },
                    color: hovered === item.id ? "#085E42" : "#444",
                    userSelect: "none",
                  }}
                >
                  {item.label}
                </Typography>
              </ButtonBase>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}
