import { Box, Grid, Paper, Typography, ButtonBase, Divider } from "@mui/material";
import { useNavigate } from "react-router";
import {
  Groups2,
  Menu,
  Category,
  ViewModule,
  PersonAddAlt,
  AccountCircle,
  Code,
  DeveloperBoard,
  Terminal, 
  Description, 
  AccountBox, 
  ArrowBack, // **تغییر ۱: استفاده از ArrowBack برای جهت RTL و اتصال مراحل**
} from "@mui/icons-material";
import { useState, ReactNode } from "react";
import React from "react"; // نیاز به import React برای استفاده از React.Fragment

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
  { id: 7, label: "مدیریت صفحات", icon: <Code />, path: "/add-page" },
  { id: 8, label: "گروه بندی صفحات", icon: <DeveloperBoard />, path: "/category-page" },
  { id: 9, label: "سرویس", icon: <Terminal />, path: "" },
];

// ------------------ داده‌های فلوچارت جدید ------------------

interface FlowStep {
  label: string;
  icon: ReactNode;
  color: string;
  section: 'توسعه دهنده' | 'کاربرنهایی';
}

const FLOW_STEPS: FlowStep[] = [
  { label: "سرویس", icon: <Terminal />, color: "#4caf50", section: 'توسعه دهنده' },
  { label: "صفحه", icon: <Description />, color: "#00bcd4", section: 'توسعه دهنده' },
  { label: "منو", icon: <Menu />, color: "#ff9800", section: 'کاربرنهایی' },
  { label: "نقش", icon: <Groups2 />, color: "#f44336", section: 'کاربرنهایی' },
  { label: "کاربر", icon: <AccountBox />, color: "#2196f3", section: 'کاربرنهایی' },
];

// **تغییر ۲: بلد کردن کلمات ستاره‌دار در متن**
const FLOW_DESCRIPTION = "در بخش توسعه دهندگان (Dev) ابتدا **سرویس** و سپس **صفحه** تعریف می‌شود، یعنی سرویس ایجاد می‌شود بعد به صفحه‌ای وصل می‌شود. کاربرنهایی ابتدا از این صفحات استفاده می‌کند تا **منو** را ایجاد کند. پس از آن **نقش** تعریف می‌شود و در بخش مدیریت دسترسی نقش، منوها به نقش اضافه می‌شود. در گام نهایی بعد از ایجاد نقش، به سراغ ایجاد **کاربر** رفته و نقش‌های موجود را به کاربر اختصاص می‌دهیم.";

// ------------------ کامپوننت نمایش روند کار ------------------

