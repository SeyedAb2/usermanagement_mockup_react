import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import {
  ExpandMore,
  Search,
  Home,
  Add,
  ChevronLeft,
} from "@mui/icons-material";

import {
  Dashboard,
  People,
  LocalShipping,
  LocalMall,
  AccountBalanceWallet,
  Calculate,
  Paid,
  DirectionsCar,
  AccountBalance,
  BusinessCenter,
  Assignment,
  // آیکون‌های جدید برای دسته‌بندی‌ها
  Work, // برای مدیریتی
  AttachMoney, // برای مالی
  Build, // برای عملیاتی
  NotInterested, // برای ندارد/بدون دسته‌بندی
} from "@mui/icons-material";

import { useMemo, useState } from "react";
// فرض: این کامپوننت‌ها از مسیرهای نسبی زیر وجود دارند
import DeleteConfirmModal from "../../components/access/DeleteConfirmModal";
import { LabelPosition } from "../../shared/utils/textFieldLabelStyleConfig";
// فرض: این utility برای تنظیم استایل Label TextField وجود دارد



// ------------------ تایپ‌ها ------------------
type ServicePerm = { key: string; label: string; checked?: boolean };
type RoutePerm = { path: string; label: string; checked?: boolean };

// اصلاح نام تایپ برای جلوگیری از تداخل با کامپوننت MenuItem از MUI
type MenuItemType = {
  id: string;
  group: string; // گروه‌بندی منو (برای سرچ)
  titleFa: string;
  titleEn: string;
  icon?: React.ReactNode;
  services: ServicePerm[];
  routes: RoutePerm[];
};

type UserMenuAccess = {
  id: string; // همان id منو
  priority: number;
  category?: string | null;
  defaultTitleFa: string; // نام‌پیش فرض اصلی
  defaultTitleEn: string;
  customTitleFa: string; // نامی که کاربر انتخاب کرده است (اگر انتخاب نکرده باشد، برابر با defaultTitleFa است)
  services: ServicePerm[];
  routes: RoutePerm[];
};

// ------------------ تعریف ساختار جدید دسته‌بندی‌ها به همراه آیکون ------------------

type CategoryData = {
    key: string; // مقدار اصلی برای ذخیره در state
    label: string; // نام نمایشی
    icon: React.ReactNode; // آیکون Material UI
};

const CATEGORIES_DATA: CategoryData[] = [
    { key: "ندارد", label: "ندارد", icon: <NotInterested color="disabled" /> },
    { key: "مدیریتی", label: "مدیریتی", icon: <Work color="primary" /> },
    { key: "مالی", label: "مالی", icon: <AttachMoney color="success" /> },
    { key: "عملیاتی", label: "عملیاتی", icon: <Build color="warning" /> },
];

const INIT_CATEGORIES = CATEGORIES_DATA.map(c => c.key);


// ------------------ داده‌های ساختگی ------------------

