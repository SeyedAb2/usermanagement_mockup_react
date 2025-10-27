import { Box, Grid, Paper, Typography, ButtonBase } from "@mui/material";
import { useNavigate } from "react-router";
import {
  Groups2,
  Menu,
  Category,
  ViewModule,
  PersonAddAlt,
  AccountCircle,
  Code, // آیکون برای مدیریت صفحات
  DeveloperBoard, // آیکون برای دسته‌بندی صفحات
} from "@mui/icons-material";
import { useState, ReactNode } from "react";

// ------------------ تایپ‌ها و داده‌ها ------------------

interface DashboardItem {
  id: number;
  label: string;
  icon: ReactNode;
  path: string;
}

const USER_MANAGEMENT_ITEMS: DashboardItem[] = [
  { id: 1, label: "نقش", icon: <Groups2 />, path: "/role" },
  { id: 2, label: "دسترسی نقش", icon: <AccountCircle />, path: "/access-role" },
  { id: 3, label: "منو", icon: <Menu />, path: "/menu" },
  { id: 4, label: "دسته‌بندی منو", icon: <Category />, path: "/menu-category" },
  { id: 5, label: "گروه‌بندی منو", icon: <ViewModule />, path: "/menu-group" },
  { id: 6, label: "افزودن پرسنل", icon: <PersonAddAlt />, path: "/add-personel" },
];

const DEVELOPER_ITEMS: DashboardItem[] = [
  { id: 7, label: "مدیریت صفحات", icon: <Code />, path: "/pages-management" },
  { id: 8, label: "دسته‌بندی صفحات", icon: <DeveloperBoard />, path: "/category-page" },
];

// ------------------ کامپوننت اصلی ------------------

export default function Dashboard() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<number | null>(null);

  /**
   * رندر کردن آیتم‌های داخلی گرید با اندازه ستون مشخص
   * @param item - داده‌های آیتم
   * @param cols - تعداد ستون‌های مورد نظر (مثلاً 6 برای دو ستون)
   */
  const renderGridItem = (item: DashboardItem, cols: 6 | 4 | 3) => (
    // با تنظیم xs={6}، در هر اندازه صفحه‌ای (از موبایل به بالا) دو ستون خواهیم داشت
    <Grid size={{xs:cols,sm:cols,md:cols}} key={item.id} sx={{ p: 1 }}> 
      <ButtonBase
        onClick={() => navigate(item.path)}
        focusRipple
        onMouseEnter={() => setHovered(item.id)}
        onMouseLeave={() => setHovered(null)}
        sx={{
          width: "100%",
          aspectRatio: "1 / 1", 
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #e0e0e0", 
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: hovered === item.id ? "#e8f5e9" : "#f9f9f9",
          transition: "all 0.25s ease",
          transform: hovered === item.id ? "scale(1.05)" : "scale(1)",
          boxShadow: hovered === item.id ? "0 4px 10px rgba(0,0,0,0.15)" : "0 2px 5px rgba(0,0,0,0.05)",
          p: 3,
        }}
      >
        <Box
          sx={{
            color: hovered === item.id ? "#085E42" : "#777",
            mb: 1,
            transition: "color 0.3s ease",
            "& svg": {
              fontSize: { xs: 56, sm: 64 },
            },
          }}
        >
          {item.icon}
        </Box>
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: { xs: "0.85rem", sm: "1rem" },
            color: hovered === item.id ? "#085E42" : "#444",
            userSelect: "none",
            textAlign: 'center'
          }}
        >
          {item.label}
        </Typography>
      </ButtonBase>
    </Grid>
  );

  /**
   * رندر کردن کل یک بخش داشبورد (به عنوان یک ستون اصلی)
   */
  const renderSection = (title: string, items: DashboardItem[], titleColor: string, itemCols: 6 | 4 | 3) => (
    // md={6}: دو ستون مساوی در دسکتاپ (کنار هم)
    // xs={12}: یک ستون کامل در موبایل (زیر هم)
    <Grid sx={{xs:12,md:6}}> 
      <Paper
        elevation={3}
        sx={{
          borderRadius: "16px",
          p: { xs: 3, sm: 4 },
          bgcolor: "#fff",
          height: '100%',
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            fontWeight: "bold",
            textAlign: "right",
            color: titleColor,
            userSelect: "none",
          }}
        >
          {title}
        </Typography>

        <Grid container spacing={1} justifyContent="flex-start">
          {items.map(item => renderGridItem(item, itemCols))}
        </Grid>
      </Paper>
    </Grid>
  );

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
      {/* کانتینر اصلی برای قرارگیری دو ستون کنار هم */}
      <Grid sx={{
        display:'flex',
        alignItems:'start',
        justifyContent:'center',
        gap:2
      }} spacing={3} maxWidth="1200px" > 
        
        {/* 1. بخش مدیریت کاربران (ماک‌آپ کاربر نهایی) - با تنظیم itemCols=6، طرح 2 ستونی حفظ می‌شود */}
        {renderSection(
          "بخش‌های ماک‌آپ مدیریت کاربران",
          USER_MANAGEMENT_ITEMS,
          "#333",
          4 // هر آیتم 50% عرض گرید داخلی را می‌گیرد (2 ستون)
        )}

        {/* 2. بخش توسعه‌دهندگان - با تنظیم itemCols=6، طرح 2 ستونی ایجاد می‌شود */}
        {renderSection(
          "ابزارهای توسعه‌دهندگان",
          DEVELOPER_ITEMS,
          "#333",
          6 // هر آیتم 50% عرض گرید داخلی را می‌گیرد (2 ستون)
        )}
        
      </Grid>
    </Box>
  );
}