const StepFlow = () => {
    return (
        <Paper
            elevation={4}
            sx={{
                borderRadius: "16px",
                p: { xs: 3, sm: 4 },
                mb: 4, 
                bgcolor: "#fff",
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
            }}
        >
            <Typography
                variant="h5"
                sx={{ mb: 3, fontWeight: "bold", textAlign: "right", color: "#303f9f" }}
            >
                 روند کار با سامانه مدیریت کاربران
            </Typography>

            {/* بخش فلوچارت اصلی */}
            <Box sx={{ overflowX: 'auto', py: 2 }}>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: { xs: 'flex-start', md: 'space-between' },
                    minWidth: { xs: '800px', md: '100%' } 
                }}>
                    {FLOW_STEPS.map((step, index) => (
                        <React.Fragment key={index}>
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center',
                                    minWidth: '130px', 
                                    position: 'relative', // برای قرارگیری صحیح خط وسط
                                }}
                            >
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 2,
                                        borderRadius: '12px',
                                        bgcolor: step.section === 'توسعه دهنده' ? '#e1f5fe' : '#e8f5e9', 
                                        border: `2px solid ${step.color}`,
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                            transform: 'translateY(-4px)'
                                        }
                                    }}
                                >
                                    <Box sx={{ color: step.color, mb: 0.5, '& svg': { fontSize: 36 } }}>
                                        {step.icon}
                                    </Box>
                                    <Typography 
                                        variant="caption" 
                                        sx={{ 
                                            fontWeight: 'bold', 
                                            color: '#333',
                                            display: 'block',
                                            textAlign: 'center'
                                        }}
                                    >
                                        {step.label}
                                    </Typography>
                                </Paper>
                                <Typography 
                                    variant="overline" 
                                    sx={{ mt: 1, color: step.section === 'توسعه دهنده' ? '#0277bd' : '#2e7d32', fontWeight: 'bold' }}
                                >
                                    {step.section}
                                </Typography>
                            </Box>

                            {/* **تغییر ۳: پیکان اتصال معکوس و افقی** */}
                            {index < FLOW_STEPS.length - 1 && (
                                <Box sx={{ 
                                    flexGrow: 1, // برای پر کردن فاصله
                                    height: '2px', 
                                    mx: 1, 
                                    bgcolor: '#cfd8dc', 
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    maxWidth: { xs: '80px', md: '100px' } 
                                }}>
                                    <ArrowBack sx={{ 
                                        color: '#90a4ae', 
                                        fontSize: 32, 
                                        position: 'absolute',
                                        bgcolor: 'white', // برای پوشاندن خط زیر پیکان
                                        borderRadius: '50%',
                                        p: 0.5,
                                    }} />
                                </Box>
                            )}
                        </React.Fragment>
                    ))}
                </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* بخش توضیحات */}
            <Typography 
                variant="body2" 
                sx={{ 
                    textAlign: 'justify', 
                    lineHeight: 2, 
                    color: '#555',
                    p: { xs: 1, sm: 2 },
                    bgcolor: '#f5f5f5',
                    borderRadius: '8px',
                    direction: 'rtl' // اطمینان از راست به چپ بودن متن
                }}
            >
                {/* استفاده از dangerouslySetInnerHTML برای اعمال Bold در JSX */}
                <span dangerouslySetInnerHTML={{ __html: FLOW_DESCRIPTION.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
            </Typography>
        </Paper>
    );
};


// ------------------ کامپوننت اصلی ------------------

export default function Dashboard() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<number | null>(null);

  /**
   * رندر کردن آیتم‌های داخلی گرید با اندازه ستون مشخص
   */
  const renderGridItem = (item: DashboardItem, cols: 6 | 4 | 3) => (
    <Grid key={item.id}  size={{xs:cols,sm:cols,md:cols}}  sx={{ p: 1 }}> 
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
   * رندر کردن کل یک بخش داشبورد (با حفظ نسبت 4:8)
   */
  const renderSection = (title: string, items: DashboardItem[], titleColor: string, itemCols: 6 | 4 | 3, mainCols: 12 | 6 | 8 | 4) => (
    <Grid size={{xs:12,md:mainCols}}  key={title}> 
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
      <Grid container spacing={3} maxWidth="1200px" sx={{
        display:'flex',
        alignItems:'start',
        justifyContent:'center',
      }} > 

        {/* ------------------ بلوک روند کار (Flowchart) ------------------ */}
        <Grid  size={{xs:12}}>
            <StepFlow />
        </Grid>
        {/* ------------------------------------------------------------------- */}

        {/* 1. بخش مدیریت کاربران: 4/12 عرض */}
        {renderSection(
          "بخش‌های ماک‌آپ مدیریت کاربران",
          USER_MANAGEMENT_ITEMS,
          "#333",
          4, // 2 ستون داخلی
          6 // 4 واحد از 12 واحد عرض کل
        )}

        {/* 2. بخش توسعه‌دهندگان: 8/12 عرض */}
        {renderSection(
          "ابزارهای توسعه‌دهندگان",
          DEVELOPER_ITEMS,
          "#333",
          4, // 3 ستون داخلی
          6// 8 واحد از 12 واحد عرض کل
        )}
        
      </Grid>
    </Box>
  );
}