const MOCK_MENUS: MenuItemType[] = [
  {
    id: "dashboard",
    group: "داشبورد",
    titleFa: "داشبورد عمومی پرورش",
    titleEn: "farm/dashboard",
    icon: <Dashboard />,
    services: [
      { key: "submitActionService", label: "ثبت کاربران ترابری" },
      { key: "approveSlaughterService", label: "تأیید مدیر کشتارگاه" },
      { key: "approveSeniorService", label: "تایید مدیر ارشد" },
      { key: "deleteRequestService", label: "حذف درخواست توسط مدیر ارشد" },
    ],
    routes: [
      { path: "/farm/dashboard/submit", label: "ارسال فرم" },
      { path: "/farm/dashboard/home", label: "خانه داشبورد" },
    ],
  },
  {
    id: "users",
    group: "کاربران",
    titleFa: "مدیریت کاربران",
    titleEn: "users",
    icon: <People />,
    services: [
      { key: "userAdd", label: "افزودن کاربر" },
      { key: "userEdit", label: "ویرایش کاربر" },
      { key: "userDelete", label: "حذف کاربر" },
      { key: "userResetPassword", label: "بازنشانی رمز عبور" },
    ],
    routes: [
      { path: "/users/list", label: "لیست کاربران" },
      { path: "/users/create", label: "افزودن کاربر" },
      { path: "/users/roles", label: "نقش‌ها و سطح دسترسی" },
    ],
  },
  // ... (بقیه MOCK_MENUS برای حفظ حجم داده‌های ساختگی)
  {
    id: "transport",
    group: "ترابری",
    titleFa: "مدیریت ترابری",
    titleEn: "transport",
    icon: <LocalShipping />,
    services: [
      { key: "transportRequest", label: "ثبت درخواست حمل" },
      { key: "transportApprove", label: "تأیید حمل توسط مدیر" },
      { key: "transportCancel", label: "لغو درخواست حمل" },
    ],
    routes: [
      { path: "/transport/requests", label: "لیست درخواست‌ها" },
      { path: "/transport/tracking", label: "پیگیری حمل" },
    ],
  },
  {
    id: "logistics",
    group: "حمل و نقل",
    titleFa: "مدیریت حمل و نقل",
    titleEn: "logistics",
    icon: <LocalMall />,
    services: [
      { key: "vehicleAdd", label: "افزودن وسیله نقلیه" },
      { key: "routePlan", label: "برنامه‌ریزی مسیر" },
      { key: "fuelControl", label: "کنترل سوخت" },
    ],
    routes: [
      { path: "/logistics/vehicles", label: "وسایل نقلیه" },
      { path: "/logistics/routes", label: "مسیرها" },
    ],
  },
  {
    id: "pettyCash",
    group: "مالی",
    titleFa: "تنخواه گردان",
    titleEn: "petty-cash",
    icon: <AccountBalanceWallet />,
    services: [
      { key: "cashRequest", label: "درخواست تنخواه" },
      { key: "cashApprove", label: "تأیید پرداخت" },
      { key: "cashReport", label: "گزارش هزینه‌ها" },
    ],
    routes: [
      { path: "/petty-cash/list", label: "لیست درخواست‌ها" },
      { path: "/petty-cash/report", label: "گزارش تنخواه" },
    ],
  },
  {
    id: "accounting",
    group: "مالی",
    titleFa: "حسابداری",
    titleEn: "accounting",
    icon: <Calculate />,
    services: [
      { key: "invoiceRegister", label: "ثبت فاکتور" },
      { key: "balanceCheck", label: "بررسی تراز مالی" },
      { key: "expenseReport", label: "گزارش هزینه‌ها" },
    ],
    routes: [
      { path: "/accounting/invoices", label: "فاکتورها" },
      { path: "/accounting/balance", label: "تراز مالی" },
    ],
  },
  {
    id: "finance",
    group: "مالی",
    titleFa: "امور مالی",
    titleEn: "finance",
    icon: <Paid />,
    services: [
      { key: "paymentRequest", label: "درخواست پرداخت" },
      { key: "budgetControl", label: "کنترل بودجه" },
      { key: "salaryManagement", label: "مدیریت حقوق و دستمزد" },
    ],
    routes: [
      { path: "/finance/payments", label: "پرداخت‌ها" },
      { path: "/finance/budget", label: "بودجه‌ها" },
    ],
  },
  {
    id: "drivers",
    group: "منابع انسانی",
    titleFa: "مدیریت رانندگان",
    titleEn: "drivers",
    icon: <DirectionsCar />,
    services: [
      { key: "driverAdd", label: "افزودن راننده" },
      { key: "driverLicenseCheck", label: "بررسی مدارک راننده" },
      { key: "driverPerformance", label: "ارزیابی عملکرد راننده" },
    ],
    routes: [
      { path: "/drivers/list", label: "لیست رانندگان" },
      { path: "/drivers/performance", label: "عملکرد رانندگان" },
    ],
  },
  {
    id: "treasury",
    group: "مالی",
    titleFa: "خزانه‌داری",
    titleEn: "treasury",
    icon: <AccountBalance />,
    services: [
      { key: "fundTransfer", label: "انتقال وجه" },
      { key: "depositControl", label: "کنترل سپرده‌ها" },
      { key: "cashFlow", label: "گردش نقدی" },
    ],
    routes: [
      { path: "/treasury/transfers", label: "انتقال‌ها" },
      { path: "/treasury/overview", label: "نمای کلی خزانه" },
    ],
  },
  {
    id: "management",
    group: "سازمان",
    titleFa: "مدیریت کل",
    titleEn: "management",
    icon: <BusinessCenter />,
    services: [
      { key: "staffManage", label: "مدیریت پرسنل" },
      { key: "departmentControl", label: "کنترل واحدها" },
      { key: "reportAnalytics", label: "گزارشات و تحلیل‌ها" },
    ],
    routes: [
      { path: "/management/departments", label: "واحدها" },
      { path: "/management/reports", label: "گزارشات" },
    ],
  },
  {
    id: "deputy",
    group: "سازمان",
    titleFa: "معاونت‌ها",
    titleEn: "deputy",
    icon: <Assignment />,
    services: [
      { key: "assignProjects", label: "اختصاص پروژه‌ها" },
      { key: "reviewReports", label: "بررسی گزارشات" },
      { key: "approvalRequests", label: "تأیید درخواست‌ها" },
    ],
    routes: [
      { path: "/deputy/projects", label: "پروژه‌ها" },
      { path: "/deputy/reports", label: "گزارشات معاونت" },
    ],
  },
];

// فرض: لیست نام‌های منوی مجاز برای جایگزینی
const MENU_NAMES_OPTIONS = [
    "داشبورد عمومی پرورش",
    "مدیریت کاربران",
    "ترابری",
    "حسابداری",
    "امور مالی",
    "مدیریت کل",
];

// ------------------ کامپوننت فرم انتخاب/ویرایش ------------------

interface MenuSelectionFormProps {
    m: UserMenuAccess;
    isEditing: boolean; // برای ستون وسط: حالت ویرایش است
    isAdding: boolean; // برای ستون راست: حالت افزودن است
    categories: string[];
    getCategoryDisplay: (key: string | null | undefined) => { label: string, icon: React.ReactNode };
    // هندلرهای عمومی
    handleEditChange: <K extends keyof UserMenuAccess>(menuId: string, k: K, v: UserMenuAccess[K]) => void;
    toggleService: (menuId: string, key: string) => void;
    toggleRoute: (menuId: string, path: string) => void;
    // هندلرهای نهایی
    handleEditSave: () => void; // برای ستون وسط (تأیید ویرایش)
    handleDelete?: (id: string) => void; // برای ستون وسط (حذف)
    handleAddFinal: () => void; // برای ستون راست (تأیید و افزودن)
    
}

const MenuSelectionForm: React.FC<MenuSelectionFormProps> = ({
    m,
    isEditing,
    isAdding,
    categories,
    getCategoryDisplay,
    handleEditChange,
    toggleService,
    toggleRoute,
    handleEditSave,
    handleDelete,
    handleAddFinal,
}) => {
    
    // اگر در حال ویرایش نیست و در حالت افزودن هم نیست، خلاصه را نشان بده (فقط برای ستون وسط)
    if (!isEditing && !isAdding) {
        return (
            <AccordionDetails>
                <Typography fontWeight={700} mb={1}>
                    دسترسی سرویس‌ها
                </Typography>
                <Stack>
                    {m.services.filter(s => s.checked).length > 0 ? (
                        m.services.filter(s => s.checked).map((s) => (
                            <Typography key={s.key} variant="body2">
                                • {s.label}
                            </Typography>
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            (سرویسی انتخاب نشده)
                        </Typography>
                    )}
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Typography fontWeight={700} mb={1}>
                    آدرس‌های داخلی
                </Typography>
                <Stack>
                    {m.routes.filter(r => r.checked).length > 0 ? (
                        m.routes.filter(r => r.checked).map((r) => (
                            <Typography key={r.path} variant="body2">
                                ↳ {r.label}
                                <Typography variant="caption" color="text.secondary" dir="ltr" ml={1}>
                                    {r.path}
                                </Typography>
                            </Typography>
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            (آدرسی انتخاب نشده)
                        </Typography>
                    )}
                </Stack>
            </AccordionDetails>
        );
    }

    // در حالت ویرایش یا افزودن: فرم کامل
    return (
      <AccordionDetails>
        <Stack spacing={2} pb={2}>
          {/* 🔹 انتخاب نام منو */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              select
              sx={{ ...LabelPosition({ right: 25, rightActive: 30 }) }}
              label="انتخاب نام منو"
              fullWidth
              value={m.customTitleFa}
              onChange={(e) => handleEditChange(m.id, "customTitleFa", e.target.value)}
            >
                <MenuItem value={m.defaultTitleFa} disabled>
                    (نام‌پیش فرض: {m.defaultTitleFa})
                </MenuItem>
              {MENU_NAMES_OPTIONS.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </TextField>
            <IconButton
              color="success"
              sx={{
                bgcolor: "rgba(46, 125, 50, 0.1)",
                mx: 1,
                width: 40,
                height: 40,
                flexShrink: 0
              }}
              title="افزودن نام منو"
            >
              <Add />
            </IconButton>
          </Box>

          {/* 🔹 دسته‌بندی */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              sx={{ ...LabelPosition({ right: 25, rightActive: 30 }) }}
              select
              label="انتخاب دسته‌بندی"
              fullWidth
              value={m.category || ""}
              onChange={(e) => handleEditChange(m.id, "category", e.target.value)}
              SelectProps={{
                renderValue: (selectedValue: unknown) => {
                  const categoryKey = selectedValue as string;
                  // اطمینان از اینکه کلید 'ندارد' به درستی در حالت خالی رندر شود
                  const finalKey = categoryKey === "" ? "ندارد" : categoryKey;
                  const cInfo = getCategoryDisplay(finalKey);

                  return (
                    <Box 
                      sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1, 
                          // تنظیم موقعیت عمودی برای هم‌راستایی بهتر محتوا درون فیلد ورودی
                          position: 'relative', 
                          top: 1, 
                      }}
                    >
                      {cInfo.icon}
                      <Typography component="span" sx={{ lineHeight: 'normal' }}>
                        {cInfo.label}
                      </Typography>
                    </Box>
                  );
                }
              }}
            >
              {categories.map((cKey) => {
                const cInfo = getCategoryDisplay(cKey);
                return (
                    <MenuItem 
                        key={cKey} 
                        value={cKey} 
                        sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 1}}
                    >
                      {cInfo.icon}
                      {cInfo.label}
                    </MenuItem>
                );
              })}
            </TextField>
            <IconButton
              color="success"
              sx={{
                bgcolor: "rgba(46, 125, 50, 0.1)",
                mx: 1,
                width: 40,
                height: 40,
                flexShrink: 0
              }}
              title="افزودن دسته‌بندی"
              
            >
              <Add />
            </IconButton>
          </Box>

          {/* 🔹 شماره اولویت */}
          <TextField
            sx={{ ...LabelPosition({ right: 25, rightActive: 30 }) }}
            type="number"
            label="اولویت (برحسب نقش)"
            fullWidth
            value={m.priority}
            onChange={(e) => handleEditChange(m.id, "priority", Number(e.target.value) || 1)}
          />

          {/* 🔹 دسترسی سرویس‌ها */}
          <Box p={2} component={Paper} variant="outlined" sx={{ borderColor: "#cfd8dc", bgcolor: "#fafafa", borderRadius: 2 }}>
            <Typography fontWeight={700} mb={1}>
              دسترسی سرویس‌ها
            </Typography>
            <Stack spacing={1}>
              {m.services.map((s) => (
                <FormControlLabel
                  key={s.key}
                  control={
                    <Checkbox
                      checked={!!s.checked}
                      onChange={() => toggleService(m.id, s.key)}
                    />
                  }
                  label={s.label}
                />
              ))}
            </Stack>
          </Box>

          {/* 🔹 آدرس‌های داخلی */}
          <Box p={2} component={Paper} variant="outlined" sx={{ borderColor: "#cfd8dc", bgcolor: "#fafafa", borderRadius: 2 }}>
            <Typography
              sx={{ color: "#2e7d32", fontWeight: 700, mb: 1.5, direction: "ltr" }}
            >
              /{m.defaultTitleEn}
            </Typography>
            <Stack spacing={1}>
              {m.routes.map((r) => (
                <FormControlLabel
                  key={r.path}
                  control={
                    <Checkbox
                      checked={!!r.checked}
                      onChange={() => toggleRoute(m.id, r.path)}
                    />
                  }
                  label={
                    <Stack direction="column" spacing={0} alignItems="flex-start">
                        <Typography variant="body2">{r.label}</Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#2e7d32",
                            fontFamily: "monospace",
                            direction: "ltr",
                          }}
                        >
                          {r.path}
                        </Typography>
                    </Stack>
                  }
                />
              ))}
            </Stack>
          </Box>
        </Stack>
        {/* دکمه‌های نهایی بر اساس حالت (افزودن یا ویرایش) */}
        <Box sx={{display: 'flex', justifyContent: 'flex-end', gap: 1, pt:1}}>
            {isEditing && handleDelete && (
                <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(m.id)}>
                    حذف
                </Button>
            )}
            {isEditing && (
                <Button size="small" variant="contained" color="success" onClick={handleEditSave}>
                    تأیید
                </Button>
            )}
            {isAdding && (
                <Button
                    size="small"
                    variant="contained"
                    onClick={handleAddFinal}
                    sx={{ bgcolor: "#085E42", "&:hover": { bgcolor: "#064b35" } }}
                >
                    تأیید و افزودن
                </Button>
            )}
        </Box>
      </AccordionDetails>
    );
};


export default function UserAccessManagement() {
  const [search, setSearch] = useState("");
  const [categories] = useState<string[]>(INIT_CATEGORIES);
  // ID منوی باز در ستون راست (جستجو)
  const [resultsExpanded, setResultsExpanded] = useState<string | false>(false);
  // ID منوی در حال ویرایش (آکاردئون باز ستون وسط)
  const [editMenuId, setEditMenuId] = useState<string | null>(null); 
  
  // State موقت برای نگه داشتن داده‌های فرم ستون راست
  const [tempMenuAccess, setTempMenuAccess] = useState<UserMenuAccess | null>(null);

  // ستون وسط: دسترسی‌های فعلی کاربر
  const [userAccess, setUserAccess] = useState<UserMenuAccess[]>([]);

  // مودال‌ها
  const [deleteOpen, setDeleteOpen] = useState<{
    open: boolean;
    id?: string;
  }>({ open: false });
  
  // ------------------ منطق‌های محاسباتی و کمکی ------------------
  
  // ابزاری برای پیدا کردن آیکون و نام نمایشی بر اساس کلید دسته‌بندی
  const getCategoryDisplay = (key: string | null | undefined): { label: string, icon: React.ReactNode } => {
    const data = CATEGORIES_DATA.find(c => c.key === key);
    if (data) return data;
    
    if (key === null || key === undefined || key === "" || key === "بدون دسته‌بندی") {
        return { label: "بدون دسته‌بندی", icon: <NotInterested color="disabled" /> };
    }
    
    return { label: key, icon: <ChevronLeft color="inherit" /> };
  };


  const filteredMenus = useMemo(() => {
    const s = search.trim();
    if (!s) return MOCK_MENUS;
    return MOCK_MENUS.filter(
      (m) =>
        m.group.includes(s) ||
        m.titleFa.includes(s) ||
        m.titleEn.toLowerCase().includes(s.toLowerCase())
    );
  }, [search]);

  // دسترسی‌های مدیر واحد پرورش گروه‌بندی شده بر اساس دسته‌بندی برای پیش‌نمایش
  const { categorizedMenus, noCategoryMenus } = useMemo(() => {
    const map = new Map<string, UserMenuAccess[]>();
    
    // منوهای بدون دسته‌بندی/ندارد را جدا می‌کنیم و بر اساس اولویت مرتب می‌کنیم
    const noCatMenus = userAccess
        .filter(m => !m.category || m.category === "ندارد")
        .sort((a, b) => a.priority - b.priority);

    // منوهای دسته‌بندی شده را گروه‌بندی و مرتب می‌کنیم
    userAccess
        .filter(m => m.category && m.category !== "ندارد")
        .forEach(m => {
            const cat = m.category as string;
            if (!map.has(cat)) map.set(cat, []);
            map.get(cat)!.push(m);
        });

    // مرتب‌سازی لیست منوها درون هر دسته‌بندی بر اساس اولویت
    map.forEach(menuList => menuList.sort((a, b) => a.priority - b.priority));

    // مرتب‌سازی دسته‌بندی‌ها بر اساس نام فارسی
    const categorizedList = Array.from(map.entries()).sort(([a], [b]) => 
      a.localeCompare(b, 'fa')
    );
    
    return { categorizedMenus: categorizedList, noCategoryMenus: noCatMenus };

  }, [userAccess]);
  
  // ------------------ هندلرهای رویداد ------------------

  // هندلر برای تغییرات در فرم موقت ستون راست
  const handleTempMenuChange = <K extends keyof UserMenuAccess>(menuId: string, k: K, v: UserMenuAccess[K]) => {
    setTempMenuAccess(prev => prev ? { ...prev,menuId, [k]: v } : null);
  };
  
  // هندلر برای تغییرات در چک‌باکس‌های فرم موقت ستون راست
  const toggleTempService = (menuId: string, key: string) => {
    setTempMenuAccess((prev) =>
      prev
        ? {
            ...prev,
            menuId,
            services: prev.services.map((s) =>
              s.key === key ? { ...s, checked: !s.checked } : s
            ),
          }
        : null
    );
  };

  const toggleTempRoute = (menuId: string, path: string) => {
    setTempMenuAccess((prev) =>
      prev
        ? {
          
            ...prev,
            menuId,
            routes: prev.routes.map((r) =>
              r.path === path ? { ...r, checked: !r.checked } : r
            ),
          }
        : null
    );
  };

  // هندلر نهایی برای افزودن از ستون راست
  const handleAddFinal = () => {
    if (!tempMenuAccess) return;
    
    // اگر قبلاً اضافه شده بود، نیازی به افزودن دوباره نیست
    const exists = userAccess.find((x) => x.id === tempMenuAccess.id);
    if (!exists) {
      // افزودن منوی موقت به لیست اصلی کاربر
      const newMenu = { 
          ...tempMenuAccess,
          priority: tempMenuAccess.priority || userAccess.length + 1, // اگر اولویت تنظیم نشده بود، اولویت پیش فرض
      };
      setUserAccess((prev) => [...prev, newMenu]);
    }

    // بستن تمامی آکاردئون‌ها (ستون راست و وسط)
    setResultsExpanded(false); 
    setEditMenuId(null); 
    setTempMenuAccess(null);
  };

  // ------------------ هندلرهای ستون وسط ------------------

  const handleEditChange = <K extends keyof UserMenuAccess>(menuId: string, k: K, v: UserMenuAccess[K]) => {
    setUserAccess((prev) =>
      prev.map((m) =>
        m.id === menuId
          ? { ...m, [k]: v }
          : m
      )
    );
  };

  const toggleService = (menuId: string, key: string) => {
    setUserAccess((prev) =>
      prev.map((m) =>
        m.id === menuId
          ? {
              ...m,
              services: m.services.map((s) =>
                s.key === key ? { ...s, checked: !s.checked } : s
              ),
            }
          : m
      )
    );
  };

  const toggleRoute = (menuId: string, path: string) => {
    setUserAccess((prev) =>
      prev.map((m) =>
        m.id === menuId
          ? {
              ...m,
              routes: m.routes.map((r) =>
                r.path === path ? { ...r, checked: !r.checked } : r
              ),
            }
          : m
      )
    );
  };

  const handleDelete = (id: string) => {
    setUserAccess((prev) => prev.filter((x) => x.id !== id));
    setDeleteOpen({ open: false, id: undefined });
    if (editMenuId === id) setEditMenuId(null);
  };
  
  const handleEditSave = () => {
    setEditMenuId(null); 
  }


  // هندلر برای باز و بسته شدن آکاردئون‌های ستون راست
  const handleResultAccordionChange = (menuId: string, isExpanded: boolean) => {
    setResultsExpanded(isExpanded ? menuId : false);
    if (isExpanded) {
        // اگر آکاردئون باز شده، داده‌های آن را به tempMenuAccess منتقل کن
        const menu = MOCK_MENUS.find(m => m.id === menuId);
        if (menu) {
            setTempMenuAccess({
                id: menu.id,
                priority: userAccess.length + 1, // اولویت پیش فرض
                category: "ندارد", 
                defaultTitleFa: menu.titleFa,
                defaultTitleEn: menu.titleEn,
                customTitleFa: menu.titleFa,
                // همه سرویس‌ها و مسیرها در حالت افزودن باید فعال باشند
                services: menu.services.map((s) => ({ ...s, checked: true })),
                routes: menu.routes.map((r) => ({ ...r, checked: true })),
            });
        }
    } else {
        // اگر آکاردئون بسته شد، tempMenuAccess را پاک کن
        setTempMenuAccess(null);
    }
  };


  // ------------------ کامپوننت اصلی ------------------

  return (
    <Box sx={{ bgcolor: "#f5f7f6", minHeight: "100vh", p: 2, direction: "rtl" }}>
      {/* هدر کوچک مشخصات کاربر */}
      <Paper
        sx={{
          borderRadius: 2,
          p: 2,
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box >
            <Typography sx={{mx:1}} fontWeight={700}>مدیر واحد پرورش</Typography>
            <Typography sx={{mx:1}} variant="body2" color="text.secondary">
               شناسه: 10234
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* سه ستون */}
      <Grid container spacing={2}>
        {/* ستون راست: جستجو و نتایج (آکاردئون) - عرض 3 */}
        <Grid size={{xs:12,md:3}}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography fontWeight={700} mb={1}>
              فرم جست‌وجوی منو
            </Typography>
            <TextField
              fullWidth
              placeholder="جست‌وجوی گروه‌بندی منو، نام فارسی یا آدرس انگلیسی…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <Search sx={{ mr: 1 }} /> }}
            />
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1}>
              {filteredMenus.map((m) => {
                const isExpanded = resultsExpanded === m.id;
                
                return (
                <Accordion
                  key={m.id}
                  expanded={isExpanded}
                  onChange={(_, ex) => handleResultAccordionChange(m.id, ex)} 
                  slotProps={{
                    transition: { timeout: 200 },
                  }}
                  sx={{
                    borderRadius: 2,
                    "&:before": { display: "none" },
                    border: isExpanded ? "2px solid #085E42" : "1px solid #e5e7eb",
                    bgcolor: isExpanded ? "#e8f5e9" : "#fff",
                  }}
                >
                  <AccordionSummary 
                    expandIcon={<ExpandMore />}
                    // تنظیم مارجین ثابت برای رفع پرش عرضی
                    sx={{'& .MuiAccordionSummary-content': {margin: '12px 0 !important'}}} 
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ width: "100%", justifyContent: "flex-start" }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <ListItemIcon sx={{ minWidth: 32 }}>{m.icon}</ListItemIcon>
                        <Box>
                          <Typography fontWeight={600}>{m.group}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {m.titleFa} — {m.titleEn}
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  </AccordionSummary>
                  
                  {/* استفاده از کامپوننت فرم کامل */}
                  {isExpanded && tempMenuAccess && tempMenuAccess.id === m.id && (
                    <MenuSelectionForm 
                        m={tempMenuAccess}
                        isEditing={false}
                        isAdding={true}
                        categories={categories}
                        getCategoryDisplay={getCategoryDisplay}
                        handleEditChange={handleTempMenuChange}
                        toggleService={toggleTempService}
                        toggleRoute={toggleTempRoute}
                        handleEditSave={() => {}} // هندلر لازم نیست
                        handleAddFinal={handleAddFinal}
                    />
                  )}
                </Accordion>
              );})}
            </Stack>
          </Paper>
        </Grid>

        {/* ستون وسط: دسترسی‌های انتخاب‌شده کاربر (با امکان ویرایش درون خطی) - عرض 6 */}
        <Grid size={{xs:12,md:6}} >
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography fontWeight={700} mb={1}>
              دسترسی‌های مدیر واحد پرورش
            </Typography>
            {userAccess.length === 0 ? (
              <Typography color="text.secondary">هنوز چیزی انتخاب نشده است…</Typography>
            ) : (
              <Stack spacing={1}>
                {userAccess.map((m) => {
                  const isEditing = editMenuId === m.id;
                  const categoryInfo = getCategoryDisplay(m.category);
                  
                  // عنوان آکاردئون
                  const title = (
                    <Box sx={{display:'flex',gap:1,alignItems:'center'}}>
                      {m.customTitleFa}
                      {(m.defaultTitleFa != m.customTitleFa) && (<Typography variant="body2" style={{ fontSize: '0.65rem', fontWeight: 'lighter', color: 'gray' }}>
                        ({m.defaultTitleFa})
                      </Typography>)}
                      
                    </Box>
                  );
                  
                  return (
                    <Accordion
                      key={m.id}
                      expanded={isEditing} // فقط زمانی باز باشد که در حال ویرایش است
                      onChange={(_, ex) => setEditMenuId(ex ? m.id : null)}
                      sx={{
                        borderRadius: 2,
                        "&:before": { display: "none" },
                        border: isEditing ? "2px solid #2e7d32" : "1px solid #d1e7dd",
                        bgcolor: isEditing ? "#e8f5e9" : "#f1f8f5",
                      }}
                    >
                      <AccordionSummary 
                        expandIcon={<ExpandMore />}
                        // تنظیم مارجین ثابت برای رفع پرش عرضی
                        sx={{'& .MuiAccordionSummary-content': {margin: '12px 0 !important'}}} 
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          sx={{ width: "100%", justifyContent: "space-between" }}
                        >
                          <Box>
                            <Typography fontWeight={700}>
                                {title}
                            </Typography>
                            <Typography sx={{display:'flex',gap:1, alignItems:'center'}} variant="caption" color="text.secondary" dir="rtl">
                                {/* نمایش آیکون و لیبل دسته‌بندی در خلاصه */}
                                {m.category || m.category === "ندارد"
                                    ? (<Box component="span" sx={{display: 'inline-flex', alignItems: 'center', gap: 0.5}}>
                                        {categoryInfo.icon}
                                        <span>دسته‌بندی: {categoryInfo.label} · </span>
                                      </Box>)
                                    : null
                                }
                              اولویت: {m.priority}
                            </Typography>
                          </Box>
                        </Stack>
                      </AccordionSummary>
                      
                      {/* محتوای داخلی: فرم ویرایش یا خلاصه دسترسی */}
                      <MenuSelectionForm 
                        m={m}
                        isEditing={isEditing} // حالت ویرایش را فعال می‌کند
                        isAdding={false}
                        categories={categories}
                        getCategoryDisplay={getCategoryDisplay}
                        handleEditChange={handleEditChange}
                        toggleService={toggleService}
                        toggleRoute={toggleRoute}
                        handleEditSave={handleEditSave}
                        handleDelete={(id) => setDeleteOpen({ open: true, id: id })}
                        handleAddFinal={() => {}} // هندلر لازم نیست
                        
                      />
                      
                    </Accordion>
                  );
                })}
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* ستون چپ: پیش‌نمایش ساختار درختی (بر اساس دسته‌بندی) - عرض 3 */}
        <Grid size={{xs:12,md:3}} >
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography fontWeight={700} mb={1}>
              پیش‌نمایش نهایی دسترسی‌ها
            </Typography>
            
            {categorizedMenus.length === 0 && noCategoryMenus.length === 0 ? (
                <Typography color="text.secondary" variant="body2">
                    (منویی انتخاب نشده است)
                </Typography>
            ) : (
                <Stack spacing={1}>
                    {/* ✅ نمایش منوهای بدون دسته‌بندی به صورت آیتم‌های مجزا با فاصله و بک‌گراند */}
                    {noCategoryMenus.length > 0 && (
                        <Stack spacing={1} mb={1}> 
                            {noCategoryMenus.map((m) => {
                                const menuIcon = MOCK_MENUS.find((item) => item.id === m.id)?.icon || <Home />;
                                return (
                                    <Box 
                                        key={m.id} 
                                        sx={{ 
                                            // حذف خط جداکننده برای آخرین آیتم
                                            border: '1px solid #ccc ' ,
                                            boxShadow:"0 1px 2px #aaa",
                                            borderRadius:'8px',
                                            background:'#F0F0F0',

                                        }}
                                    >
                                        <ListItem sx={{ pl: 1, pt: 1, pb: 1 }}>
                                            <ListItemIcon sx={{ minWidth: 28, color: '#085E42' }}>
                                                {menuIcon}
                                            </ListItemIcon>
                                            
                                            {/* ✅ شروع اصلاح: ادغام عنوان اصلی و عنوان پیش‌فرض در یک Stack */}
                                            <ListItemText disableTypography>
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <Typography fontWeight={600} variant="body2">
                                                        {m.customTitleFa}
                                                    </Typography>
                                                    {m.customTitleFa !== m.defaultTitleFa && (
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontWeight: 200,
                                                                fontSize: '0.675rem',
                                                                color: 'text.secondary',
                                                            }}
                                                        >
                                                            ({m.defaultTitleFa})
                                                        </Typography>
                                                    )}
                                                </Stack>
                                            </ListItemText>
                                            {/* پایان اصلاح */}
                                            
                                        </ListItem>
                                    </Box>
                                );
                            })}
                        </Stack>
                    )}
                    
                    {/* نمایش منوهای دسته‌بندی شده (داخل آکاردئون) */}
                    {categorizedMenus.map(([category, menus]) => {
                        const categoryInfo = getCategoryDisplay(category);
                        return (
                        <Accordion
                            key={category}
                            defaultExpanded={false} 
                            slotProps={{
                                transition: { timeout: 200 },
                            }}
                            sx={{
                                borderRadius: 2,
                                "&:before": { display: "none" },
                                border: "1px solid #ccc",
                                bgcolor: "#f0f0f0",
                            }}
                        >
                            <AccordionSummary 
                                expandIcon={<ExpandMore />}
                                sx={{ 
                                    cursor: 'pointer',
                                    pointerEvents: 'auto',
                                    '& .MuiAccordionSummary-content': {margin: '8px 0 !important'}
                                }}
                            >
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <ListItemIcon sx={{ minWidth: 28, color: '#3f51b5' }}>
                                        {categoryInfo.icon} 
                                    </ListItemIcon>
                                    <Typography fontWeight={700}>
                                        {categoryInfo.label}
                                    </Typography>
                                </Stack>
                            </AccordionSummary>

                            <AccordionDetails sx={{p: 0, borderTop: '1px solid #ccc'}}>
                                <List disablePadding dense>
                                  {/* منوهای داخل دسته‌بندی قبلاً بر اساس priority مرتب شده‌اند */}
                                  {menus.map((m, index) => {
                                    const menuIcon = MOCK_MENUS.find((item) => item.id === m.id)?.icon || <Home />;

                                    return (
                                      <Box 
                                        key={m.id} 
                                        sx={{ 
                                            // حذف خط جداکننده برای آخرین آیتم
                                            borderBottom: index < menus.length - 1 ? '1px solid #eee' : 'none',
                                            bgcolor: '#fff' 
                                        }}
                                      >
                                        <ListItem sx={{ pl: 2, pt: 1, pb: 1 }}>
                                          <ListItemIcon sx={{ minWidth: 28, color: '#085E42' }}>
                                            {menuIcon}
                                          </ListItemIcon>
                                          <ListItemText
                                            primary={
                                              <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Typography sx={{display:'flex',alignItems:'center',gap:1}} fontWeight={600} variant="body2">
                                                  {m.customTitleFa}
                                                  {m.customTitleFa !== m.defaultTitleFa && (
                                                    <Typography
                                                      variant="body2"
                                                      sx={{
                                                        fontWeight: 200,
                                                        fontSize: '0.675rem',
                                                        color: 'text.secondary',
                                                        marginLeft: 1,
                                                      }}
                                                    >
                                                      ({m.defaultTitleFa})
                                                    </Typography>
                                                  )}
                                                </Typography>
                                              </Stack>
                                            }
                                            secondaryTypographyProps={{
                                              dir: 'rtl',
                                              variant: 'caption',
                                              color: 'text.secondary',
                                            }}
                                          />
                                        </ListItem>
                                      </Box>
                                    );
                                  })}
                                </List>

                            </AccordionDetails>
                        </Accordion>
                    );})}
                </Stack>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* مودال تایید حذف */}
      <DeleteConfirmModal
        open={deleteOpen.open}
        title="حذف دسترسی"
        description="آیا از حذف این دسترسی مطمئن هستید؟"
        onCancel={() => setDeleteOpen({ open: false })}
        onConfirm={() => deleteOpen.id && handleDelete(deleteOpen.id)}
      />
    </Box>
  );
}